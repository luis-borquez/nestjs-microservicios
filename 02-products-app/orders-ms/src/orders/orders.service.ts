import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from 'src/prisma.service';
import { RpcException } from '@nestjs/microservices';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { ChangeOrderStatusDto } from './dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) { }

  async create(createOrderDto: CreateOrderDto) {
    return await this.prisma.order.create({ data: createOrderDto });
  }

  async findAll(orderPaginationDto: OrderPaginationDto) {
    const { page, limit, status } = orderPaginationDto;

    const totalOrders = await this.prisma.order.count({ where: { status: status } });
    const orders = await this.prisma.order.findMany({
      skip: (page! - 1) * limit!,
      take: limit,
      where: { status: status }
    });
    const lastPage = Math.ceil(totalOrders / limit!);

    return {
      meta: {
        page: page,
        limit: limit,
        total: totalOrders,
        lastPage: lastPage,
        next: ((totalOrders / limit!) > page!)
                ? `/api/orders${status ? '/' + status : ''}?page=${(page! + 1)}&limit=${limit}`
                : null,
        prev: (page! > 1)
                ? `/api/orders${status ? '/' + status : ''}?page=${(page! - 1)}&limit=${limit}`
                : null,
      },
      data: orders,
    }
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findFirst({ where: { id } });

    if (!order) {
      throw new RpcException({
        status: 'error',
        message: `Order not found with id ${id}`,
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    return order;
  }

  async changeStatus(changeOrderStatusDto: ChangeOrderStatusDto) {
    const { id, status } = changeOrderStatusDto;
    
    const order = await this.findOne(id);
    if (order.status === status) return order;

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: { status }
    });

    return updatedOrder;
  }
}

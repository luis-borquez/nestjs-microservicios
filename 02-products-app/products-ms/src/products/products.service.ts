import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma.service';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) { }

  async create(createProductDto: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: createProductDto
    });

    return product;
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const totalProducts = await this.prisma.product.count({ where: { available: true } });
    const products = await this.prisma.product.findMany({
      skip: (page! - 1) * limit!,
      take: limit,
      where: { available: true }
    });
    const lastPage = Math.ceil(totalProducts / limit!);

    return {
      meta: {
        page: page,
        limit: limit,
        total: totalProducts,
        lastPage: lastPage,
        next: ((totalProducts / limit!) > page!) ? `/products?page=${(page! + 1)}&limit=${limit}` : null,
        prev: (page! > 1) ? `/products?page=${(page! - 1)}&limit=${limit}` : null,
      },
      data: products,
    }
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findFirst({
      where: {
        id: id,
        available: true
      }
    });

    if (!product) {
      throw new NotFoundException(`Product not found with id ${id}`);
    }

    return product;
  }

  async findOneByName(name: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        name: name
      }
    });

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id);
    const { id: __, ...data } = updateProductDto;

    if (data.name) {
      const existsByName = await this.findOneByName(data.name);

      if (existsByName && id !== existsByName.id) {
        throw new BadRequestException(`Product with name ${data.name} already exists`);
      }
    }

    return await this.prisma.product.update({
      where: {
        id,
      },
      data: data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    // return await this.prisma.product.delete({ where: { id } }); // Hard delete
    const product = await this.prisma.product.update({
      where: { id },
      data: { available: false }
    }); // Soft delete
    
    return product
  }
}

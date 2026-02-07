import { Injectable, Logger } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg'; // PostgreSQL
import { PrismaClient } from 'generated/prisma/client';
import { envs } from './config';


@Injectable()
export class PrismaService extends PrismaClient {
  private readonly logger = new Logger('PrismaService');

  constructor() {
    const adapter = new PrismaPg({ 
        connectionString: envs.POSTGRES_URL 
    }); 

    super({ adapter });

    this.logger.log('Database connected');
  }
}
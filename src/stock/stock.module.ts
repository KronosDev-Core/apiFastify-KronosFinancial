import { PrismaService } from './../prisma/prisma.service';
import { Module } from '@nestjs/common';
import { StockController } from './stock.controller';

@Module({
  controllers: [StockController],
  providers: [PrismaService],
})
export class StockModule {}

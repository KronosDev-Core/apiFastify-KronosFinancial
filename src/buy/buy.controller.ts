import { Buy as Model } from '@prisma/client';
import {
  Body,
  Controller,
  Param,
  Get,
  Post,
  Put,
  Delete,
} from '@nestjs/common';

import { PrismaService } from './../prisma/prisma.service';

@Controller('api')
export class BuyController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get('buys')
  async getAllBuys(): Promise<Model[]> {
    return this.prismaService.buy.findMany({
      include: { stock: true, sell: true },
    });
  }

  @Get('buy/:id')
  async getBuyById(@Param('id') id: string): Promise<Model | null> {
    return this.prismaService.buy.findUnique({
      where: { id: id },
      include: { stock: true, sell: true },
    });
  }

  @Post('buy')
  async createBuy(
    @Body()
    postData: {
      date: Date;
      price: number;
      amount: number;
      stockSymbol: string;
    },
  ): Promise<Model> {
    const { stockSymbol, ...rest } = postData;
    return this.prismaService.buy.create({
      data: {
        ...rest,
        stock: {
          connect: { symbol: postData.stockSymbol },
        },
      },
    });
  }

  @Put('buy/:id')
  async updateBuy(
    @Param('id') id: string,
    @Body()
    postData: {
      date?: Date;
      price?: number;
      amount?: number;
      stockSymbol?: string;
    },
  ): Promise<Model> {
    const { stockSymbol, ...rest } = postData;
    return this.prismaService.buy.update({
      where: { id: id },
      data: {
        ...rest,
        stock: {
          connect: { symbol: postData.stockSymbol },
        },
      },
    });
  }

  @Delete('buy/:id')
  async deleteBuy(@Param('id') id: string): Promise<Model> {
    return this.prismaService.buy.delete({
      where: { id: id },
    });
  }
}

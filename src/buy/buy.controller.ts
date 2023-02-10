import { Buy as Model, BuyStatus } from '@prisma/client';
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
      include: {
        dividende: {
          include: {
            stock: true,
          },
        },
        sell: true,
      },
    });
  }

  @Get('buy/:id')
  async getBuyById(@Param('id') id: string): Promise<Model | null> {
    return this.prismaService.buy.findUnique({
      where: { id: id },
      include: {
        dividende: {
          include: {
            stock: true,
          },
        },
        sell: true,
      },
    });
  }

  @Post('buy')
  async createBuy(
    @Body()
    postData: {
      date: string;
      price: number;
      amount: number;
      dividendeId: string;
    },
  ): Promise<Model> {
    const { dividendeId, date, ...rest } = postData;
    return this.prismaService.buy.create({
      data: {
        ...rest,
        status: BuyStatus.PENDING,
        date: new Date(date.replace('Z', '')),
        dividende: {
          connect: { id: postData.dividendeId },
        },
      },
    });
  }

  @Put('buy/:id')
  async updateBuy(
    @Param('id') id: string,
    @Body()
    postData: {
      date?: string;
      price?: number;
      amount?: number;
      dividendeId?: string;
      status?: BuyStatus;
    },
  ): Promise<Model> {
    const { dividendeId, date } = postData;
    var data: any = postData;
    if (date) {
      data.date = new Date(date.replace('Z', ''));
    }
    if (dividendeId) {
      data.dividende = {
        connect: { id: postData.dividendeId },
      };
    }
    console.log(data);
    return this.prismaService.buy.update({
      where: { id: id },
      data: data,
    });
  }

  @Delete('buy/:id')
  async deleteBuy(@Param('id') id: string): Promise<Model> {
    return this.prismaService.buy.delete({
      where: { id: id },
    });
  }
}

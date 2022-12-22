import { Sell as Model } from '@prisma/client';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Controller('api')
export class SellController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get('sells')
  async getAllSell(): Promise<Model[]> {
    return this.prismaService.sell.findMany({
      include: {
        buy: {
          include: {
            dividende: {
              include: {
                stock: true,
              },
            },
          },
        },
      },
    });
  }

  @Get('sell/:id')
  async getSellBySymbol(@Param('id') id: string): Promise<Model | void> {
    this.prismaService.sell.findUnique({
      where: { id: id },
      include: {
        buy: {
          include: {
            dividende: {
              include: {
                stock: true,
              },
            },
          },
        },
      },
    });
  }

  @Post('sell')
  async createSell(
    @Body()
    postData: {
      date: string;
      price: number;
      buyId: string;
    },
  ): Promise<Model> {
    const { buyId, date, ...rest } = postData;
    return this.prismaService.sell.create({
      data: {
        ...rest,
        date: new Date(date.replace('Z', '')),
        buy: {
          connect: { id: buyId },
        },
      },
    });
  }

  @Put('sell/:id')
  async updateSell(
    @Param('id') id: string,
    @Body()
    postData: {
      date?: string;
      price?: number;
      buyId?: string;
    },
  ): Promise<Model> {
    const { buyId, date, ...rest } = postData;
    var data: any = { ...rest };

    if (date) {
      data.date = new Date(date.replace('Z', ''));
    }

    if (buyId) {
      data.buy = {
        connect: { id: buyId },
      };
    }

    return this.prismaService.sell.update({
      where: { id: id },
      data: data,
    });
  }

  @Delete('sell/:id')
  async deleteSell(@Param('id') id: string): Promise<Model> {
    return this.prismaService.sell.delete({
      where: { id: id },
    });
  }
}

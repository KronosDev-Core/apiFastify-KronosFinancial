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
      include: { buy: true },
    });
  }

  @Get('sell/:id')
  async getSellBySymbol(@Param('id') id: string): Promise<Model | void> {
    this.prismaService.sell.findUnique({
      where: { id: id },
      include: { buy: true },
    });
  }

  @Post('sell')
  async createSell(
    @Body()
    postData: {
      date: Date;
      price: number;
      buyId: string;
    },
  ): Promise<Model> {
    return this.prismaService.sell.create({
      data: postData,
    });
  }

  @Put('sell/:id')
  async updateSell(
    @Param('id') id: string,
    @Body()
    postData: {
      date?: Date;
      price?: number;
      buyId?: string;
    },
  ): Promise<Model> {
    return this.prismaService.sell.update({
      where: { id: id },
      data: postData,
    });
  }

  @Delete('sell/:id')
  async deleteSell(@Param('id') id: string): Promise<Model> {
    return this.prismaService.sell.delete({
      where: { id: id },
    });
  }
}

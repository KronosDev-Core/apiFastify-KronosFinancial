import { Stock as Model, Prisma, Status } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

@Controller('api')
export class StockController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get('stocks')
  async getAllStocks(): Promise<Model[]> {
    return this.prismaService.stock.findMany({
      include: { dividende: true, buy: { include: { sell: true } } },
    });
  }

  @Get('stock/:symbolOrId')
  async getStockBySymbol(
    @Param('symbolOrId') symbolOrId: string,
  ): Promise<Model | null> {
    return this.prismaService.stock.findUnique({
      where:
        symbolOrId.length > 10 ? { id: symbolOrId } : { symbol: symbolOrId },
      include: { dividende: true, buy: { include: { sell: true } } },
    });
  }

  @Post('stock')
  async createStock(
    @Body()
    userData: {
      symbol: string;
      name: string;
      sector: string;
      price: number;
      dividende: Prisma.DividendeCreateInput;
    },
  ): Promise<Model> {
    const postData = userData.dividende;
    return this.prismaService.stock.create({
      data: {
        ...userData,
        status: Status.NEW,
        dividende: { create: postData },
      },
    });
  }

  @Put('stock/:symbolOrId')
  async updateStock(
    @Param('symbolOrId') symbolOrId: string,
    @Body()
    postData: {
      name?: string;
      sector?: string;
      price?: number;
    },
  ): Promise<Model> {
    return this.prismaService.stock.update({
      where:
        symbolOrId.length > 10 ? { id: symbolOrId } : { symbol: symbolOrId },
      data: { ...postData, status: Status.UPDATED },
    });
  }

  @Delete('stock/:id')
  async deleteStock(@Param('id') id: string): Promise<Model> {
    console.log('deleteStock', id);
    return this.prismaService.stock.delete({
      where: { id: id },
    });
  }
}

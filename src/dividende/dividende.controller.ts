import { Dividende as Model, Status } from '@prisma/client';
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
export class DividendeController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get('dividendes')
  async getAllDividende(): Promise<Model[]> {
    return this.prismaService.dividende.findMany({
      include: { stock: true },
    });
  }

  @Get('dividende/:symbolOrId')
  async getDividendeById(@Param('symbolOrId') symbolOrId: string): Promise<Model | null> {
    return this.prismaService.dividende.findUnique({
      where: symbolOrId.length > 10 ? { id: symbolOrId } : { stockSymbol: symbolOrId },
      include: { stock: true },
    });
  }

  @Post('dividende')
  async createDividende(
    @Body()
    postData: {
      dateExDividende: Date;
      datePayment: Date;
      dividendePerShare: number;
      stockSymbol: string;
    },
  ): Promise<Model> {
    const { stockSymbol, ...rest } = postData;
    return this.prismaService.dividende.create({
      data: {
        ...rest,
        status: Status.NEW,
        stock: {
          connect: { symbol: postData.stockSymbol },
        },
      },
    });
  }

  @Put('dividende/:symbolOrId')
  async updateDividende(
    @Param('symbolOrId') symbolOrId: string,
    @Body()
    postData: {
      dateExDividende?: Date;
      datePayment?: Date;
      dividendePerShare?: number;
      stockSymbol?: string;
    },
  ): Promise<Model> {
    return this.prismaService.dividende.update({
      where: symbolOrId.length > 10 ? { id: symbolOrId } : { stockSymbol: symbolOrId },
      data: {...postData, status: Status.UPDATED},
    });
  }

  @Delete('dividende/:symbolOrId')
  async deleteDividende(@Param('symbolOrId') symbolOrId: string): Promise<Model> {
    return this.prismaService.dividende.delete({
      where: symbolOrId.length > 10 ? { id: symbolOrId } : { stockSymbol: symbolOrId },
    });
  }
}

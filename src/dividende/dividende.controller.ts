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
      include: {
        stock: true,
        buy: {
          include: {
            sell: true,
          },
        },
      },
    });
  }

  @Get('dividende/:id')
  async getDividendeById(@Param('id') id: string): Promise<Model | null> {
    return this.prismaService.dividende.findFirst({
      where: { id: id },
      include: {
        stock: true,
        buy: {
          include: {
            sell: true,
          },
        },
      },
    });
  }

  @Post('dividende')
  async createDividende(
    @Body()
    postData: {
      dateExDividende: string;
      datePayment: string;
      dividendePerShare: number;
      stockSymbol: string;
    },
  ): Promise<Model> {
    const { stockSymbol, dateExDividende, datePayment, ...rest } = postData;
    return this.prismaService.dividende.create({
      data: {
        ...rest,
        dateExDividende: new Date(dateExDividende.replace('Z', '')),
        datePayment: new Date(datePayment.replace('Z', '')),
        status: Status.NEW,
        stock: {
          connect: { symbol: postData.stockSymbol },
        },
      },
    });
  }

  @Put('dividende/:id')
  async updateDividende(
    @Param('id') id: string,
    @Body()
    postData: {
      dateExDividende?: string;
      datePayment?: string;
      dividendePerShare?: number;
      stockSymbol?: string;
    },
  ): Promise<Model> {
    const { stockSymbol, dateExDividende, datePayment } = postData;
    var data: any = { ...postData, status: Status.UPDATED };

    if (stockSymbol) {
      data.stock = {
        connect: { symbol: postData.stockSymbol },
      };
    }

    if (dateExDividende) {
      data.dateExDividende = new Date(dateExDividende.replace('Z', ''));
    }

    if (datePayment) {
      data.datePayment = new Date(datePayment.replace('Z', ''));
    }

    return this.prismaService.dividende.update({
      where: { id: id },
      data: data,
    });
  }

  @Delete('dividende/:id')
  async deleteDividende(@Param('id') id: string): Promise<Model> {
    return this.prismaService.dividende.delete({
      where: { id: id },
    });
  }
}

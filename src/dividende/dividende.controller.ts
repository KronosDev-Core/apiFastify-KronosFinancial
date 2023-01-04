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
  Query,
} from '@nestjs/common';

@Controller('api')
export class DividendeController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get('dividendes')
  async getAllDividende(
    @Query() query: { cursor: number; name: string; dateExDividende: string },
  ): Promise<Model[]> {
    var findManyOpts: any = {
      include: {
        stock: true,
        buy: {
          include: {
            sell: true,
          },
        },
      },
    };
    var whereOr: any[] = [];

    if (query.dateExDividende) {
      whereOr.push({
        dateExDividende: {
          gte: new Date(query.dateExDividende.replace('Z', '')),
        },
      });
    }

    if (query.name) {
      whereOr.push({
        stockSymbol: {
          contains: query.name,
          mode: 'insensitive',
        },
      });
    }

    if (whereOr.length > 0) {
      findManyOpts.where = { OR: whereOr };
    }

    findManyOpts.orderBy = {
      dateExDividende: 'asc',
    };
    findManyOpts.skip = query.cursor ? query.cursor * 10 : 0;
    findManyOpts.take = 10;

    return this.prismaService.dividende.findMany(findManyOpts);
  }

  @Get('dividendes/count')
  async getDividendeCount(
    @Query() query: { cursor: number; name: string; dateExDividende: string },
  ): Promise<number> {
    var findManyOpts: any = {};
    var whereOr: any[] = [];

    if (query.dateExDividende) {
      whereOr.push({
        dateExDividende: {
          gte: new Date(query.dateExDividende.replace('Z', '')),
        },
      });
    }

    if (query.name) {
      whereOr.push({
        stockSymbol: {
          contains: query.name,
          mode: 'insensitive',
        },
      });
    }

    if (whereOr.length > 0) {
      findManyOpts.where = { OR: whereOr };
    }

    findManyOpts.orderBy = {
      dateExDividende: 'asc',
    };

    return this.prismaService.dividende.count(findManyOpts);
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

import { Dividend as Model, Status } from '@prisma/client';
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
export class DividendController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get('dividends')
  async getAllDividend(
    @Query()
    query: {
      cursor: number;
      name: string;
      dateExDividend: string;
      strict: boolean;
    },
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

    if (query.dateExDividend) {
      if (!query.strict)
        whereOr.push({
          dateExDividend: {
            gte: new Date(query.dateExDividend.replace('Z', '')),
          },
        });
      else
        whereOr.push({
          dateExDividend: {
            equals: new Date(query.dateExDividend.replace('Z', '')),
          },
        });
    }

    if (query.name) {
      if (!query.strict)
        whereOr.push({
          stockSymbol: {
            contains: query.name,
            mode: 'insensitive',
          },
        });
      else
        whereOr.push({
          stockSymbol: {
            equals: query.name,
            mode: 'insensitive',
          },
        });
    }

    if (whereOr.length > 0) {
      findManyOpts.where = { OR: whereOr };
    }

    findManyOpts.orderBy = {
      dateExDividend: 'asc',
    };
    findManyOpts.skip = query.cursor ? query.cursor * 10 : 0;
    findManyOpts.take = 10;

    return this.prismaService.dividend.findMany(findManyOpts);
  }

  @Get('dividends/count')
  async getDividendCount(
    @Query() query: { cursor: number; name: string; dateExDividend: string },
  ): Promise<number> {
    var findManyOpts: any = {};
    var whereOr: any[] = [];

    if (query.dateExDividend) {
      whereOr.push({
        dateExDividend: {
          gte: new Date(query.dateExDividend.replace('Z', '')),
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
      dateExDividend: 'asc',
    };

    return this.prismaService.dividend.count(findManyOpts);
  }

  @Get('dividend/:id')
  async getDividendById(@Param('id') id: string): Promise<Model | null> {
    return this.prismaService.dividend.findFirst({
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

  @Post('dividend')
  async createDividend(
    @Body()
    postData: {
      dateExDividend: string;
      datePayment: string;
      dividendPerShare: number;
      stockSymbol: string;
    },
  ): Promise<Model> {
    const { stockSymbol, dateExDividend, datePayment, ...rest } = postData;
    return this.prismaService.dividend.create({
      data: {
        ...rest,
        dateExDividend: new Date(dateExDividend.replace('Z', '')),
        datePayment: new Date(datePayment.replace('Z', '')),
        status: Status.NEW,
        stock: {
          connect: { symbol: postData.stockSymbol },
        },
      },
    });
  }

  @Put('dividend/:id')
  async updateDividend(
    @Param('id') id: string,
    @Body()
    postData: {
      dateExDividend?: string;
      datePayment?: string;
      dividendPerShare?: number;
      stockSymbol?: string;
    },
  ): Promise<Model> {
    const { stockSymbol, dateExDividend, datePayment } = postData;
    var data: any = { ...postData, status: Status.UPDATED };

    if (stockSymbol) {
      data.stock = {
        connect: { symbol: postData.stockSymbol },
      };
    }

    if (dateExDividend) {
      data.dateExDividend = new Date(dateExDividend.replace('Z', ''));
    }

    if (datePayment) {
      data.datePayment = new Date(datePayment.replace('Z', ''));
    }

    return this.prismaService.dividend.update({
      where: { id: id },
      data: data,
    });
  }

  @Delete('dividend/:id')
  async deleteDividend(@Param('id') id: string): Promise<Model> {
    return this.prismaService.dividend.delete({
      where: { id: id },
    });
  }
}

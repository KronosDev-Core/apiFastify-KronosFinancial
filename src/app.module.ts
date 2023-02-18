import { PrismaService } from './prisma/prisma.service';
import { Module } from '@nestjs/common';
import { DividendModule } from './dividend/dividend.module';
import { StockModule } from './stock/stock.module';
import { BuyModule } from './buy/buy.module';
import { SellModule } from './sell/sell.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.forRoot('KronosFinancial', {
      redis: {
        host: 'kronos.dev',
        port: 6379,
      },
    }),
    DividendModule,
    StockModule,
    BuyModule,
    SellModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}

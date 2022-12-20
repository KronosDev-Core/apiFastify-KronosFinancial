import { PrismaService } from './prisma/prisma.service';
import { Module, Post } from '@nestjs/common';
import { DividendeModule } from './dividende/dividende.module';
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
    DividendeModule,
    StockModule,
    BuyModule,
    SellModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { BuyController } from './buy.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [BuyController],
  providers: [PrismaService],
})
export class BuyModule {}

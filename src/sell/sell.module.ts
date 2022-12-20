import { Module } from '@nestjs/common';
import { SellController } from './sell.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [SellController],
  providers: [PrismaService],
})
export class SellModule {}

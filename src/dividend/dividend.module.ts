import { Module } from '@nestjs/common';
import { DividendController } from './dividend.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [DividendController],
  providers: [PrismaService],
})
export class DividendModule {}

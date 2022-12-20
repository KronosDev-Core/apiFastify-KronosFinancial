import { Module } from '@nestjs/common';
import { DividendeController } from './dividende.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [DividendeController],
  providers: [PrismaService],
})
export class DividendeModule {}

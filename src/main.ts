import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { readFileSync } from 'node:fs';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      https: {
        key: readFileSync('secure/kronos.dev-key.pem', 'utf8'),
        cert: readFileSync('secure/kronos.dev.pem', 'utf8'),
      },
    }),
  );

  await app.register(import('@fastify/csrf-protection'));
  await app.register(import('@fastify/helmet'));
  await app.register(import('@fastify/compress'), {
    encodings: ['gzip', 'deflate'],
  });
  app.enableCors();

  await app.listen(3443, 'kronos.dev');
}
bootstrap();

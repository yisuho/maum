import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import appConfig from './config/app.config';
import { ConfigType } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigType<typeof appConfig>>(appConfig.KEY);
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory(errors) {
        const message = Object.values(errors[0].constraints);

        throw new Error(message[0]);
      },
    }),
  );
  await app.listen(config.port);
}
bootstrap();

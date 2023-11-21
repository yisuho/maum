import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import appConfig from './config/app.config';
import { ConfigType } from '@nestjs/config';
import { AllExceptionsFilter } from './http-exception/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { LoggingPlugin } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(LoggingPlugin));
  const config = app.get<ConfigType<typeof appConfig>>(appConfig.KEY);
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(config.port);
}
bootstrap();

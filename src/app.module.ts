import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SurveysModule } from './surveys/surveys.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { databaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import postgresqlConfig from './config/postgresql.config';
import appConfig from './config/app.config';
import { APP_FILTER, APP_PIPE, HttpAdapterHost } from '@nestjs/core';
import { AllExceptionsFilter } from './http-exception/http-exception.filter';
import { LoggingPlugin } from './logger/logger.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      envFilePath: '.env',
      load: [appConfig, postgresqlConfig],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.graphql'),
    }),
    databaseModule,
    SurveysModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}

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
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { QuestionsModule } from './questions/questions.module';
import { ChoicesModule } from './choices/choices.module';
import { UserAnswersModule } from './user-answers/user-answers.module';
import { UserSurveysModule } from './user-surveys/user-surveys.module';
import { LoggingInterceptor } from './interceptor/logger.interceptor';
import { winstonLogger } from './logger/winston';

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
      formatError: (error) => {
        const res = {
          message: error.message,
          code: error.extensions.code,
          path: error.path,
          locations: error.locations,
        };

        winstonLogger.error(
          `🔴 GraphQL Error:${res.message}\ncode:${res.code}\npath:${res.path}\nlocations:[{line:${res.locations[0].line},column:${res.locations[0].column}}]`,
        );

        console.error(res);

        return res;
      },
    }),
    databaseModule,
    SurveysModule,
    QuestionsModule,
    ChoicesModule,
    UserAnswersModule,
    UserSurveysModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}

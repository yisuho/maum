import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable, catchError, tap } from 'rxjs';
import * as winston from 'winston';

export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const now = Date.now();

    const winstonLogger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.simple(),
        }),
      ],
    });

    const query = req.body.query;
    winstonLogger.info(`🔵 Incoming [GraphQL] Query: ${query}`);

    return next.handle().pipe(
      tap(() => {
        const ms = Date.now() - now;
        winstonLogger.info(`✅ Completed [GraphQL] Query in ${ms}ms`);
      }),
      catchError((error) => {
        const ms = Date.now() - now;
        winstonLogger.error(
          `🔴 [GraphQL] Query Error after ${ms}ms: ${error.message}`,
        );
        throw error;
      }),
    );
  }
}

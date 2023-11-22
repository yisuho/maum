import { ConfigModule } from '@nestjs/config';
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AbstractHttpAdapter } from '@nestjs/core';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';

@Catch(ApolloError)
export class ApolloAllExceptionsFilter implements GqlExceptionFilter {
  catch(exception: ApolloError, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const context = gqlHost.getContext();
    const response = context.res as Response;

    const status = exception.extensions.exception.status || 500;
    const message = exception.message;
    const code = exception.extensions.code;
    const stack = exception.stack;
    const res = {
      statusCode: status,
      message: message,
      code: code,
      stack: stack,
    };
    console.log(res);
  }
}

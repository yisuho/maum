import { ArgumentsHost, Catch } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';

@Catch(ApolloError)
export class ApolloAllExceptionsFilter implements GqlExceptionFilter {
  catch(exception: ApolloError, host: ArgumentsHost) {
    console.error({
      message: exception.message,
      // code: exception.extension
    });
    return new ApolloError(exception.message, exception.extensions.code, {
      ...exception.extensions,
    });
  }
}

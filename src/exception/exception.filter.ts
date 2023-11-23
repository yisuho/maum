// import {
//   ArgumentsHost,
//   Catch,
//   ExceptionFilter,
//   HttpException,
//   HttpStatus,
// } from '@nestjs/common';
// import { GqlExceptionFilter } from '@nestjs/graphql';
// import { ApolloError } from 'apollo-server-express';
// import { QueryFailedError } from 'typeorm';

// @Catch()
// export class AllExceptionsFilter implements ExceptionFilter {
//   catch(exception: HttpException, host: ArgumentsHost) {
//     const status =
//       exception instanceof HttpException
//         ? exception.getStatus()
//         : HttpStatus.INTERNAL_SERVER_ERROR;
//     const res = {
//       message: exception.message,
//       code: exception.name,
//     };
//     const message =
//       exception instanceof HttpException
//         ? exception.getResponse()
//         : 'Internal server error';
//     console.log('aa', exception.message);
//   }
// }

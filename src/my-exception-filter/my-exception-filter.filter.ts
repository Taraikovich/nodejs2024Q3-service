import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { MyLogger } from 'src/my-logger/my-logger.service';

@Catch()
export class MyExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly logger: MyLogger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : (exception as Error).message || 'Internal server error';

    this.logger.error(
      `Error occurred: ${JSON.stringify(
        Object.assign(
          {
            path: httpAdapter.getRequestUrl(ctx.getRequest()),
          },
          message,
        ),
      )}`,
    );
    if (exception instanceof Error) {
      this.logger.error(`Stack Trace: ${exception.stack}`);
    }

    let responseBody: any;

    if (typeof message === 'string') {
      responseBody = {
        statusCode: httpStatus,
        error:
          httpStatus === HttpStatus.INTERNAL_SERVER_ERROR
            ? 'Internal Server Error'
            : message,
        message,
      };
    } else {
      responseBody = message;
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}

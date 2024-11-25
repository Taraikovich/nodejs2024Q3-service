import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MyLogger } from 'src/my-logger/my-logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private logger: MyLogger) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, url, query, body } = req;

    this.logger.log(
      `Incoming Request: [${method}] ${url} - Query: ${JSON.stringify(
        query,
      )} - Body: ${JSON.stringify(body)}.`,
    );

    const originalSend = res.send;
    res.send = (data: any) => {
      this.logger.log(
        `Response: [${method}] ${url} - Status: ${res.statusCode} - Body: ${data}`,
      );

      return originalSend.call(res, data);
    };

    next();
  }
}

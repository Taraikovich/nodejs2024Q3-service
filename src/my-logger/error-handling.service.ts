import {
  Injectable,
  OnModuleInit,
  OnApplicationShutdown,
} from '@nestjs/common';
import { MyLogger } from './my-logger.service';

@Injectable()
export class ErrorHandlingService
  implements OnModuleInit, OnApplicationShutdown
{
  constructor(private readonly logger: MyLogger) {}

  onModuleInit() {
    process.on('uncaughtException', (error: Error) => {
      this.logger.fatal(`Uncaught Exception: ${error.message}`);
      this.logger.error(`Stack Trace: ${error.stack}`);
    });

    process.on('unhandledRejection', (reason: any) => {
      this.logger.error(`Unhandled Rejection: ${reason}`);
      if (reason instanceof Error) {
        this.logger.error(`Stack Trace: ${reason.stack}`);
      }
    });
  }

  onApplicationShutdown(signal?: string) {
    this.logger.warn(`Application is shutting down due to signal: ${signal}`);
  }
}

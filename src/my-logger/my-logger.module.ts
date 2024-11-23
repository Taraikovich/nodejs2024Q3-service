import { Module } from '@nestjs/common';
import { MyLogger } from './my-logger.service';
import { ErrorHandlingService } from './error-handling.service';

@Module({
  providers: [MyLogger, ErrorHandlingService],
  exports: [MyLogger, ErrorHandlingService],
})
export class MyLoggerModule {}

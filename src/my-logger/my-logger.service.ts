import { LoggerService, Injectable } from '@nestjs/common';
import { appendFile, mkdir, stat, rename } from 'node:fs/promises';
import { join } from 'node:path';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

type LogLevel = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'verbose';

@Injectable()
export class MyLogger implements LoggerService {
  private readonly logLevels: LogLevel[] = [
    'fatal',
    'error',
    'warn',
    'info',
    'debug',
    'verbose',
  ];
  private readonly currentLogLevel: LogLevel;
  private readonly isWriteToConsole = process.env.LOG_TO_CONSOLE || true;
  private readonly isWriteToFile = process.env.LOG_TO_FILE || true;
  private readonly logMaxSize =
    parseInt(process.env.LOG_FILE_MAX_SIZE || '10') * 1024; // in bytes
  private logfilePath: string;

  constructor() {
    this.currentLogLevel = (process.env.LOG_LEVEL as LogLevel) || 'info';
    this.initialize();
  }

  private async initialize() {
    this.logfilePath = await this.createLogFile();
    this.log('Logger initialized');
  }

  private shouldLog(level: LogLevel): boolean {
    return (
      this.logLevels.indexOf(level) <=
      this.logLevels.indexOf(this.currentLogLevel)
    );
  }

  private async createLogFile() {
    try {
      const logDir = join(__dirname, '../..', 'logs');
      await mkdir(logDir, { recursive: true });
      console.log(`Log directory created or already exists: ${logDir}`);
      return join(logDir, 'app.log');
    } catch (error) {
      console.error(`Failed to create log directory: ${error.message}`);
      throw error;
    }
  }

  private async rotateLogFile() {
    try {
      const stats = await stat(this.logfilePath);
      if (stats.size >= this.logMaxSize) {
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        const rotatedFilePath = this.logfilePath.replace(
          'app.log',
          `app-${timestamp}.log`,
        );
        await rename(this.logfilePath, rotatedFilePath);
        console.log(`Log file rotated: ${rotatedFilePath}`);
      }
    } catch (error) {
      console.error(`Error during log file rotation: ${error.message}`);
    }
  }

  private async writeLog(level: LogLevel, message: any) {
    const logText = `[${level.toUpperCase()}] ${new Date().toISOString()} - ${message}`;
    if (this.isWriteToFile) {
      try {
        await this.rotateLogFile();
        await appendFile(this.logfilePath, logText + '\n');
      } catch (error) {
        console.error(`Failed to write log: ${error.message}`);
      }
    }

    if (this.shouldLog(level) && this.isWriteToConsole) {
      console[level === 'fatal' ? 'error' : level](logText);
    }
  }

  async log(message: any) {
    await this.writeLog('info', message);
  }

  async error(message: any) {
    await this.writeLog('error', message);
  }

  async warn(message: any) {
    await this.writeLog('warn', message);
  }

  async debug(message: any) {
    await this.writeLog('debug', message);
  }

  async verbose(message: any) {
    await this.writeLog('verbose', message);
  }

  async fatal(message: any) {
    await this.writeLog('fatal', message);
  }
}

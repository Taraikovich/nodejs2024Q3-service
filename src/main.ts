import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { parse as yamlParse } from 'yaml';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { SwaggerModule } from '@nestjs/swagger';
import { config as dotenvConfig } from 'dotenv';
import { MyLogger } from './my-logger/my-logger.service';

dotenvConfig({ path: '.env' });

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.useGlobalPipes(new ValidationPipe());

  try {
    const file = await readFile(resolve('./doc/api.yaml'), {
      encoding: 'utf8',
    });
    const yamlData = yamlParse(file);

    SwaggerModule.setup('doc', app, yamlData);
  } catch (error) {
    console.error('Error reading or parsing YAML file:', error);
  }

  const port = process.env.PORT || 3000;
  app.useLogger(app.get(MyLogger));
  await app.listen(port);
}
bootstrap();

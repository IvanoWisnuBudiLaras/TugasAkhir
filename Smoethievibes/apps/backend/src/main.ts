﻿﻿﻿﻿﻿﻿﻿import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from './common/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // Security
  app.use(helmet());
  
  // CORS
  const corsOptions = configService.get('cors');
  app.enableCors(corsOptions);
  
  // Global validation
  app.useGlobalPipes(new ValidationPipe(configService));
  
  // Swagger documentation
  const swaggerOptions = configService.get('swagger');
  if (swaggerOptions?.enabled !== false) {
    const config = new DocumentBuilder()
      .setTitle(swaggerOptions?.title || 'Smoethievibes API')
      .setDescription(swaggerOptions?.description || 'Smoethievibes API Documentation')
      .setVersion(swaggerOptions?.version || '1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;
  await app.listen(port);
  
  const serverStarted = configService.get('messages.info.serverStarted').replace('${port}', port.toString());
  const apiDocs = configService.get('messages.info.apiDocs').replace('${port}', port.toString());
  
  console.log(serverStarted);
  console.log(apiDocs);
}
bootstrap();
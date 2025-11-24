﻿import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { OrderModule } from './modules/order/order.module';
import { ExportModule } from './exports/export.module';
import { AppController } from './app.controller';
import { 
  jwtConfig, 
  corsConfig,
  swaggerAppConfig
} from './config';
import messagesConfig from './config/messages.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        jwtConfig, 
        messagesConfig,
        corsConfig,
        swaggerAppConfig
      ],
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    ProductModule,
    OrderModule,
    ExportModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
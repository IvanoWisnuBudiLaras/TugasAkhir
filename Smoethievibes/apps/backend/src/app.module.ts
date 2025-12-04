﻿import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { OrderModule } from './modules/order/order.module';
import { ExportModule } from './exports/export.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { AppController } from './app.controller';
import { EmailModule } from './modules/email/email.module';
import {
  jwtConfig,
  corsConfig,
  swaggerAppConfig
} from './config';
import messagesConfig from './config/messages.config';
import { validate } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
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
    DashboardModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
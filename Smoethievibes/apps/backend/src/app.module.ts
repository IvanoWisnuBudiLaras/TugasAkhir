﻿import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Request, Response } from 'express';
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
    // @fitur Konfigurasi GraphQL Apollo Server untuk schema generation dan playground
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      playground: true,
      introspection: true,
      context: ({ req, res }: { req: Request; res: Response }) => ({ req, res }),
    }),
    PrismaModule,
    // @fitur Autentikasi & otorisasi (JWT + Google OAuth)
    AuthModule,
    // @fitur Manajemen pengguna & operasi profil
    UserModule,
    // @fitur Katalog produk & manajemen inventaris
    ProductModule,
    // @fitur Pemrosesan & pelacakan pesanan
    OrderModule,
    // @fitur Fungsionalitas ekspor data
    ExportModule,
    // @fitur Dashboard admin & analitik
    DashboardModule,
    // @fitur Layanan email (OTP, notifikasi)
    EmailModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
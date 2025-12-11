﻿﻿﻿﻿﻿import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Request, Response } from 'express';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { CategoryModule } from './modules/category/category.module';
import { OrderModule } from './modules/order/order.module';
import { ExportModule } from './exports/export.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AppController } from './app.controller';
import {
  jwtConfig,
  corsConfig,
  swaggerAppConfig
} from './config';
import messagesConfig from './config/messages.config';
// import { RedisModule } from './common/redis/redis.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      introspection: true,
      context: ({ req, res }: { req: Request; res: Response }) => ({ req, res }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        jwtConfig,
        messagesConfig,
        corsConfig,
        swaggerAppConfig
      ],
    }),
    // RedisModule,
    PrismaModule,
    AuthModule,
    UserModule,
    ProductModule,
    CategoryModule,
    OrderModule,
    ExportModule,
    DashboardModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
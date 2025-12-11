﻿import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { CategoryModule } from './modules/category/category.module';
import { OrderModule } from './modules/order/order.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ExportModule } from './exports/export.module';
import { PrismaModule } from './prisma/prisma.module';
import { validate } from './config/env.validation';
import corsConfig from './config/cors.config';
import { jwtConfig } from './config/jwt.config';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validate,
      load: [corsConfig, jwtConfig],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
      introspection: true,
      context: ({ req, res }: { req: any; res: any }) => ({ req, res }),
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    ProductModule,
    CategoryModule,
    OrderModule,
    DashboardModule,
    AnalyticsModule,
    ExportModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
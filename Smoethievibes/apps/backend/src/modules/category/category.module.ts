import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryResolver } from './category.resolver';
import { CategoryController } from './category.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { RedisModule } from '../../common/redis/redis.module';

@Module({
  imports: [PrismaModule, RedisModule],
  providers: [CategoryService, CategoryResolver],
  controllers: [CategoryController],
  exports: [CategoryService],
})
export class CategoryModule {}
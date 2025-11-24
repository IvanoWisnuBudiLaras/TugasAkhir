import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export abstract class BaseService {
  constructor(
    protected readonly prisma: PrismaService,
    @Inject(ConfigService)
    protected readonly configService: ConfigService,
  ) {}

  protected async findByIdOrThrow<T>(
    model: string,
    id: string,
    include?: any,
  ): Promise<T> {
    const record = await (this.prisma as any)[model].findUnique({
      where: { id },
      include,
    });

    if (!record) {
      const message = this.configService.get('messages.errors.notFound') || '${resource} not found';
      throw new NotFoundException(message.replace('${resource}', model));
    }

    return record;
  }

  protected async exists(model: string, where: any): Promise<boolean> {
    const count = await (this.prisma as any)[model].count({ where });
    return count > 0;
  }

  protected formatPagination(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return { skip, take: limit };
  }

  protected calculatePaginationMeta(
    total: number,
    page: number,
    limit: number,
  ) {
    const totalPages = Math.ceil(total / limit);
    return {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }
}
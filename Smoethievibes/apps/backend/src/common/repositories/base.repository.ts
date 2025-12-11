import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface BaseRepositoryInterface<T> {
  findAll(options?: any): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  findOne(options: any): Promise<T | null>;
  create(data: any): Promise<T>;
  update(id: string, data: any): Promise<T>;
  delete(id: string): Promise<T>;
  count(options?: any): Promise<number>;
  exists(id: string): Promise<boolean>;
}

// Type-safe model accessor
type PrismaModelDelegate = {
  findMany: (args?: any) => Promise<any[]>;
  findUnique: (args?: any) => Promise<any | null>;
  findFirst: (args?: any) => Promise<any | null>;
  create: (args?: any) => Promise<any>;
  update: (args?: any) => Promise<any>;
  delete: (args?: any) => Promise<any>;
  count: (args?: any) => Promise<number>;
  upsert: (args?: any) => Promise<any>;
  updateMany: (args?: any) => Promise<any>;
  deleteMany: (args?: any) => Promise<any>;
  createMany: (args?: any) => Promise<any>;
  aggregate: (args?: any) => Promise<any>;
  groupBy: (args?: any) => Promise<any[]>;
};

@Injectable()
export abstract class BaseRepository<T> implements BaseRepositoryInterface<T> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly modelName: string,
  ) {}

  protected getModel(): PrismaModelDelegate {
    const model = (this.prisma as any)[this.modelName];
    if (!model) {
      throw new Error(`Model ${this.modelName} not found in Prisma client`);
    }
    return model as PrismaModelDelegate;
  }

  async findAll(options: any = {}): Promise<T[]> {
    return this.getModel().findMany(options);
  }

  async findById(id: string): Promise<T | null> {
    return this.getModel().findUnique({
      where: { id },
    });
  }

  async findOne(options: any): Promise<T | null> {
    return this.getModel().findFirst(options);
  }

  async create(data: any): Promise<T> {
    return this.getModel().create({
      data,
    });
  }

  async update(id: string, data: any): Promise<T> {
    return this.getModel().update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<T> {
    return this.getModel().delete({
      where: { id },
    });
  }

  async count(options: any = {}): Promise<number> {
    return this.getModel().count(options);
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.getModel().count({
      where: { id },
    });
    return count > 0;
  }

  async findMany(options: any = {}): Promise<T[]> {
    return this.getModel().findMany(options);
  }

  async findFirst(options: any = {}): Promise<T | null> {
    return this.getModel().findFirst(options);
  }

  async findUnique(options: any = {}): Promise<T | null> {
    return this.getModel().findUnique(options);
  }

  async upsert(options: any): Promise<T> {
    return this.getModel().upsert(options);
  }

  async updateMany(options: any): Promise<any> {
    return this.getModel().updateMany(options);
  }

  async deleteMany(options: any): Promise<any> {
    return this.getModel().deleteMany(options);
  }

  async createMany(options: any): Promise<any> {
    return this.getModel().createMany(options);
  }

  async aggregate(options: any): Promise<any> {
    return this.getModel().aggregate(options);
  }

  async groupBy(options: any): Promise<any[]> {
    return this.getModel().groupBy(options);
  }
}
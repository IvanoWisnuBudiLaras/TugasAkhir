import { Field, InputType, Int } from '@nestjs/graphql';
import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { OrderType, OrderStatus } from '@prisma/client';

@InputType()
export class UpdateOrderInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  userId?: string;

  @Field(() => OrderStatus, { nullable: true })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @Field(() => OrderType, { nullable: true })
  @IsOptional()
  @IsEnum(OrderType)
  orderType?: OrderType;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  queueNumber?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  tableNumber?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;
}
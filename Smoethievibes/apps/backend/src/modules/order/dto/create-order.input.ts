import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderType } from '@prisma/client';
import { OrderItemInput } from './order-item.input';

@InputType()
export class CreateOrderInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  userId!: string;

  @Field(() => OrderType)
  @IsNotEmpty()
  @IsEnum(OrderType)
  orderType!: OrderType;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  tableNumber?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;

  @Field(() => [OrderItemInput], { nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OrderItemInput)
  orderItems?: OrderItemInput[];
}
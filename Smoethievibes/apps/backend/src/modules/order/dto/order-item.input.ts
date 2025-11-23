import { Field, InputType, Int } from "@nestjs/graphql";
import { IsNotEmpty, IsString, IsNumber, Min } from "class-validator";

@InputType()
export class OrderItemInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  productId!: string;

  @Field(() => Int)
  @IsNumber()
  @Min(1)
  quantity!: number;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @Min(0)
  price?: number; // Optional: harga custom (misalnya untuk promo)
}

@InputType()
export class AddOrderItemInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  orderId!: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  productId!: string;

  @Field(() => Int)
  @IsNumber()
  @Min(1)
  quantity!: number;
}
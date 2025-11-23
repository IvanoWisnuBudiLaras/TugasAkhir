import { ObjectType, Field, ID, Float, Int } from "@nestjs/graphql";

@ObjectType()
export class OrderItem {
  @Field(() => ID)
  id!: string;

  @Field()
  orderId!: string;

  @Field()
  productId!: string;

  @Field(() => Int)
  quantity!: number;

  @Field(() => Float)
  price!: number; // Harga saat dipesan
}
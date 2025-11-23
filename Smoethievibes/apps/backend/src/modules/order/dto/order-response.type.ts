import { Field, ObjectType } from "@nestjs/graphql";
import { Order } from "../order.model";

@ObjectType()
export class OrderResponse {
  @Field(() => Boolean)
  success!: boolean;

  @Field({ nullable: true })
  message?: string;

  @Field(() => Order, { nullable: true })
  order?: Order;
}

@ObjectType()
export class OrderItemResponse {
  @Field(() => Boolean)
  success!: boolean;

  @Field({ nullable: true })
  message?: string;

  @Field({ nullable: true })
  orderId?: string;
}
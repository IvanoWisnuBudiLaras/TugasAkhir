import { ObjectType, Field, ID, Int, registerEnumType } from "@nestjs/graphql";
import { OrderStatus, OrderType } from "@prisma/client";
import { OrderItem } from "./order-item.model";

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
  description: 'Status order dalam sistem',
});

registerEnumType(OrderType, {
  name: 'OrderType',
  description: 'Tipe order (Takeaway, Dine-in, Delivery)',
});

@ObjectType()
export class Order {
  @Field(() => ID)
  id!: string;

  @Field()
  userId!: string;

  @Field(() => OrderStatus)
  status!: OrderStatus;

  @Field()
  total!: number;

  @Field(() => OrderType)
  orderType!: OrderType;

  @Field(() => Int, { nullable: true })
  queueNumber?: number;

  @Field(() => Int, { nullable: true })
  tableNumber?: number;

  @Field({ nullable: true })
  notes?: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field(() => [OrderItem])
  orderItems?: OrderItem[];
}
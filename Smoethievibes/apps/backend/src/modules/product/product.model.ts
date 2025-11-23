import { ObjectType, Field, ID, Float, Int } from "@nestjs/graphql";

@ObjectType()
export class Product {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field({ nullable: true })
  description!: string | null;

  @Field(() => Float)
  price!: number;

  @Field({ nullable: true })
  image!: string | null;

  @Field(() => Int)
  stock!: number;

  @Field()
  categoryId!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
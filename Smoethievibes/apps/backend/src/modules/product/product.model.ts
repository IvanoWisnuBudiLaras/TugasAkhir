import { ObjectType, Field, ID, Float, Int } from "@nestjs/graphql";

@ObjectType()
export class Product {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  name!: string;

  // @deskripsi Gunakan tipe eksplisit untuk field nullable agar reflectMetadata valid
  @Field(() => String, { nullable: true })
  description!: string | null;

  @Field(() => Float)
  price!: number;

  @Field(() => String, { nullable: true })
  image!: string | null;

  @Field(() => Int)
  stock!: number;

  @Field(() => String)
  categoryId!: string;

  // @deskripsi Gunakan tipe eksplisit untuk Date agar GraphQL mengenali scalar Date
  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}
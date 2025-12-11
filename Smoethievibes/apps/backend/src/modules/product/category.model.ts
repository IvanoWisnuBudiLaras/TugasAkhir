import { ObjectType, Field, ID } from "@nestjs/graphql";

@ObjectType()
export class Category {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String)
  slug!: string;

  @Field(() => String, { nullable: true })
  description!: string | null;

  @Field(() => String, { nullable: true })
  image!: string | null;

  @Field(() => Boolean)
  isActive!: boolean;

  @Field(() => Number)
  sortOrder!: number;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}
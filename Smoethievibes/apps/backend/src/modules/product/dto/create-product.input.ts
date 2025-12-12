import { Field, InputType, Float, Int } from "@nestjs/graphql";
import { IsNotEmpty, IsString, IsOptional, IsNumber, Min, IsPositive } from "class-validator";

@InputType()
export class CreateProductInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name!: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  slug!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => Float)
  @IsNumber()
  @IsPositive()
  price!: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  image?: string;

  @Field(() => Int, { defaultValue: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  categoryId!: string;
}
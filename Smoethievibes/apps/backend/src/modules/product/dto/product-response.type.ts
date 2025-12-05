import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';
import { ApiResponseDto } from '../../../common/dto/api-response.dto';

@ObjectType()
export class ProductResponse {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Float)
  price!: number;

  @Field(() => String)
  category!: string;

  @Field(() => String, { nullable: true })
  image?: string;

  @Field(() => Int)
  stock!: number;

  @Field()
  isActive!: boolean;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}

@ObjectType()
export class ProductResponseType extends ApiResponseDto<ProductResponse> {
  // Data field is inherited from ApiResponseDto
}
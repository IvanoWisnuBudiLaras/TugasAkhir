import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { ApiResponseDto } from '../../../common/dto/api-response.dto';

@ObjectType()
export class ProductResponse {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Float)
  price!: number;

  @Field()
  category!: string;

  @Field({ nullable: true })
  image?: string;

  @Field()
  stock!: number;

  @Field()
  isActive!: boolean;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

@ObjectType()
export class ProductResponseType extends ApiResponseDto<ProductResponse> {
  // Data field is inherited from ApiResponseDto
}
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ApiResponseDto } from '../../../common/dto/api-response.dto';

@ObjectType()
export class UserResponse {
  @Field(() => ID)
  id!: string;

  @Field()
  email!: string;

  @Field()
  name!: string;

  @Field()
  role!: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  address?: string;

  @Field()
  isActive!: boolean;
  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}

@ObjectType()
export class UserResponseType extends ApiResponseDto<UserResponse> {
  // Data field is inherited from ApiResponseDto
}
import { ObjectType, Field } from '@nestjs/graphql';
import { ApiResponseDto } from '../../../common/dto/api-response.dto';

@ObjectType()
export class AuthResponse {
  @Field()
  accessToken!: string;

  @Field()
  refreshToken!: string;

  @Field()
  expiresIn!: string;

  @Field()
  tokenType!: string;
}

@ObjectType()
export class AuthResponseType extends ApiResponseDto<AuthResponse> {
  // data property is inherited from ApiResponseDto
}

@ObjectType()
export class RegisterResponse {
  @Field()
  id!: string;

  @Field()
  email!: string;

  @Field()
  name!: string;

  @Field()
  role!: string;
}

@ObjectType()
export class RegisterResponseType extends ApiResponseDto<RegisterResponse> {
  // data property is inherited from ApiResponseDto
}
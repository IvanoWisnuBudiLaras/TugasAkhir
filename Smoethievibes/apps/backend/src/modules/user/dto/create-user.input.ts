import { Field, InputType, registerEnumType} from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, IsOptional } from 'class-validator';
import { UserRole } from '@prisma/client';

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'User role dalam sistem',
});

@InputType()
export class CreateUserInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name!: string;

  @Field()
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  password!: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('ID')
  phone!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  address?: string;

  @Field(() => UserRole, {defaultValue: UserRole.CUSTOMER})
  role!: UserRole;
}
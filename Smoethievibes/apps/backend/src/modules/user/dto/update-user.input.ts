import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

@InputType()
export class UpdateUserInput {
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    name?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsEmail()
    email?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    password?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    @IsPhoneNumber('ID')
    phone?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    address?: string;
}
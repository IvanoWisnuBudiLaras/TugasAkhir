import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class CreateUserInput {

  @Field(type => String)
  name!: string;

  @Field(type => String)
  email!: string;

  @Field(type => String)
  password!: string;
}
import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class AuthPayload {
  @Field()
  access_token!: string;

  @Field()
  user!: any; // Bisa diganti dengan User model jika sudah ada
}
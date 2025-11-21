import { ObjectType, Field, ID, registerEnumType } from "@nestjs/graphql";
import { UserRole } from "@prisma/client";

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'User role dalam sistem',
});

@ObjectType()
export class User {
  @Field(() => ID)
  id!: string;

  @Field()
  email!: string;

//   @Field()
//   password!: string;

  @Field()
  phone!: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  avatar?: string;

  @Field()
  name!: string;

  @Field(() => UserRole)
  role!: UserRole;

  @Field()
  isActive!: boolean;

  @Field({ nullable: true })
  lastLogin?: Date;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
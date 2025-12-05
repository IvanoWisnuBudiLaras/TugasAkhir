import { ObjectType, Field } from "@nestjs/graphql";
import { User } from "../../user/user.model";

/**
 * @objectType AuthPayload
 * @deskripsi Response payload untuk operasi autentikasi
 * @fields
 *   access_token - JWT token untuk request authentifikasi berikutnya
 *   user - User profile yang berhasil terauthentikasi
 */
@ObjectType()
export class AuthPayload {
  /**
   * @field access_token
   * @type String
   * @deskripsi JWT token untuk bearer authentication
   */
  @Field()
  access_token!: string;

  /**
   * @field user
   * @type User
   * @deskripsi Profil user yang berhasil login/register
   * @nullable false
   */
  @Field(() => User)
  user!: User;
}
import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      access_token
      user {
        id
        email
        name
        role
      }
    }
  }
`;

export const REGISTER_USER = gql`
  mutation Register($registerInput: RegisterInput!) {
    register(registerInput: $registerInput) {
      access_token
      user {
        id
        email
        name
        role
      }
    }
  }
`;

import { registerAs } from '@nestjs/config';

export const graphqlConfig = registerAs('graphql', () => ({
  playground: process.env.NODE_ENV !== 'production',
  introspection: process.env.NODE_ENV !== 'production',
  debug: process.env.NODE_ENV !== 'production',
  autoSchemaFile: 'schema.gql',
  sortSchema: true,
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
}));
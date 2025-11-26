import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:3001/graphql', // <-- pastikan port 3001
    credentials: 'include',
  }),
  cache: new InMemoryCache(),
});

export default client;
import { ApolloClient, InMemoryCache, HttpLink, from, ApolloLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';

// Silent error handling
const errorLink = onError(() => {});

// Retry link
const retryLink = new RetryLink({
  delay: { initial: 300, jitter: true },
  attempts: {
    max: 5,
    retryIf: (error, operation) => {
      if (operation.operationName === 'IntrospectionQuery') return false;
      return !!error && (
        error.message.includes('Failed to fetch') ||
        (error.statusCode && error.statusCode >= 500)
      );
    }
  }
});

// Auth link
const authLink = new ApolloLink((operation, forward) => {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('token')
      : null;

  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  });

  return forward(operation);
});

// HTTP link
const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:3001/graphql',
  credentials: 'include',
});

// === CACHE CONFIG YANG BENAR DAN RINGAN ===
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        categories: {
          keyArgs: false,
          merge(_, incoming) {
            return incoming; // replace only, no merge
          }
        },

        products: {
          keyArgs: ['skip', 'take'],
          merge(_, incoming) {
            return incoming; // no pagination merge, REST-like
          }
        },

        productsByCategorySlug: {
          keyArgs: ['categorySlug'],
          merge(_, incoming) {
            return incoming; // REST-like
          }
        },

        product: {
          keyArgs: ['where'],
          merge(_, incoming) {
            return incoming;
          }
        },

        me: {
          merge(_, incoming) {
            return incoming;
          }
        }
      }
    },

    Product: { keyFields: ['id'] },
    Category: { keyFields: ['id'] },
    User: { keyFields: ['id'] },
    Order: { keyFields: ['id'] }
  }
});

// Client
const client = new ApolloClient({
  link: from([errorLink, retryLink, authLink, httpLink]),
  cache,
  defaultOptions: {
    query: {
      fetchPolicy: 'cache-first',
      errorPolicy: 'all'
    }
  }
});

export default client;
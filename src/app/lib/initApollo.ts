import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { SchemaLink } from 'apollo-link-schema';
import fetch from 'isomorphic-unfetch';
import { createSchema } from '../../shared/schema';
import { isBrowser } from './isBrowser';

let apolloClient: ApolloClient<NormalizedCacheObject>;

// Polyfill fetch() on the server (used by apollo-client)
if (!isBrowser) {
  (global as any).fetch = fetch;
}

function create(initialState, firebase): ApolloClient<NormalizedCacheObject> {
  const schema = createSchema(firebase);
  return new ApolloClient({
    cache: new InMemoryCache().restore(initialState),
    connectToDevTools: isBrowser,
    link: isBrowser
      ? new HttpLink({
          credentials: 'same-origin',
          uri: 'http://localhost:5000/graphql',
        })
      : new SchemaLink({ schema }),
    ssrMode: !isBrowser, // Disables forceFetch on the server (so queries are only run once)
  });
}

export default function initApollo(initialState = {}, firebase) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!isBrowser) {
    return create(initialState, firebase);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState, firebase);
  }

  return apolloClient;
}

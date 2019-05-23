import { createSchema } from '@ohjelmointi-dev/shared';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { SchemaLink } from 'apollo-link-schema';
import { isBrowser } from './isBrowser';

let apolloClient: ApolloClient<NormalizedCacheObject>;

function create(initialState, firebase): ApolloClient<NormalizedCacheObject> {
  if (!isBrowser) {
    const schema = createSchema(firebase);
    return new ApolloClient({
      cache: new InMemoryCache().restore(initialState),
      connectToDevTools: false,
      link: new SchemaLink({ schema }),
      ssrMode: true, // Disables forceFetch on the server (so queries are only run once)
    });
  } else {
    return new ApolloClient({
      cache: new InMemoryCache().restore(initialState),
      link: new HttpLink({
        credentials: 'same-origin',
        uri: 'http://localhost:5000/graphql',
      }),
    });
  }
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

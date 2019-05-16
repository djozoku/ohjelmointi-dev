import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import fetch from 'isomorphic-unfetch';
import { isBrowser } from './isBrowser';

let apolloClient: ApolloClient<NormalizedCacheObject>;

// Polyfill fetch() on the server (used by apollo-client)
if (!isBrowser) {
  (global as any).fetch = fetch;
}

function create(initialState): ApolloClient<NormalizedCacheObject> {
  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  return new ApolloClient({
    cache: new InMemoryCache().restore(initialState),
    connectToDevTools: isBrowser,
    link: new HttpLink({
      credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
      uri: 'https://api.graph.cool/simple/v1/cixmkt2ul01q00122mksg82pn', // Server URL (must be absolute)
    }),
    ssrMode: !isBrowser, // Disables forceFetch on the server (so queries are only run once)
  });
}

export default function initApollo(initialState = {}) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!isBrowser) {
    return create(initialState);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState);
  }

  return apolloClient;
}

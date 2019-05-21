import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './rootReducer';

const bindMiddleware = (middleware) => {
  if (process.env.NODE_ENV !== 'production') {
    return composeWithDevTools(applyMiddleware(...middleware));
  }
  return applyMiddleware(...middleware);
};

const configureStore = (apollo: ApolloClient<NormalizedCacheObject>) => (
  initialState,
) => {
  const store = createStore(
    rootReducer,
    initialState,
    bindMiddleware([thunkMiddleware.withExtraArgument(apollo)]),
  );

  return store;
};

export default configureStore;

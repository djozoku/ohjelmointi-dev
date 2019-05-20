import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './rootReducer';
import rootSaga from './rootSaga';

const bindMiddleware = (middleware) => {
  if (process.env.NODE_ENV !== 'production') {
    return composeWithDevTools(applyMiddleware(...middleware));
  }
  return applyMiddleware(...middleware);
};

function service() {
  return {
    hello() {
      return 'hello';
    },
  };
}

function configureStore(initialState) {
  const sagaMiddleware = createSagaMiddleware({ context: { service } });
  const store = createStore(
    rootReducer,
    initialState,
    bindMiddleware([sagaMiddleware]),
  );

  // @ts-ignore
  store.sagaTask = sagaMiddleware.run(rootSaga);
  store.dispatch({ type: 'HI' });

  return store;
}

export default configureStore;

import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';

/*export const ActionTypes = {
  hello: 'HELLO',
  hi: 'HI',
  owo: 'OWO',
};*/

export const enum ActionTypes {
  hei = 'HEI',
}

interface Action<T> {
  type: T;
  payload: {
    [key: string]: any;
  };
}

type Thunk<T> = (
  dispatch: (action: Action<T>) => {},
  getState: () => any,
  apollo: ApolloClient<NormalizedCacheObject>,
) => void;

const getData = (): Thunk<ActionTypes> => (dispatch) => {
  dispatch({ payload: { data: 'moi' }, type: ActionTypes.hei });
};

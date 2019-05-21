import { combineReducers } from 'redux';

type ActionType = 'HELLO' | 'OWO';

interface Action {
  payload: any;
  type: ActionType;
}

const initialState = {
  text: 'sad',
};

interface InitialState {
  text: string;
}

type Reducer<T> = (state: T, action: Action) => {};

const mainReducer: Reducer<InitialState> = (state = initialState, action) => {
  switch (action.type) {
    case 'HELLO':
      return {
        ...state,
        text: 'hello',
      };
    case 'OWO':
      return {
        ...state,
        text: action.payload.data,
      };
    default:
      return {
        ...state,
      };
  }
};

export default combineReducers<any>({ mainReducer });

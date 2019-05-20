import { combineReducers } from 'redux';

type ActionType = 'HELLO' | 'OWO';

interface Action {
  payload: any;
  type: ActionType;
}

const initialState = {
  text: 'sad',
};

const mainReducer = (state = initialState, action: Action) => {
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

export default combineReducers({ mainReducer });

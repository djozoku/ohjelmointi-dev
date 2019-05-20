import { all, call, getContext, put, takeEvery } from 'redux-saga/effects';
import Actions from './actions';

function dataa(data?) {
  if (data) {
    return data;
  } else {
    return 'Jaah';
  }
}

function* anAction() {
  console.log('Hi');
  const service = yield getContext('service');
  const data = yield call(dataa, service.hello());
  // dispatch data
  yield put({ type: Actions.owo, payload: { data } });
}

function* actions() {
  yield takeEvery(Actions.hi, anAction);
}

function* rootSaga() {
  yield all([actions]);
}

export default rootSaga;

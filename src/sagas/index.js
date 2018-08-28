import { AsyncStorage } from 'react-native';
import { take, fork, select, put, call } from 'redux-saga/effects';

import * as sessionActions from '~/modules/user/session.ducks';
import * as notifyListActions from '~/modules/message/notifyList.ducks';
import * as pmSessionListActions from '~/modules/message/pmSessionList.ducks';
import * as pmListActions from '~/modules/message/pmList.ducks';
import * as alertActions from '~/modules/message/alert.ducks';

import cacheManager from '~/services/cacheManager';
import { fetchResource } from '~/utils/sagaHelper';
import api from '~/services/api';

const fetchLoginUserApi = fetchResource.bind(null, sessionActions, api.fetchLoginUser);
const fetchNotifyListApi = fetchResource.bind(null, notifyListActions, api.fetchNotifyList);
const fetchPmSessionListApi = fetchResource.bind(null, pmSessionListActions, api.fetchPmSessionList);
const fetchPmListApi = fetchResource.bind(null, pmListActions, api.fetchPmList);
const fetchAlertApi = fetchResource.bind(null, alertActions, api.fetchAlert);

// user login sagas

function* watchRetrieveSession() {
  while(true) {
    yield take(sessionActions.SESSION_RETRIEVE);
    let session = yield call(retrieveSessionFromStorage);

    if (session) {
      session = JSON.parse(session);
      yield put(sessionActions.setSession(session));
    }
  }
}

// how to use `yield` inside callback?
// https://github.com/redux-saga/redux-saga/issues/508
function retrieveSessionFromStorage() {
  return new Promise(resolve => AsyncStorage.getItem('session').then(resolve));
}

function* watchLogin() {
  while(true) {
    const { payload } = yield take(sessionActions.LOGIN);
    yield fork(fetchLoginUserApi, payload);
  }
}

// notify list sagas

function* watchNotifyList() {
  while(true) {
    const { payload } = yield take(notifyListActions.NOTIFY_LIST_FETCH);
    yield fork(fetchNotifyList, payload);
  }
}

function* fetchNotifyList(payload) {
  // const state = yield select();

  // Let user fetch notifications immediately.

  // if (cacheManager.shouldFetchList(state, 'notifyList', payload.notifyType)) {
    yield fork(fetchNotifyListApi, payload);
  // }
}

// pm session list sagas

function* watchPmSessionList() {
  while(true) {
    const { payload } = yield take(pmSessionListActions.PM_SESSION_LIST_FETCH);
    yield fork(fetchPmSessionList, payload);
  }
}

function* fetchPmSessionList(payload) {
  const state = yield select();

  // Let user fetch private messages immediately.

  // if (cacheManager.shouldFetchList(state, 'pmSessionList')) {
    yield fork(fetchPmSessionListApi, payload);
  // }
}

// pm list sagas

function* watchPmList() {
  while(true) {
    const { payload } = yield take(pmListActions.PM_LIST_FETCH);
    yield fork(fetchPmListApi, payload);
  }
}

// alerts sagas

function* watchAlerts() {
  while(true) {
    const { payload } = yield take(alertActions.ALERT_FETCH);
    yield fork(fetchAlertApi, payload);
  }
}

export default function* rootSaga() {
  yield fork(watchRetrieveSession);
  yield fork(watchLogin);
  yield fork(watchNotifyList);
  yield fork(watchPmSessionList);
  yield fork(watchPmList);
  yield fork(watchAlerts);
}

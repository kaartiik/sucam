/* eslint-disable no-console */
import { call, put, takeEvery, takeLatest, all } from 'redux-saga/effects';
import { navigate, reset } from '../services/NavigatorService';
import rsf, { auth, database } from '../../providers/config';
import {
  actions,
  putUserProfile,
  putAllComments,
  putLogout,
  putLoadingStatus,
} from '../actions/User';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const loginRequest = ({ email, password }) =>
  auth.signInWithEmailAndPassword(email, password);

const anonLoginRequest = () => auth.signInAnonymously();

const logoutRequest = () => auth.signOut();

const fetchNewCommentKey = () => database.ref('comments').push().key;

const onAuthStateChanged = () => {
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        resolve(user);
      } else {
        resolve(null);
      }
    });
  });
};

const getUserProfile = (uid) =>
  database
    .ref('users')
    .child(uid)
    .once('value')
    .then((snapshot) => ({ dbUser: snapshot.val() }))
    .catch((error) => ({ error }));

function* syncUserSaga() {
  const user = yield call(onAuthStateChanged);

  if (user) {
    const { dbUser } = yield call(getUserProfile, user.uid);

    if (dbUser !== null && dbUser !== undefined) {
      yield put(putUserProfile(dbUser));
    }

    setTimeout(() => {
      reset('AppStack');
    }, 100);
  } else {
    setTimeout(() => {
      reset('AuthStack');
    }, 100);
  }
}

function* loginSaga({ email, password }) {
  try {
    yield call(loginRequest, { email, password });
  } catch (error) {
    alert(error);
    return;
  }
  yield call(syncUserSaga);
}

function* anonLoginSaga() {
  try {
    yield call(anonLoginRequest);

    setTimeout(() => {
      reset('AppStack');
    }, 100);
  } catch (error) {
    alert(error);
    return;
  }
}

function* logoutSaga() {
  try {
    yield put(putLogout());
    yield call(logoutRequest);
  } catch (error) {
    alert(`Failed to logout. ${error}`);
    return;
  }
  yield call(syncUserSaga);
}

function* uploadCommentsSaga({ payload }) {
  yield putLoadingStatus(true);

  const { name, email, comments } = payload;
  const commentKey = yield call(fetchNewCommentKey);
  try {
    yield call(rsf.database.update, `comments/${commentKey}`, {
      name,
      email,
      comments,
      created_at: dayjs().format('DD MMMM YYYY hh:mm A'),
    });
    yield putLoadingStatus(false);
    alert(`Successfully posted comment.`);
  } catch (error) {
    yield putLoadingStatus(false);
    alert(`Failed to upload comment. ${error}`);
  }
}

function* fetchAllCommentsSaga() {
  yield putLoadingStatus(true);
  try {
    const data = yield call(rsf.database.read, `comments`);
    const exists = data !== null && data !== undefined;
    if (exists) {
      const commentsArr = Object.values(data);
      yield put(putAllComments(commentsArr));
      yield put(putLoadingStatus(false));
    }
    yield put(putLoadingStatus(false));
  } catch (error) {
    alert(`Failed to retrieve comments. ${error}`);
  }
}

export default function* User() {
  yield all([
    takeLatest(actions.LOGIN.REQUEST, loginSaga),
    takeLatest(actions.LOGIN.ANON_REQUEST, anonLoginSaga),
    takeLatest(actions.LOGOUT.REQUEST, logoutSaga),
    takeEvery(actions.SYNC_USER, syncUserSaga),
    takeLatest(actions.UPLOAD_COMMENTS, uploadCommentsSaga),
    takeLatest(actions.GET_ALL_COMMENTS, fetchAllCommentsSaga),
  ]);
}

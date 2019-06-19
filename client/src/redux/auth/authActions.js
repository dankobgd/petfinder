import * as t from './authTypes';
import { errorActions } from '../error';
import apiClient from '../../utils/apiClient';

const userLoading = () => ({
  type: t.USER_LOADING,
});

const authError = () => ({
  type: t.AUTH_ERROR,
});

const signupError = () => ({
  type: t.SIGNUP_FAILURE,
});
const loginError = () => ({
  type: t.LOGIN_FAILURE,
});

const setCurrentUser = user => ({
  type: t.SET_CURRENT_USER,
  payload: { user },
});

const signup = user => ({
  type: t.SIGNUP_SUCCESS,
  payload: { user },
});

const login = user => ({
  type: t.LOGIN_SUCCESS,
  payload: { user },
});

export const setCurrentUserRequest = () => async dispatch => {
  dispatch(userLoading());

  try {
    const res = await apiClient.get('user/current');
    dispatch(setCurrentUser(res.user));
  } catch (err) {
    dispatch(errorActions.getErrors(err));
    dispatch(authError());
    localStorage.removeItem('access_token');
  }
};

export const userSignupRequest = credentials => async dispatch => {
  try {
    const res = await apiClient.post('auth/signup', { data: credentials });
    dispatch(signup(res));
    localStorage.setItem('access_token', res.accessToken);
  } catch (err) {
    dispatch(errorActions.getErrors(err, 'validation'));
    dispatch(signupError());
    localStorage.removeItem('access_token');
  }
};

export const userLoginRequest = credentials => async dispatch => {
  try {
    const res = await apiClient.post('auth/login', { data: credentials });
    dispatch(login(res));
    localStorage.setItem('access_token', res.accessToken);
  } catch (err) {
    dispatch(errorActions.getErrors(err));
    dispatch(loginError());
    localStorage.removeItem('access_token');
  }
};

export const userLogoutRequest = () => dispatch => {
  dispatch({ type: t.LOGOUT_SUCCESS });
  localStorage.removeItem('access_token');
};

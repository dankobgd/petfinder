import * as t from './authTypes';
import { getErrors } from '../error/errorActions';
import apiClient from '../../utils/apiClient';

export const loadCurrentUserRequest = () => async dispatch => {
  dispatch({ type: t.USER_LOADING });

  try {
    const res = await apiClient.get('/user/current');

    dispatch({
      type: t.USER_LOADED,
      payload: { user: res.user },
    });
  } catch (err) {
    dispatch(getErrors(err));
    dispatch({ type: t.AUTH_ERROR });
  }
};

export const userSignupRequest = credentials => async dispatch => {
  try {
    const res = await apiClient.post('auth/signup', { data: credentials });

    dispatch({
      type: t.REGISTER_SUCCESS,
      payload: {
        accessToken: res.accessToken,
        user: res.user,
      },
    });
  } catch (err) {
    dispatch(getErrors(err));
    dispatch({ type: t.REGISTER_FAIL });
  }
};

export const userLoginRequest = credentials => async dispatch => {
  try {
    const res = await apiClient.post('auth/login', { data: credentials });

    dispatch({
      type: t.LOGIN_SUCCESS,
      payload: {
        accessToken: res.accessToken,
        user: res.user,
      },
    });
  } catch (err) {
    dispatch(getErrors(err));
    dispatch({ type: t.LOGIN_FAIL });
  }
};

export const userLogoutRequest = () => dispatch => {
  dispatch({ type: t.LOGOUT_SUCCESS });
};

import * as t from './authTypes';
import { errorActions } from '../error';
import apiClient from '../../utils/apiClient';

export const setCurrentUserRequest = () => async dispatch => {
  dispatch({ type: t.USER_LOADING });

  const accessToken = localStorage.getItem('access_token');
  if (accessToken) {
    try {
      const res = await apiClient.get('auth/current-user');
      dispatch({
        type: t.SET_CURRENT_USER,
        payload: {
          user: res.user,
        },
      });
    } catch (err) {
      dispatch(errorActions.getErrors(err));
      dispatch({ type: t.AUTH_ERROR });
      localStorage.removeItem('access_token');
    }
  }
};

export const userSignupRequest = credentials => async dispatch => {
  try {
    const res = await apiClient.post('auth/signup', { data: credentials });
    dispatch({
      type: t.SIGNUP_SUCCESS,
      payload: {
        user: res,
      },
    });
    localStorage.setItem('access_token', res.accessToken);
  } catch (err) {
    dispatch(errorActions.getErrors(err));
    dispatch({ type: t.SIGNUP_FAILURE });
    localStorage.removeItem('access_token');
  }
};

export const userLoginRequest = credentials => async dispatch => {
  try {
    const res = await apiClient.post('auth/login', { data: credentials });
    dispatch({
      type: t.LOGIN_SUCCESS,
      payload: {
        user: res,
      },
    });
    localStorage.setItem('access_token', res.accessToken);
  } catch (err) {
    dispatch(errorActions.getErrors(err));
    dispatch({ type: t.LOGIN_FAILURE });
    localStorage.removeItem('access_token');
  }
};

export const userLogoutRequest = () => dispatch => {
  dispatch({ type: t.LOGOUT_SUCCESS });
  localStorage.removeItem('access_token');
};

export const forgotPasswordRequest = credentials => async dispatch => {
  try {
    await apiClient.post('auth/password-forgot', { data: credentials });
    dispatch({ type: t.FORGOT_PASSWORD_SUCCESS });
  } catch (err) {
    dispatch(errorActions.getErrors(err));
  }
};

export const resetPasswordRequest = credentials => async dispatch => {
  try {
    await apiClient.post('auth/password-reset', { data: credentials });
    dispatch({ type: t.RESET_PASSWORD_SUCCESS });
  } catch (err) {
    dispatch(errorActions.getErrors(err));
  }
};

export const validateResetToken = resetToken => async dispatch => {
  try {
    await apiClient.post('auth/validate-reset-token', { data: { resetToken } });
    dispatch({ type: t.VALIDATE_TOKEN_SUCCESS });
  } catch (err) {
    dispatch(errorActions.getErrors(err));
  }
};

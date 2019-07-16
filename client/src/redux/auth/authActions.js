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
    return res;
  } catch (err) {
    dispatch(errorActions.getErrors(err));
    dispatch({ type: t.SIGNUP_FAILURE });
    localStorage.removeItem('access_token');
    throw err;
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
    return res;
  } catch (err) {
    dispatch(errorActions.getErrors(err));
    dispatch({ type: t.LOGIN_FAILURE });
    localStorage.removeItem('access_token');
    throw err;
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
    return Promise.resolve();
  } catch (err) {
    dispatch(errorActions.getErrors(err));
    return Promise.reject(err);
  }
};

export const resetPasswordRequest = credentials => async dispatch => {
  try {
    await apiClient.post('auth/password-reset', { data: credentials });
    dispatch({ type: t.RESET_PASSWORD_SUCCESS });
    return Promise.resolve();
  } catch (err) {
    dispatch(errorActions.getErrors(err));
    return Promise.reject(err);
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

// Update user account details
export const updateUserAccount = accountData => async dispatch => {
  try {
    const formData = new FormData();
    formData.append('username', accountData.username);
    formData.append('email', accountData.email);
    formData.append('avatar', accountData.avatar[0].originFileObj);
    await apiClient.post('user/edit-account', { data: formData });
    dispatch({ type: t.UPDATE_ACCOUNT_SUCCESS });
  } catch (err) {
    dispatch({ type: t.UPDATE_ACCOUNT_FAILURE });
  }
};

// Change user password
export const changeUserPassword = accountData => async dispatch => {
  try {
    await apiClient.post('user/change-password', { data: accountData });
    dispatch({ type: t.CHANGE_PASSWORD_SUCCESS });
    return Promise.resolve();
  } catch (err) {
    dispatch(errorActions.getErrors(err));
    dispatch({ type: t.CHANGE_PASSWORD_FAILURE });
    return Promise.reject(err);
  }
};

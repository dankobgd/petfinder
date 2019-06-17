import * as t from './authTypes';
import { getErrors } from '../error/errorActions';
import apiClient from '../../utils/apiClient';

export const loadUser = () => async dispatch => {
  dispatch({ type: t.USER_LOADING });

  try {
    const response = await apiClient.get('/user');

    dispatch({
      type: t.USER_LOADED,
      payload: { user: response.data },
    });
  } catch (err) {
    dispatch(getErrors(err.data, err.status));
    dispatch({ type: t.AUTH_ERROR });
  }
};

export const userSignup = credentials => async dispatch => {
  try {
    const res = await apiClient.post('auth/signup', { data: credentials });

    dispatch({
      type: t.REGISTER_SUCCESS,
      payload: res,
    });
  } catch (err) {
    dispatch(getErrors(err.data, err.status));
    dispatch({ type: t.REGISTER_FAIL });
  }
};

export const userLogin = credentials => async dispatch => {
  try {
    const res = await apiClient.post('auth/login', { data: credentials });

    dispatch({
      type: t.LOGIN_SUCCESS,
      payload: res,
    });
  } catch (err) {
    dispatch(getErrors(err.data, err.status));
    dispatch({ type: t.LOGIN_FAIL });
  }
};

export const userLogout = () => dispatch => {
  dispatch({ type: t.LOGOUT_SUCCESS });
};

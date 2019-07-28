import * as t from './identityTypes';
import { errorActions } from '../error';
import apiClient from '../../utils/apiClient';

// Authentication
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

// Password Reset Flow
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

// User Profile Information
export const updateUserAvatar = userData => async dispatch => {
  try {
    const formData = new FormData();
    formData.append('avatar', userData.avatar[0].originFileObj);
    const res = await apiClient.post('user/edit-avatar', { data: formData });
    dispatch({
      type: t.UPDATE_AVATAR_SUCCESS,
      payload: { avatar: res.url },
    });
  } catch (err) {
    dispatch({ type: t.UPDATE_AVATAR_FAILURE });
  }
};

export const deleteUserAvatar = avatarUrl => async dispatch => {
  try {
    await apiClient.del('user/delete-avatar', { data: { avatarUrl } });
    dispatch({ type: t.DELETE_AVATAR_SUCCESS });
  } catch (err) {
    dispatch({ type: t.DELETE_AVATAR_FAILURE });
  }
};

export const updateUserAccount = userData => async dispatch => {
  try {
    await apiClient.post('user/edit-account', { data: userData });
    dispatch({
      type: t.UPDATE_ACCOUNT_SUCCESS,
      payload: {
        username: userData.username,
        email: userData.email,
      },
    });
  } catch (err) {
    dispatch(errorActions.getErrors(err));
    dispatch({ type: t.UPDATE_ACCOUNT_FAILURE });
  }
};

export const changeUserPassword = userData => async dispatch => {
  try {
    await apiClient.post('user/change-password', { data: userData });
    dispatch({ type: t.CHANGE_PASSWORD_SUCCESS, payload: userData });
    return Promise.resolve();
  } catch (err) {
    dispatch(errorActions.getErrors(err));
    dispatch({ type: t.CHANGE_PASSWORD_FAILURE });
    return Promise.reject(err);
  }
};

// User Profile Collections
export const fetchUsersPets = () => async dispatch => {
  dispatch({ type: t.FETCH_USERS_PETS });

  try {
    const pets = await apiClient.get('user/pets');
    dispatch({ type: t.FETCH_USERS_PETS_SUCCESS, payload: pets });
  } catch (err) {
    console.log(err);
    dispatch({ type: t.FETCH_USERS_PETS_FAILURE });
  }
};

export const createPet = petData => async dispatch => {
  dispatch({ type: t.CREATE_PET_REQUEST });

  try {
    const profileImage = petData.find(x => x.name === 'profileImage');
    const galleryImages = petData.filter(x => x.name === 'galleryImages');
    const data = petData.filter(x => x.name !== 'profileImage' && x.name !== 'galleryImagse');
    const formData = new FormData();

    data.forEach(elm => formData.append(`${elm.name}`, elm.value));
    formData.append('profileImage', profileImage.value[0].originFileObj);
    galleryImages[0].value.map(val => formData.append('galleryImages', val.originFileObj));

    await apiClient.post('animals/create', { data: formData });
    dispatch({
      type: t.CREATE_PET_SUCCESS,
      payload: { data },
    });
    return Promise.resolve();
  } catch (err) {
    dispatch({ type: t.CREATE_PET_FAILURE });
    return Promise.reject(err);
  }
};
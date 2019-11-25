import * as t from './uiTypes';
import { errorActions } from '../error';
import apiClient from '../../utils/apiClient';

// Filter search pets
export const a = () => async dispatch => {
  try {
    const res = await apiClient.get('');

    dispatch({
      type: '',
      payload: {},
    });
    return res;
  } catch (err) {
    dispatch(errorActions.getErrors(err));
    dispatch({ type: '' });
    return Promise.reject(err);
  }
};

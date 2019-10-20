import * as t from './petsTypes';
import { errorActions } from '../error';
import apiClient from '../../utils/apiClient';

// Filter search pets
export const searchPetsByFilter = filterPath => async dispatch => {
  dispatch({ type: t.SEARCH_PET_REQUEST });
  try {
    const res = await apiClient.get(`${filterPath}`);

    dispatch({
      type: t.SEARCH_PET_SUCCESS,
      payload: {
        pets: res.animals,
      },
    });
  } catch (err) {
    dispatch(errorActions.getErrors(err));
    dispatch({ type: t.SEARCH_PET_FAILURE });
  }
};

import * as t from './petsTypes';
import { errorActions } from '../error';
import apiClient from '../../utils/apiClient';

// Filter search pets
export const searchPetsByFilter = filter => async dispatch => {
  dispatch({ type: t.SEARCH_PET_REQUEST });
  try {
    const res = await apiClient.get(`animals?${filter}`);

    dispatch({
      type: t.SEARCH_PET_SUCCESS,
      payload: {
        pets: res.animals,
        meta: res.meta,
      },
    });
    return res;
  } catch (err) {
    dispatch(errorActions.getErrors(err));
    dispatch({ type: t.SEARCH_PET_FAILURE });
    return Promise.reject(err);
  }
};

export const clearSearch = () => dispatch => {
  dispatch({ type: t.CLEAR_PETS_SEARCH });
};

export const fetchLatestAnimals = () => async dispatch => {
  dispatch({ type: t.FETCH_LATEST_ANIMALS_REQUEST });
  try {
    const res = await apiClient.get('animals/latest');
    dispatch({
      type: t.FETCH_LATEST_ANIMALS_SUCCESS,
      payload: { pets: res.animals },
    });
  } catch (err) {
    dispatch(errorActions.getErrors(err));
    dispatch({ type: t.FETCH_LATEST_ANIMALS_FAILURE });
  }
};

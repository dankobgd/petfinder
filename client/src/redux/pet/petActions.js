import * as t from './petTypes';
import { errorActions } from '../error';
import apiClient from '../../utils/apiClient';

export const createPetRequest = petData => async dispatch => {
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
  } catch (err) {
    dispatch({ type: t.CREATE_PET_FAILURE });
  }
};

export const getUserAddedAnimals = () => async dispatch => {
  try {
    await apiClient.get('animals/added');
    dispatch({ type: t.GET_ADDED_PETS_SUCCESS });
  } catch (err) {
    dispatch({ type: t.GET_ADDED_PETS_FAILURE });
  }
};

import * as t from './petsTypes';

const initialState = {
  isLoading: false,
  list: [],
  meta: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case t.SEARCH_PET_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case t.SEARCH_PET_SUCCESS:
      return {
        ...state,
        list: action.payload.pets,
        meta: action.payload.meta,
        isLoading: false,
      };
    case t.SEARCH_PET_FAILURE:
      return {
        ...state,
        isLoading: false,
      };
    case t.CLEAR_PETS_SEARCH:
      return {
        list: [],
        isLoading: false,
      };
    default:
      return state;
  }
};

export default reducer;

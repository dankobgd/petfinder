import * as t from './petsTypes';

const initialState = {
  isLoading: false,
  searchResults: [],
  meta: null,
  latest: [],
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
        searchResults: action.payload.pets,
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
        searchResults: [],
        isLoading: false,
      };
    case t.FETCH_LATEST_ANIMALS_SUCCESS:
      return {
        ...state,
        latest: action.payload.pets,
      };
    default:
      return state;
  }
};

export default reducer;

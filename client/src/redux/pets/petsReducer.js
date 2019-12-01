import * as t from './petsTypes';
import { identityTypes } from '../identity';

const initialState = {
  isLoading: false,
  meta: null,
  searchResults: [],
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
    case identityTypes.LIKE_ANIMAL: {
      return {
        ...state,
        latest: state.latest.map(x =>
          x.id === action.payload ? { ...x, liked: true, likes_count: (x.likes_count += 1) } : x
        ),
        searchResults: state.searchResults.map(x =>
          x.id === action.payload ? { ...x, liked: true, likes_count: (x.likes_count += 1) } : x
        ),
      };
    }
    case identityTypes.UNLIKE_ANIMAL: {
      return {
        ...state,
        latest: state.latest.map(x =>
          x.id === action.payload ? { ...x, liked: false, likes_count: (x.likes_count -= 1) } : x
        ),
        searchResults: state.latest.map(x =>
          x.id === action.payload ? { ...x, liked: false, likes_count: (x.likes_count -= 1) } : x
        ),
      };
    }
    case identityTypes.ADOPT_ANIMAL:
      return {
        ...state,
        latest: state.latest.map(x => (x.id === action.payload ? { ...x, adopted: true } : x)),
        searchResults: state.searchResults.map(x => (x.id === action.payload ? { ...x, adopted: true } : x)),
      };

    default:
      return state;
  }
};

export default reducer;

import * as t from './petsTypes';
import { identityTypes } from '../identity';

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
    case identityTypes.LIKE_ANIMAL: {
      const newLatest = state.latest.map(x => {
        return x.id === action.payload ? { ...x, liked: true, likes_count: (x.likes_count += 1) } : x;
      });
      const newSearchRes = state.searchResults.map(x => {
        return x.id === action.payload ? { ...x, liked: true, likes_count: (x.likes_count += 1) } : x;
      });
      return {
        ...state,
        latest: newLatest,
        searchResults: newSearchRes,
      };
    }
    case identityTypes.UNLIKE_ANIMAL: {
      const newLatest = state.latest.map(x => {
        return x.id === action.payload ? { ...x, liked: false, likes_count: (x.likes_count -= 1) } : x;
      });
      const newSearchRes = state.latest.map(x => {
        return x.id === action.payload ? { ...x, liked: false, likes_count: (x.likes_count -= 1) } : x;
      });
      return {
        ...state,
        latest: newLatest,
        searchResults: newSearchRes,
      };
    }
    default:
      return state;
  }
};

export default reducer;

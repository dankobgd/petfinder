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
          x.id === action.payload.animalId
            ? {
                ...x,
                liked: true,
                likes_count: (x.likes_count += 1),
                liked_by: [...x.liked_by, { id: action.payload.user.id, username: action.payload.user.username }],
              }
            : x
        ),
        searchResults: state.searchResults.map(x =>
          x.id === action.payload.animalId
            ? {
                ...x,
                liked: true,
                likes_count: (x.likes_count += 1),
                liked_by: [...x.liked_by, { id: action.payload.user.id, username: action.payload.user.username }],
              }
            : x
        ),
      };
    }
    case identityTypes.UNLIKE_ANIMAL: {
      return {
        ...state,
        latest: state.latest.map(x =>
          x.id === action.payload.animalId
            ? {
                ...x,
                liked: false,
                likes_count: (x.likes_count -= 1),
                liked_by: x.liked_by.filter(x => x.id !== action.payload.user.id),
              }
            : x
        ),
        searchResults: state.latest.map(x =>
          x.id === action.payload.animalId
            ? {
                ...x,
                liked: false,
                likes_count: (x.likes_count -= 1),
                liked_by: x.liked_by.filter(x => x.id !== action.payload.user.id),
              }
            : x
        ),
      };
    }
    case identityTypes.ADOPT_ANIMAL:
      return {
        ...state,
        latest: state.latest.filter(x => x.id !== action.payload),
        searchResults: state.searchResults.filter(x => x.id !== action.payload),
      };
    case identityTypes.UPDATE_PET_SUCCESS:
      return {
        ...state,
        latest: state.latest.map(x => (x.id === action.payload.id ? { ...x, ...action.payload.petData } : x)),
        searchResults: state.searchResults.map(x =>
          x.id === action.payload.id ? { ...x, ...action.payload.petData } : x
        ),
      };
    case identityTypes.DELETE_PET_SUCCESS:
      return {
        ...state,
        latest: state.latest.filter(x => x.id !== action.payload.id),
        searchResults: state.searchResults.filter(x => x.id !== action.payload.id),
      };
    default:
      return state;
  }
};

export default reducer;

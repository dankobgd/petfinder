import * as t from './identityTypes';

const initialState = {
  accessToken: localStorage.getItem('access_token'),
  isAuthenticated: false,
  isLoading: false,
  user: null,
  postedPets: [],
  likedPets: [],
  adoptedPets: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case t.USER_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case t.SET_CURRENT_USER:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
      };
    case t.SIGNUP_SUCCESS:
    case t.LOGIN_SUCCESS:
      return {
        ...state,
        ...action.payload.accessToken,
        ...action.payload.user,
        isLoading: false,
        isAuthenticated: true,
      };
    case t.AUTH_ERROR:
    case t.SIGNUP_FAILURE:
    case t.LOGIN_FAILURE:
    case t.LOGOUT_SUCCESS:
      return {
        ...state,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
        user: null,
      };
    case t.UPDATE_AVATAR_SUCCESS:
    case t.UPDATE_ACCOUNT_SUCCESS:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
      };
    case t.DELETE_AVATAR_SUCCESS:
      const withoutAvatar = Object.keys(state.user)
        .filter(key => key !== 'avatar')
        .reduce((result, cur) => {
          result[cur] = state.user[cur];
          return result;
        }, {});
      return {
        ...state,
        user: { ...withoutAvatar },
      };
    case t.FETCH_USERS_PETS:
    case t.FETCH_LIKED_PETS:
    case t.FETCH_ADOPTED_PETS:
      return {
        ...state,
        isLoading: true,
      };
    case t.FETCH_USERS_PETS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        postedPets: action.payload.pets,
      };
    case t.FETCH_LIKED_PETS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        likedPets: action.payload.pets,
      };
    case t.FETCH_ADOPTED_PETS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        adoptedPets: action.payload.pets,
      };

    case t.CREATE_PET_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case t.CREATE_PET_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };
    case t.LIKE_ANIMAL: {
      return {
        ...state,
        likedPets: state.likedPets.filter(x => x.id === action.payload.animalId),
        postedPets: state.postedPets.map(x =>
          x.id === action.payload.animalId
            ? {
                ...x,
                liked: true,
                likes_count: (x.likes_count += 1),
                liked_by: [...x.liked_by, { id: action.payload.user.id, username: action.payload.user.username }],
              }
            : x
        ),
        adoptedPets: state.adoptedPets.map(x =>
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
    case t.UNLIKE_ANIMAL: {
      return {
        ...state,
        likedPets: state.likedPets.filter(x => x.id !== action.payload.animalId),
        postedPets: state.postedPets.map(x =>
          x.id === action.payload.animalId
            ? {
                ...x,
                liked: false,
                likes_count: (x.likes_count -= 1),
                liked_by: x.liked_by.filter(x => x.id !== action.payload.user.id),
              }
            : x
        ),
        adoptedPets: state.adoptedPets.map(x =>
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
    case t.ADOPT_ANIMAL:
      return {
        ...state,
        adoptedPets: state.adoptedPets.map(x => (x.id === action.payload ? { ...x, adopted: true } : x)),
        likedPets: state.likedPets.map(x => (x.id === action.payload ? { ...x, adopted: true } : x)),
      };
    case t.UPDATE_PET_SUCCESS:
      return {
        ...state,
        likedPets: state.likedPets.map(x => (x.id === action.payload.id ? { ...x, ...action.payload.petData } : x)),
        adoptedPets: state.adoptedPets.map(x => (x.id === action.payload.id ? { ...x, ...action.payload.petData } : x)),
        postedPets: state.postedPets.map(x => (x.id === action.payload.id ? { ...x, ...action.payload.petData } : x)),
      };
    case t.DELETE_PET_SUCCESS:
      return {
        ...state,
        likedPets: state.likedPets.filter(x => x.id !== action.payload.id),
        adoptedPets: state.adoptedPets.filter(x => x.id !== action.payload.id),
        postedPets: state.postedPets.filter(x => x.id !== action.payload.id),
      };
    default:
      return state;
  }
};

export default reducer;

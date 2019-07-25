import * as t from './identityTypes';

const initialState = {
  accessToken: localStorage.getItem('access_token'),
  isAuthenticated: false,
  isLoading: false,
  user: null,
  pets: [],
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
      return {
        ...state,
        isLoading: true,
      };
    case t.FETCH_USERS_PETS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        pets: action.payload.pets,
      };
    default:
      return state;
  }
};

export default reducer;

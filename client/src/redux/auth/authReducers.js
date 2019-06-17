import * as t from './authTypes';

const initialState = {
  accessToken: localStorage.getItem('access_token'),
  isAuthenticated: false,
  isLoading: false,
  user: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case t.USER_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case t.USER_LOADED:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
      };
    case (t.LOGIN_SUCCESS, t.REGISTER_SUCCESS):
      localStorage.setItem('access_token', action.payload.accessToken);
      return {
        ...state,
        ...action.payload,
        isLoading: false,
        isAuthenticated: true,
      };
    case (t.AUTH_ERROR, t.REGISTER_FAIL, t.LOGIN_FAIL, t.LOGOUT_SUCCESS):
      localStorage.removeItem('access_token');
      return {
        ...state,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
        user: null,
      };
    default:
      return state;
  }
};

export default reducer;

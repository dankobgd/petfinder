import * as t from './errorTypes';

const initialState = {
  message: {},
  id: null,
  status: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case t.GET_ERRORS:
      return {
        message: action.payload.message,
        id: action.payload.id,
        status: action.payload.status,
      };
    case t.CLEAR_ERRORS:
      return {
        message: {},
        id: null,
        status: null,
      };
    default:
      return state;
  }
};

export default reducer;

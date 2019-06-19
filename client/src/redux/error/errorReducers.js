import * as t from './errorTypes';

const initialState = {
  message: '',
  type: '',
  statusText: '',
  status: null,
  data: {},
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case t.GET_ERRORS:
      return {
        ...state,
        message: action.payload.error.data.message,
        type: action.payload.error.data.type,
        data: action.payload.error.data.data,
        status: action.payload.error.status,
        statusText: action.payload.error.statusText,
      };
    case t.CLEAR_ERRORS:
      return {
        message: '',
        type: '',
        statusText: '',
        status: null,
        data: {},
      };
    default:
      return state;
  }
};

export default reducer;

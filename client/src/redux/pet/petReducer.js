import * as t from './petTypes';

const initialState = {
  isLoading: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
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
    case t.CREATE_PET_FAILURE:
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
};

export default reducer;

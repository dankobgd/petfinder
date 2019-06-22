import * as t from './toastTypes';

const initialState = [];

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case t.ADD_TOAST:
      return [
        ...state,
        {
          id: Date.now(),
          type: action.payload.toast.type,
          msg: action.payload.toast.msg,
        },
      ];
    case t.REMOVE_TOAST:
      return state.filter(t => t.id !== action.payload.id);
    default:
      return state;
  }
};

export default reducer;

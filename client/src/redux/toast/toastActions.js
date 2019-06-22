import * as t from './toastTypes';

export const addToast = toast => dispatch => {
  dispatch({
    type: t.ADD_TOAST,
    payload: { toast },
  });
};

export const removeToast = id => dispatch => {
  dispatch({
    type: t.REMOVE_TOAST,
    payload: { id },
  });
};

import * as t from './errorTypes';

export const getErrors = error => ({
  type: t.GET_ERRORS,
  payload: { error },
});

export const clearErrors = () => ({
  type: t.CLEAR_ERRORS,
});

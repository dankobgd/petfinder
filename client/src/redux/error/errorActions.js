import * as t from './errorTypes';

export const getErrors = (message, status, id = null) => ({
  type: t.GET_ERRORS,
  payload: { message, status, id },
});

export const clearErrors = () => ({
  type: t.CLEAR_ERRORS,
});

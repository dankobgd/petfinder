import { combineReducers } from 'redux';
import authReducer from './auth';
import errorReducer from './error';
import toastReducer from './toast';
import petReducer from './pet';

export default combineReducers({
  auth: authReducer,
  error: errorReducer,
  toast: toastReducer,
  pet: petReducer,
});

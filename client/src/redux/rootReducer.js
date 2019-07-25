import { combineReducers } from 'redux';
import identityReducer from './identity';
import errorReducer from './error';
import toastReducer from './toast';
import petReducer from './pet';

export default combineReducers({
  identity: identityReducer,
  error: errorReducer,
  toast: toastReducer,
  pet: petReducer,
});

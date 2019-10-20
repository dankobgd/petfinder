import { combineReducers } from 'redux';
import identityReducer from './identity';
import errorReducer from './error';
import toastReducer from './toast';
import petsReducer from './pets';

export default combineReducers({
  identity: identityReducer,
  error: errorReducer,
  toast: toastReducer,
  pets: petsReducer,
});

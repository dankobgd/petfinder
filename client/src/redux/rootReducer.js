import { combineReducers } from 'redux';
import identityReducer from './identity';
import errorReducer from './error';
import toastReducer from './toast';
import petsReducer from './pets';
import uiReducer from './ui';

export default combineReducers({
  identity: identityReducer,
  error: errorReducer,
  toast: toastReducer,
  pets: petsReducer,
  ui: uiReducer,
});

import { combineReducers } from 'redux';
import identityReducer from './identity';
import errorReducer from './error';
import toastReducer from './toast';

export default combineReducers({
  identity: identityReducer,
  error: errorReducer,
  toast: toastReducer,
});

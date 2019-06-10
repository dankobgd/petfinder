import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './rootReducer';

const reduxMiddleware = [thunk];

const initialState = {};

const store = createStore(rootReducer, initialState, composeWithDevTools(applyMiddleware(...reduxMiddleware)));

export default store;

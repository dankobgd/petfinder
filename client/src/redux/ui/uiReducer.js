import * as t from './uiTypes';

const initialState = {};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'stuff':
      return {
        a: 'stuff',
      };
    default:
      return state;
  }
};

export default reducer;

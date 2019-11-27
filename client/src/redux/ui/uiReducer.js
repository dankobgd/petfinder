import * as t from './uiTypes';
import initialFormState from '../../screens/search/initialFormState';

const initialState = {
  topSearchFilterCompleted: false,
  searchForm: initialFormState,
  qs: '',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case t.TOGGLE_SEARCH_FILTER:
      return {
        ...state,
        topSearchFilterCompleted: action.payload,
      };
    case t.PERSIST_SEARCH_FORM:
      return {
        ...state,
        searchForm: {
          ...state.searchForm,
          ...action.payload.searchForm,
        },
      };
    case t.CLEAR_SEARCH_FORM:
      return {
        ...state,
        searchForm: initialFormState,
      };
    case t.PERSIST_QUERY_STRING:
      return {
        ...state,
        qs: action.payload.qs,
      };
    default:
      return state;
  }
};

export default reducer;

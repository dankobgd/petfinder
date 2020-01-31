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
    case t.REMOVE_FROM_SEARCH_FORM:
      const copy = { ...state.searchForm };
      if (action.payload.key !== 'days' && action.payload.key !== 'name') {
        return {
          ...state,
          searchForm: {
            ...copy,
            [action.payload.key]: copy[action.payload.key].filter(x => x !== action.payload.val),
          },
        };
      } else {
        return {
          ...state,
          searchForm: {
            ...copy,
            [action.payload.key]: undefined,
          },
        };
      }
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

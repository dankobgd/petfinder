import * as t from './uiTypes';

// Toggle top search filter state
export const toggleSearchFilter = bool => dispatch => {
  dispatch({ type: t.TOGGLE_SEARCH_FILTER, payload: bool });
};

// Save search filters state
export const persistSearchForm = searchForm => dispatch => {
  dispatch({ type: t.PERSIST_SEARCH_FORM, payload: { searchForm } });
};

// Remove single search form item
export const removeFromSearchForm = (key, val) => dispatch => {
  dispatch({ type: t.REMOVE_FROM_SEARCH_FORM, payload: { key, val } });
};

// Save query string
export const persistQueryString = qs => dispatch => {
  dispatch({ type: t.PERSIST_QUERY_STRING, payload: { qs } });
};

// Clear search filters state
export const clearSearchForm = () => dispatch => {
  dispatch({ type: t.CLEAR_SEARCH_FORM });
};

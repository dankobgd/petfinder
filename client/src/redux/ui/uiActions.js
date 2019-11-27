import * as t from './uiTypes';

// Toggle top search filter state
export const toggleSearchFilter = bool => dispatch => {
  dispatch({ type: t.TOGGLE_SEARCH_FILTER, payload: bool });
};

// Save search filters state
export const persistSearchForm = searchForm => dispatch => {
  dispatch({ type: t.PERSIST_SEARCH_FORM, payload: { searchForm } });
};

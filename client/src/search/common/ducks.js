import update from 'immutability-helper';
import { createActions, handleActions } from 'redux-actions';
import _ from 'lodash';

const defaultSectionState = (pageSize, criteria) => {
  return {
    inputValues: {}, // Input values for autocomplete
    criteria, // Criteria for search
    criteriaOptions: {}, // Options for criteria fields
    // Paging for search
    paging: {
      page: 0,
      pageSize
    },
    // Search results
    results: {
      status: 'idle',
      statusMessage: '',
      items: [],
      isSorted: true,
      totalCount: -1,
      selectedIndex: -1,
      selectedBy: undefined
    },
    // Filters for filtering the result list
    filters: {}
  };
};

// TODO move harcoded posts/images sections elsewhere
const defaultState = {
  posts: defaultSectionState(20, {
    sortBy: '-'
  }),
  images: defaultSectionState(20, {
    sortBy: '-',
    dateType: 'archiveDate'
  })
};

// Actions

export const { search } = createActions({
  SEARCH: {
    // TODO clear and set and basically the same action? Remove the other one?
    CLEAR: (section, newSectionState) => ({ section, newSectionState }),
    SET: (section, newSectionState) => ({ section, newSectionState }),
    REFRESH: section => ({ section }),
    RELOAD: section => ({ section }),
    // User actions
    UPDATE_INPUT_VALUE: (section, name, value) => ({ section, name, value }),
    UPDATE_CRITERIA: (section, name, value, doSearch) => ({
      section,
      name,
      value,
      doSearch
    }),
    UPDATE_FILTER: (section, name, value) => ({ section, name, value }),
    UPDATE_PAGING: (section, name, value, selectedIndex) => ({
      section,
      name,
      value,
      selectedIndex
    }),
    SELECT_ITEM: (section, index, selectedBy) => ({
      section,
      index,
      selectedBy
    }),
    SHOW_ITEM: (section, index, selectedBy) => ({ section, index, selectedBy }),
    // Fetch criteria options actions
    FETCH_CRITERIA_OPTIONS_SUCCEEDED: (section, criteriaOptions) => ({
      section,
      criteriaOptions
    }),
    FETCH_CRITERIA_OPTIONS_FAILED: (section, message) => ({ section, message }),
    // Fetch items actions
    FETCH_ITEMS_STARTED: section => ({ section }),
    FETCH_ITEMS_SUCCEEDED: ({
      section, items, isSorted, totalCount
    }) => ({
      section,
      items,
      isSorted,
      totalCount
    }),
    FETCH_ITEMS_FAILED: (section, message) => ({ section, message }),
    // Read item actions
    READ_ITEM_SUCCEEDED: ({ section, item }) => ({
      section,
      item
    }),
    READ_ITEM_FAILED: (section, message) => ({ section, message })
  }
});

// Action helpers

// Add section as first parameter for an action call
export const withSection = (section, actionCreator) => {
  return (...args) => {
    actionCreator(section, ...args);
  };
};

// Reducer
export const searchReducer = handleActions(
  {
    // User actions

    // TODO clear and set and basically the same action? Remove the other one?
    [search.clear](
      state,
      {
        payload: { section, newSectionState }
      }
    ) {
      return update(state, {
        [section]: { $set: _.merge(defaultState[section], newSectionState) }
      });
    },
    [search.set](
      state,
      {
        payload: { section, newSectionState }
      }
    ) {
      return update(state, {
        [section]: { $set: { ...defaultState[section], ...newSectionState } }
      });
    },
    [search.updateInputValue](
      state,
      {
        payload: { section, name, value }
      }
    ) {
      return update(state, {
        [section]: { inputValues: { [name]: { $set: value } } }
      });
    },
    [search.updateCriteria](
      state,
      {
        payload: {
          section, name, value, doSearch
        }
      }
    ) {
      // When changing search criteria the search is triggered automatically.
      // In this case the searc should be executed with the values shown at the
      // moment in the input fields even if some of them are not 'submitted'
      // yet. Therefore we combine old criteria, currently shown input values
      // and the changed criteria and use the result as both input values and
      // search criteria.
      const newCriteria = {
        ...state[section].criteria, // TODO criteria is unnecessary here?
        ...state[section].inputValues,
        [name]: value
      };

      // If we trigger search, we also clear old results
      return doSearch
        ? update(state, {
          [section]: {
            criteria: { $set: newCriteria },
            inputValues: { $set: newCriteria },
            paging: { page: { $set: 0 } },
            results: {
              isSorted: { $set: true },
              totalCount: { $set: -1 },
              selectedIndex: { $set: -1 },
              selectedBy: { $set: undefined }
            }
          }
        })
        : update(state, {
          [section]: {
            criteria: { $set: newCriteria },
            inputValues: { $set: newCriteria }
          }
        });
    },
    [search.updateFilter](
      state,
      {
        payload: { section, name, value }
      }
    ) {
      return update(state, {
        [section]: {
          filters: { [name]: { $set: value } }
        }
      });
    },
    [search.updatePaging](
      state,
      {
        payload: {
          section, name, value, selectedIndex
        }
      }
    ) {
      return update(state, {
        [section]: {
          paging: { [name]: { $set: value } },
          results: {
            selectedIndex: {
              $set: selectedIndex !== undefined ? selectedIndex : -1
            },
            selectedBy: { $set: undefined }
          }
        }
      });
    },
    [search.selectItem](
      state,
      {
        payload: { section, index, selectedBy }
      }
    ) {
      return update(state, {
        [section]: {
          results: {
            selectedIndex: { $set: index },
            selectedBy: { $set: selectedBy }
          }
        }
      });
    },
    [search.showItem](
      state,
      {
        payload: { section, index, selectedBy }
      }
    ) {
      return update(state, {
        [section]: {
          results: {
            selectedIndex: { $set: index },
            selectedBy: { $set: selectedBy }
          }
        }
      });
    },

    // Fetch criteria options actions
    [search.fetchCriteriaOptionsSucceeded](
      state,
      {
        payload: { section, criteriaOptions }
      }
    ) {
      return update(state, {
        [section]: {
          criteriaOptions: {
            $set: { ...state[section].criteriaOptions, ...criteriaOptions }
          }
        }
      });
    },
    [search.fetchCriteriaOptionsFailed](
      state,
      {
        payload: { section, message }
      }
    ) {
      return update(state, {
        [section]: {
          results: {
            status: { $set: 'error' },
            statusMessage: { $set: message }
          }
        }
      });
    },

    // Fetch items actions

    [search.fetchItemsStarted](
      state,
      {
        payload: { section }
      }
    ) {
      return update(state, {
        [section]: {
          results: {
            status: { $set: 'fetching' },
            items: { $set: [] }
          }
        }
      });
    },
    [search.fetchItemsSucceeded](
      state,
      {
        payload: {
          section, totalCount, items, isSorted
        }
      }
    ) {
      return update(state, {
        [section]: {
          results: {
            status: { $set: 'idle' },
            items: { $set: items },
            isSorted: { $set: isSorted },
            totalCount: { $set: totalCount }
          }
        }
      });
    },
    [search.fetchItemsFailed](
      state,
      {
        payload: { section, message }
      }
    ) {
      return update(state, {
        [section]: {
          results: {
            status: { $set: 'error' },
            statusMessage: { $set: message }
          }
        }
      });
    },

    // Read item actions

    [search.readItemSucceeded](
      state,
      {
        payload: { section, item }
      }
    ) {
      return update(state, {
        [section]: {
          results: {
            $set: {
              status: 'idle',
              items: [item],
              isSorted: true,
              totalCount: 1,
              selectedIndex: 0,
              selectedBy: undefined
            }
          }
        }
      });
    }
  },
  defaultState
);

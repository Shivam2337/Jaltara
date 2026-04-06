const initialState = {
  categories: [],
  loading: false,
  error: null,
};

const categoriesReducer = (state = initialState, action) => {

  switch (action.type) {

    case "CATEGORY_LIST_REQUEST":
      return {
        ...state,
        loading: true,
      };

    case "CATEGORY_LIST_SUCCESS":
    return {
      ...state,
      loading: false,
      categories: Array.isArray(action.payload)
        ? action.payload
        : action.payload.results || action.payload.data || [],
    };

    case "CATEGORY_LIST_FAIL":
      return {
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default categoriesReducer;
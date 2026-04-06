const initialState = {
  addons: [],
  loading: false,
  error: null,
};

const AdminAddOnReducer = (state = initialState, action) => {
  switch (action.type) {

    case "ADDON_LIST_REQUEST":
      return { ...state, loading: true };

    case "ADDON_LIST_SUCCESS":
      return {
        loading: false,
        addons: action.payload,
      };

    case "ADDON_LIST_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default AdminAddOnReducer;
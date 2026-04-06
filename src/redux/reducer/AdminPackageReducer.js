const initialState = {
  packageList: [],
  loading: false,
  error: null,
};

export const AdminPackageReducer = (state = initialState, action) => {
  switch (action.type) {
    case "PACKAGE_LIST_REQUEST":
      return {
        ...state,
        loading: true,
      };

    case "PACKAGE_LIST_SUCCESS":
      return {
        loading: false,
        packageList: action.payload,
      };

    case "PACKAGE_LIST_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "PACKAGE_EDIT_SUCCESS":
        return {
            ...state,
            packageList: state.packageList.map((pkg) =>
            pkg.id === action.payload.id ? action.payload : pkg
            ),
        };

    default:
      return state;
  }
};
const initialState = {
  packageItems: [],
  loading: false,
  error: null
};

export const packageItemReducer = (state = initialState, action) => {

  switch (action.type) {

    /* ============================= */
    /* LIST */
    /* ============================= */

    case "PACKAGE_ITEM_LIST_REQUEST":
      return {
        ...state,
        loading: true
      };

    case "PACKAGE_ITEM_LIST_SUCCESS":
      return {
        ...state,
        loading: false,
        packageItems: action.payload
      };

    case "PACKAGE_ITEM_LIST_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload
      };


    /* ============================= */
    /* CREATE */
    /* ============================= */

    case "PACKAGE_ITEM_CREATE_REQUEST":
      return {
        ...state,
        loading: true
      };

    case "PACKAGE_ITEM_CREATE_SUCCESS":
      return {
        ...state,
        loading: false,
        packageItems: [...state.packageItems, action.payload]
      };

    case "PACKAGE_ITEM_CREATE_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload
      };


    /* ============================= */
    /* UPDATE */
    /* ============================= */

    case "PACKAGE_ITEM_UPDATE_REQUEST":
      return {
        ...state,
        loading: true
      };

    case "PACKAGE_ITEM_UPDATE_SUCCESS":
      return {
        ...state,
        loading: false,
        packageItems: state.packageItems.map((item) =>
          item.id === action.payload.id ? action.payload : item
        )
      };

    case "PACKAGE_ITEM_UPDATE_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload
      };


    /* ============================= */
    /* DELETE */
    /* ============================= */

    case "PACKAGE_ITEM_DELETE_REQUEST":
      return {
        ...state,
        loading: true
      };

    case "PACKAGE_ITEM_DELETE_SUCCESS":
      return {
        ...state,
        loading: false,
        packageItems: state.packageItems.filter(
          (item) => item.id !== action.payload
        )
      };

    case "PACKAGE_ITEM_DELETE_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload
      };


    default:
      return state;
  }

};
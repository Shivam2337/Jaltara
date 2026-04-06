const initialState = {
  about: [],
  loading: false,
  error: null,
};

export const AdminAboutReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ABOUT_GET_REQUEST":
    case "ABOUT_CREATE_REQUEST":
    case "ABOUT_UPDATE_REQUEST":
    case "ABOUT_CARD_CREATE_REQUEST":
    case "ABOUT_CARD_UPDATE_REQUEST":
    case "ABOUT_FEATURE_CREATE_REQUEST":
    case "ABOUT_FEATURE_UPDATE_REQUEST":
      return {
        ...state,
        loading: true,
      };

    case "ABOUT_GET_SUCCESS":
      return {
        ...state,
        loading: false,
        about: action.payload,
      };

    case "ABOUT_CREATE_SUCCESS":
    case "ABOUT_UPDATE_SUCCESS":
    case "ABOUT_CARD_CREATE_SUCCESS":
    case "ABOUT_CARD_UPDATE_SUCCESS":
    case "ABOUT_FEATURE_CREATE_SUCCESS":
    case "ABOUT_FEATURE_UPDATE_SUCCESS":
      return {
        ...state,
        loading: false,
      };

    case "ABOUT_GET_FAIL":
    case "ABOUT_CREATE_FAIL":
    case "ABOUT_UPDATE_FAIL":
    case "ABOUT_CARD_CREATE_FAIL":
    case "ABOUT_CARD_UPDATE_FAIL":
    case "ABOUT_FEATURE_CREATE_FAIL":
    case "ABOUT_FEATURE_UPDATE_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

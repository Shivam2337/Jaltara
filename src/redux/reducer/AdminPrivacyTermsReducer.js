const initialState = {
  terms: null,
  privacy: null,
  pages: [],

  loading: false,
  error: null,
};

export const AdminPrivacyTermsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "TERMS_GET_REQUEST":
    case "TERMS_CREATE_REQUEST":
    case "TERMS_UPDATE_REQUEST":
      return {
        ...state,
        loading: true,
      };

    case "TERMS_GET_SUCCESS":
    case "TERMS_CREATE_SUCCESS":
    case "TERMS_UPDATE_SUCCESS":
      return {
        ...state,
        loading: false,
        terms: action.payload,
      };

    case "TERMS_GET_FAIL":
    case "TERMS_CREATE_FAIL":
    case "TERMS_UPDATE_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "PRIVACY_GET_REQUEST":
    case "PRIVACY_CREATE_REQUEST":
    case "PRIVACY_UPDATE_REQUEST":
      return {
        ...state,
        loading: true,
      };

    case "PRIVACY_GET_SUCCESS":
    case "PRIVACY_CREATE_SUCCESS":
    case "PRIVACY_UPDATE_SUCCESS":
      return {
        ...state,
        loading: false,
        privacy: action.payload,
      };

    case "PRIVACY_GET_FAIL":
    case "PRIVACY_CREATE_FAIL":
    case "PRIVACY_UPDATE_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "PAGES_GET_REQUEST":
      return {
        ...state,
        loading: true,
      };

    case "PAGES_GET_SUCCESS":
      return {
        ...state,
        loading: false,
        pages: action.payload,
      };

    case "PAGES_GET_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

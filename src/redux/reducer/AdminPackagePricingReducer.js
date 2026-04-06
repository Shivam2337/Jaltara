const initialState = {
  pricing: [],
  loading: false,
  error: null,
};

export const packagePricingReducer = (state = initialState, action) => {
  switch (action.type) {
    case "PACKAGE_PRICING_LIST_REQUEST":
    case "PACKAGE_PRICING_CREATE_REQUEST":
    case "PACKAGE_PRICING_UPDATE_REQUEST":
    case "PACKAGE_PRICING_DELETE_REQUEST":
      return {
        ...state,
        loading: true,
      };

    case "PACKAGE_PRICING_LIST_SUCCESS":
      return {
        ...state,
        loading: false,
        pricing: action.payload,
      };

    case "PACKAGE_PRICING_CREATE_SUCCESS":
      return {
        ...state,
        loading: false,
        pricing: [...state.pricing, action.payload],
      };

    case "PACKAGE_PRICING_UPDATE_SUCCESS":
      return {
        ...state,
        loading: false,
        pricing: state.pricing.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
      };

    case "PACKAGE_PRICING_DELETE_SUCCESS":
      return {
        ...state,
        loading: false,
        pricing: state.pricing.filter((item) => item.id !== action.payload),
      };

    case "PACKAGE_PRICING_LIST_FAIL":
    case "PACKAGE_PRICING_CREATE_FAIL":
    case "PACKAGE_PRICING_UPDATE_FAIL":
    case "PACKAGE_PRICING_DELETE_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
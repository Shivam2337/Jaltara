const initialState = {
  loading: false,
  pricing: [],
  error: null
};

export const AdminRoomPricingReducer = (state = initialState, action) => {

  switch (action.type) {

    case "PRICING_REQUEST":
      return {
        ...state,
        loading: true
      };

    case "PRICING_SUCCESS":
      return {
        loading: false,
        pricing: action.payload,
        error: null
      };

    case "PRICING_FAIL":
      return {
        loading: false,
        pricing: [],
        error: action.payload
      };

    default:
      return state;

  }

};
const initialState = {
  pricingList: [],
  loading: false,
  error: null,
};

export const AdminWaterParkPricingReducer = (state = initialState, action) => {
  switch (action.type) {
    case "PRICING_REQUEST":
      return { ...state, loading: true };
    case "PRICING_SUCCESS":
      return { ...state, loading: false, pricingList: action.payload };
    case "PRICING_ADD_SUCCESS":
      return { ...state, pricingList: [...state.pricingList, action.payload] };
    case "PRICING_DELETE_SUCCESS":
      return { ...state, pricingList: state.pricingList.filter(p => p.id !== action.payload) };
    case "PRICING_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
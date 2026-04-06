const initialState = {
  pricings: [],
  loading: false,
  error: null,
};

const AdminAddOnPricingReducer = (state = initialState, action) => {

  switch (action.type) {

    case "ADDON_PRICING_LIST_REQUEST":
      return { ...state, loading: true };

    case "ADDON_PRICING_LIST_SUCCESS":
      return {
        loading: false,
        pricings: action.payload
      };

    case "ADDON_PRICING_LIST_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }

};

export default AdminAddOnPricingReducer;
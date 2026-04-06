export const AdminAuditoriumPricingReducer = (
  state = { pricing: [], auditoriums: [] },
  action
) => {
  switch (action.type) {
    case "AUDITORIUM_PRICING_REQUEST":
      return { loading: true, pricing: [] };

    case "AUDITORIUM_PRICING_SUCCESS":
      return { loading: false, pricing: action.payload };

    case "AUDITORIUM_PRICING_FAIL":
      return { loading: false, error: action.payload, pricing: [] };

    case "AUDITORIUM_LIST_DROPDOWN":
      return { ...state, auditoriums: action.payload };

    default:
      return state;
  }
};
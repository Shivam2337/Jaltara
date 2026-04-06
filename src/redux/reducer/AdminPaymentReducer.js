const initialState = {
  payments: [],
  loading: false,
  error: null,
};

const AdminPaymentReducer = (state = initialState, action) => {
  switch (action.type) {

    case "PAYMENT_LIST_REQUEST":
      return { ...state, loading: true, error: null };

    case "PAYMENT_LIST_SUCCESS":
      return { ...state, loading: false, payments: action.payload };

    case "PAYMENT_LIST_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default AdminPaymentReducer;
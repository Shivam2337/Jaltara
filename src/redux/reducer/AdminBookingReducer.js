const initialState = {
  bookings: [],
  loading: false,
  error: null,
};

const AdminBookingReducer = (state = initialState, action) => {
  switch (action.type) {

    case "BOOKING_LIST_REQUEST":
      return { ...state, loading: true, error: null };

    case "BOOKING_LIST_SUCCESS":
      return { ...state, loading: false, bookings: action.payload };

    case "BOOKING_LIST_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default AdminBookingReducer;
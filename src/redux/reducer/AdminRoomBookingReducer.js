const initialState = {
  loading: false,
  bookings: [],
  error: null
};

const AdminRoomBookingReducer = (state = initialState, action) => {

  switch (action.type) {

    case "BOOKING_REQUEST":
      return {
        ...state,
        loading: true
      };

    case "BOOKING_SUCCESS":
      return {
        loading: false,
        bookings: action.payload,
        error: null
      };

    case "BOOKING_FAIL":
      return {
        loading: false,
        bookings: [],
        error: action.payload
      };

    default:
      return state;

  }

};

export default AdminRoomBookingReducer;
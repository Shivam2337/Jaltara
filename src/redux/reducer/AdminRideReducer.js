const initialState = {
  rides: [],
  loading: false,
  error: null,
};

const AdminRideReducer = (state = initialState, action) => {
  switch (action.type) {

    case "RIDE_LIST_REQUEST":
      return { ...state, loading: true };

    case "RIDE_LIST_SUCCESS":
      return {
        ...state,
        loading: false,
        rides: action.payload,
      };

    case "RIDE_LIST_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "RIDE_ADD_SUCCESS":
      return {
        ...state,
        rides: [...state.rides, action.payload],
      };

    case "RIDE_ADD_FAIL":
      return {
        ...state,
        error: action.payload,
      };

    case "RIDE_EDIT_SUCCESS":
      return {
        ...state,
        rides: state.rides.map((ride) =>
          ride.id === action.payload.id ? action.payload : ride
        )
      };

    case "RIDE_DELETE_SUCCESS":
      return {
        ...state,
        rides: state.rides.filter((ride) => ride.id !== action.payload)
      };

    case "RIDE_ADD_IMAGE_LOCAL":
    return {
      ...state,
      rides: state.rides.map((ride) =>
        ride.id === action.payload.rideId
          ? {
              ...ride,
              images: [...(ride.images || []), action.payload.image],
            }
          : ride
      ),
    };

    default:
      return state;
  }
};

export default AdminRideReducer;
const initialState = {
  amenities: [],
  loading: false,
};

const AdminAmenitiesReducer = (state = initialState, action) => {
  switch (action.type) {

    case "AMENITY_LIST_REQUEST":
      return { ...state, loading: true };

    case "AMENITY_LIST_SUCCESS":
      return {
        loading: false,
        amenities: action.payload,
      };

    case "AMENITY_LIST_FAIL":
      return { loading: false };

    default:
      return state;
  }
};

export default AdminAmenitiesReducer;
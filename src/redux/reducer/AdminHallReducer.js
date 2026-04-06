const initialState = {
  // Hall Page
  halls: [],
  hallLoading: false,
  hallError: null,

  // Hall Gallery
  gallery: [],
  galleryLoading: false,
  galleryError: null,

  // Hall Features
  features: [],
  featureLoading: false,
  featureError: null,
};

const AdminHallReducer = (state = initialState, action) => {
  switch (action.type) {

    // ========================
    // HALL PAGE
    // ========================
    case "HALL_LIST_REQUEST":
      return { ...state, hallLoading: true, hallError: null };

    case "HALL_LIST_SUCCESS":
      return { ...state, hallLoading: false, halls: action.payload };

    case "HALL_LIST_FAIL":
      return { ...state, hallLoading: false, hallError: action.payload };

    case "HALL_CREATE_SUCCESS":
    case "HALL_UPDATE_SUCCESS":
      return { ...state };

    case "HALL_DELETE_SUCCESS":
      return {
        ...state,
        halls: state.halls.filter((h) => h.id !== action.payload),
      };

    // ========================
    // HALL GALLERY
    // ========================
    case "HALL_GALLERY_LIST_REQUEST":
      return { ...state, galleryLoading: true, galleryError: null };

    case "HALL_GALLERY_LIST_SUCCESS":
      return { ...state, galleryLoading: false, gallery: action.payload };

    case "HALL_GALLERY_LIST_FAIL":
      return { ...state, galleryLoading: false, galleryError: action.payload };

    // ========================
    // HALL FEATURES
    // ========================
    case "HALL_FEATURE_LIST_REQUEST":
      return { ...state, featureLoading: true, featureError: null };

    case "HALL_FEATURE_LIST_SUCCESS":
      return { ...state, featureLoading: false, features: action.payload };

    case "HALL_FEATURE_LIST_FAIL":
      return { ...state, featureLoading: false, featureError: action.payload };

    default:
      return state;
  }
};

export default AdminHallReducer;
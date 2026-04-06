const initialState = {
  categories: [],
  images: [],
  loading: false,
  error: null,
};

export const AdminGallaryReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GALLARY_CATEGORY_LIST_REQUEST":
      return {
        ...state,
        loading: true,
      };

    case "GALLARY_CATEGORY_LIST_SUCCESS":
      return {
        ...state,
        loading: false,
        categories: action.payload,
      };

    case "GALLARY_CATEGORY_LIST_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "GALLARY_CATEGORY_CREATE_REQUEST":
      return {
        ...state,
        loading: true,
      };

    case "GALLARY_CATEGORY_CREATE_SUCCESS":
      return {
        ...state,
        loading: false,
        categories: [...state.categories, action.payload],
      };

    case "GALLARY_CATEGORY_CREATE_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "GALLARY_CATEGORY_UPDATE_REQUEST":
      return {
        ...state,
        loading: true,
      };

    case "GALLARY_CATEGORY_UPDATE_SUCCESS":
      return {
        ...state,
        loading: false,
        categories: state.categories.map((c) =>
          c.id === action.payload.id ? action.payload : c
        ),
      };

    case "GALLARY_CATEGORY_UPDATE_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "GALLARY_IMAGE_LIST_REQUEST":
      return {
        ...state,
        loading: true,
      };

    case "GALLARY_IMAGE_LIST_SUCCESS":
      return {
        ...state,
        loading: false,
        images: action.payload,
      };

    case "GALLARY_IMAGE_LIST_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "GALLARY_IMAGE_CREATE_REQUEST":
      return {
        ...state,
        loading: true,
      };

    case "GALLARY_IMAGE_CREATE_SUCCESS":
      return {
        ...state,
        loading: false,
        images: [...state.images, action.payload],
      };

    case "GALLARY_IMAGE_CREATE_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "GALLARY_IMAGE_UPDATE_REQUEST":
      return {
        ...state,
        loading: true,
      };

    case "GALLARY_IMAGE_UPDATE_SUCCESS":
      return {
        ...state,
        loading: false,
        images: state.images.map((img) =>
          img.id === action.payload.id ? action.payload : img
        ),
      };

    case "GALLARY_IMAGE_UPDATE_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

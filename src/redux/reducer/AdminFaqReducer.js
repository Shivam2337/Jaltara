const initialState = {
  faqs: [],
  loading: false,
  error: null,
};

export const AdminFaqReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FAQ_GET_REQUEST":
      return {
        ...state,
        loading: true,
      };

    case "FAQ_GET_SUCCESS":
      return {
        ...state,
        loading: false,
        faqs: action.payload,
      };

    case "FAQ_GET_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "FAQ_CREATE_REQUEST":
      return {
        ...state,
        loading: true,
      };

    case "FAQ_CREATE_SUCCESS":
      return {
        ...state,
        loading: false,
        faqs: [...state.faqs, action.payload],
      };

    case "FAQ_CREATE_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "FAQ_UPDATE_REQUEST":
      return {
        ...state,
        loading: true,
      };

    case "FAQ_UPDATE_SUCCESS":
      return {
        ...state,
        loading: false,
        faqs: state.faqs.map((faq) =>
          faq.id === action.payload.id ? action.payload : faq
        ),
      };

    case "FAQ_UPDATE_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

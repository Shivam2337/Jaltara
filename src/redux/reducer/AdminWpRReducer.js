export const AdminWpRReducer = (state = { sections: [] }, action) => {
  switch (action.type) {
    // ======================
    // LIST
    // ======================
    case "WPR_SECTION_LIST_REQUEST":
      return { ...state, loading: true };

    case "WPR_SECTION_LIST_SUCCESS":
      return {
        loading: false,
        sections: action.payload,
        error: null,
      };

    case "WPR_SECTION_LIST_FAIL":
      return {
        loading: false,
        error: action.payload,
      };

    // ======================
    // CREATE
    // ======================
    case "WPR_SECTION_CREATE_REQUEST":
      return { ...state, loading: true, success: false };

    case "WPR_SECTION_CREATE_SUCCESS":
      return {
        loading: false,
        success: true,
        sections: [...state.sections, action.payload],
      };

    case "WPR_SECTION_CREATE_FAIL":
      return {
        loading: false,
        error: action.payload,
        success: false,
      };

    // ======================
    // UPDATE
    // ======================
    case "WPR_SECTION_UPDATE_REQUEST":
      return {
        ...state,
        updating: { ...state.updating, [action.payload]: true },
        success: false,
      };

    case "WPR_SECTION_UPDATE_SUCCESS":
      return {
        ...state,
        success: true,
        updating: { ...state.updating, [action.payload.id]: false },
        sections: state.sections.map((s) =>
          s.id === action.payload.id ? action.payload : s
        ),
      };

    case "WPR_SECTION_UPDATE_FAIL":
      return {
        ...state,
        error: action.payload,
        success: false,
        updating: { ...state.updating, [action.payload]: false },
      };

    default:
      return state;
  }
};

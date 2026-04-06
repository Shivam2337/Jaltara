export const AdminTestimonialReducer = (
  state = { testimonials: [] },
  action
) => {
  switch (action.type) {
    case "TESTIMONIAL_LIST_REQUEST":
      return { ...state, loading: true };

    case "TESTIMONIAL_LIST_SUCCESS":
      return {
        loading: false,
        testimonials: action.payload,
      };

    case "TESTIMONIAL_LIST_FAIL":
      return {
        loading: false,
        error: action.payload,
      };

      case "TESTIMONIAL_APPROVE_REQUEST":
      return {
        ...state,
        approving: { ...state.approving, [action.payload]: true },
      };
    case "TESTIMONIAL_APPROVE_SUCCESS":
      return {
        ...state,
        approving: { ...state.approving, [action.payload]: false },
        testimonials: state.testimonials.map((t) =>
          t.id === action.payload ? { ...t, is_approved: true } : t
        ),
      };
    case "TESTIMONIAL_APPROVE_FAIL":
      return {
        ...state,
        approving: { ...state.approving, [action.payload]: false },
      };


    default:
      return state;
  }
};
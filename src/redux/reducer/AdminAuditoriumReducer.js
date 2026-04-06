export const AdminAuditoriumReducer = (
  state = { auditoriums: [] },
  action
) => {
  switch (action.type) {
    case "AUDITORIUM_LIST_REQUEST":
      return { loading: true, auditoriums: [] };

    case "AUDITORIUM_LIST_SUCCESS":
      return { loading: false, auditoriums: action.payload };

    case "AUDITORIUM_LIST_FAIL":
      return { loading: false, error: action.payload, auditoriums: [] };

    default:
      return state;
  }
};
export const AdminContactReducer = (state = { contacts: [] }, action) => {
  switch (action.type) {
    case "ADMIN_CONTACT_REQUEST":
      return { loading: true, contacts: [] };

    case "ADMIN_CONTACT_SUCCESS":
      return { loading: false, contacts: action.payload };

    case "ADMIN_CONTACT_FAIL":
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};
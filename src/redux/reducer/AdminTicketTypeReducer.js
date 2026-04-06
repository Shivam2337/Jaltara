const initialState = {
  ticketTypes: [],
  loading: false,
  error: null,
};

const AdminTicketTypeReducer = (state = initialState, action) => {

  switch (action.type) {

    case "TICKET_TYPE_REQUEST":
      return { ...state, loading: true };

    case "TICKET_TYPE_SUCCESS":
      return {
        loading: false,
        ticketTypes: action.payload
      };

    case "TICKET_TYPE_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;

  }

};

export default AdminTicketTypeReducer;
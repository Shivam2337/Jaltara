export const AdminTicketPricingReducer = (state = { ticketPricing: [], loading: false, error: null }, action) => {

switch (action.type) {

case "TICKET_PRICING_LIST_REQUEST":
return { ...state, loading: true };

case "TICKET_PRICING_LIST_SUCCESS":
return { loading: false, ticketPricing: action.payload };

case "TICKET_PRICING_LIST_FAIL":
return { ...state, loading: false, error: action.payload };

default:
return state;

}

};
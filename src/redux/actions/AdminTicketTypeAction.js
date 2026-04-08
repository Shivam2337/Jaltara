import AdminAPI from "../../BaseAPI/AdminAPI";
import { toast } from "react-toastify";

/* GET TICKETS */

export const getTicketTypesAction = () => async (dispatch) => {

  try {

    dispatch({ type: "TICKET_TYPE_REQUEST" });

    const { data } = await AdminAPI.get("catalog/admin/ticket-types/");

    dispatch({
      type: "TICKET_TYPE_SUCCESS",
      payload: data
    });

  } catch (error) {

    dispatch({
      type: "TICKET_TYPE_FAIL",
      payload: error.message
    });

  }

};

/* CREATE */
export const createTicketTypeAction = (ticket) => async (dispatch) => {
  try {
    await AdminAPI.post("catalog/admin/ticket-types/", ticket);
    dispatch(getTicketTypesAction());
    toast.success("Ticket type created successfully!");
  } catch (error) {
    dispatch({ type: "TICKET_TYPE_FAIL", payload: error.message });
    toast.error("Failed to create ticket type.");
  }
};

/* UPDATE */
export const updateTicketTypeAction = (id, ticket) => async (dispatch) => {
  try {
    await AdminAPI.put(`catalog/admin/ticket-types/${id}/`, ticket);
    dispatch(getTicketTypesAction());
    toast.success("Ticket type updated successfully!");
  } catch (error) {
    dispatch({ type: "TICKET_TYPE_FAIL", payload: error.message });
    toast.error("Failed to update ticket type.");
  }
};

/* DELETE */
export const deleteTicketTypeAction = (id) => async (dispatch) => {
  try {
    await AdminAPI.delete(`catalog/admin/ticket-types/${id}/`);
    dispatch(getTicketTypesAction());
    toast.success("Ticket type deleted successfully!");
  } catch (error) {
    dispatch({ type: "TICKET_TYPE_FAIL", payload: error.message });
    dispatch(getTicketTypesAction());
    toast.error("Failed to delete ticket type.");
  }
};
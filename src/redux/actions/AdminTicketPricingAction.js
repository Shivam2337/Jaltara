import AdminAPI from "../../BaseAPI/AdminAPI";
import { toast } from "react-toastify";

export const getTicketPricingAction = () => async (dispatch) => {
  dispatch({ type: "TICKET_PRICING_LIST_REQUEST" });
  try {
    const { data } = await AdminAPI.get("catalog/admin/ticket-pricing/");
    dispatch({ type: "TICKET_PRICING_LIST_SUCCESS", payload: data });
  } catch (err) {
    console.error("❌ GET error:", err.response?.data);
  }
};

export const createTicketPricingAction = (formData) => async (dispatch) => {
  try {
    const { data } = await AdminAPI.post("catalog/admin/ticket-pricing/", formData);
    dispatch(getTicketPricingAction());
    toast.success("Ticket pricing created successfully!");
  } catch (err) {
    console.error("❌ CREATE error:", err.response?.data);
    toast.error("Failed to create ticket pricing.");
  }
};

export const updateTicketPricingAction = (id, formData) => async (dispatch) => {
  try {
    const { data } = await AdminAPI.put(`catalog/admin/ticket-pricing/${id}/`, formData);
    dispatch(getTicketPricingAction());
    toast.success("Ticket pricing updated successfully!");
  } catch (err) {
    console.error("❌ UPDATE error:", err.response?.data);
    toast.error("Failed to update ticket pricing.");
  }
};

export const deleteTicketPricingAction = (id) => async (dispatch) => {
  try {
    await AdminAPI.delete(`catalog/admin/ticket-pricing/${id}/`);
    dispatch(getTicketPricingAction());
    toast.success("Ticket pricing deleted successfully!");
  } catch (err) {
    console.error("❌ DELETE error:", err.response?.data);
    toast.error("Failed to delete ticket pricing.");
  }
};
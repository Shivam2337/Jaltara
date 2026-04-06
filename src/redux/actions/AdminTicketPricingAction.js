import AdminAPI from "../../BaseAPI/AdminAPI";

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
    console.log("📤 CREATE payload:", formData);
    const { data } = await AdminAPI.post("catalog/admin/ticket-pricing/", formData);
    console.log("✅ CREATE success:", data);
    dispatch(getTicketPricingAction());
  } catch (err) {
    console.error("❌ CREATE error status:", err.response?.status);
    console.error("❌ CREATE error detail:", err.response?.data);
  }
};

export const updateTicketPricingAction = (id, formData) => async (dispatch) => {
  try {
    console.log("📤 UPDATE payload:", JSON.stringify(formData)); // ✅ see full payload
    const { data } = await AdminAPI.put(`catalog/admin/ticket-pricing/${id}/`, formData);
    console.log("✅ UPDATE success:", data);
    dispatch(getTicketPricingAction());
  } catch (err) {
    console.error("❌ UPDATE error status:", err.response?.status);
    console.error("❌ UPDATE error detail:", JSON.stringify(err.response?.data)); // ✅ see full error
  }
};

export const deleteTicketPricingAction = (id) => async (dispatch) => {
  try {
    await AdminAPI.delete(`catalog/admin/ticket-pricing/${id}/`);
    dispatch(getTicketPricingAction());
  } catch (err) {
    console.error("❌ DELETE error:", err.response?.data);
  }
};
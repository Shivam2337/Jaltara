import AdminAPI from "../../BaseAPI/AdminAPI";

// Fetch pricing
export const getPricingAction = () => async (dispatch) => {
  try {
    console.log("Fetching ride pricing...");
    dispatch({ type: "PRICING_REQUEST" });
    const { data } = await AdminAPI.get("catalog/admin/ride-pricing/");
    console.log("Pricing fetched:", data);
    dispatch({ type: "PRICING_SUCCESS", payload: data });
  } catch (error) {
    console.error("Error fetching pricing:", error.response || error.message);
    dispatch({ type: "PRICING_FAIL", payload: error.message });
  }
};

// Add pricing
export const addPricingAction = (pricing) => async (dispatch) => {
  try {
    console.log("Adding pricing:", pricing);
    const { data } = await AdminAPI.post("catalog/admin/ride-pricing/", pricing);
    console.log("Pricing added:", data);
    dispatch({ type: "PRICING_ADD_SUCCESS", payload: data });
  } catch (error) {
    console.error("Error adding pricing:", error.response || error.message);
    dispatch({ type: "PRICING_FAIL", payload: error.message });
  }
};

// Delete pricing
export const deletePricingAction = (id) => async (dispatch) => {
  try {
    console.log("Deleting pricing with ID:", id);
    await AdminAPI.delete(`catalog/admin/ride-pricing/${id}/`);
    console.log("Pricing deleted:", id);
    dispatch({ type: "PRICING_DELETE_SUCCESS", payload: id });
  } catch (error) {
    console.error("Error deleting pricing:", error.response || error.message);
    dispatch({ type: "PRICING_FAIL", payload: error.message });
  }
};

// Edit pricing
export const editPricingAction = (id, updatedData) => async (dispatch) => {
  try {
    console.log("Editing pricing ID:", id, "with data:", updatedData);
    const { data } = await AdminAPI.put(`catalog/admin/ride-pricing/${id}/`, updatedData);
    console.log("Pricing edited:", data);
    dispatch({ type: 'EDIT_PRICING_SUCCESS', payload: data });
  } catch (error) {
    console.error("Error editing pricing:", error.response || error.message);
    dispatch({ type: 'EDIT_PRICING_FAIL', payload: error.response?.data || error.message });
  }
};
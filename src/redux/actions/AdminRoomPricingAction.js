// redux/actions/AdminRoomPricingAction.js
import AdminAPI from "../../BaseAPI/AdminAPI";
import { toast } from "react-toastify";

/* ================= GET PRICING ================= */
export const getPricingAction = () => async (dispatch) => {
  console.log("===== GET PRICING ACTION CALLED =====");

  dispatch({ type: "PRICING_REQUEST" });
  console.log("Dispatch PRICING_REQUEST");

  try {
    const response = await AdminAPI.get("catalog/admin/room-pricing/");
    console.log("✅ PRICING RESPONSE STATUS:", response.status);
    console.log("✅ PRICING RESPONSE DATA:", response.data);

    dispatch({
      type: "PRICING_SUCCESS",
      payload: response.data
    });
    console.log("Dispatch PRICING_SUCCESS with payload length:", response.data?.length);

  } catch (error) {
    console.error("❌ GET PRICING ERROR:", error.response || error.message);

    dispatch({
      type: "PRICING_FAIL",
      payload: error.response?.data || "Failed to load pricing"
    });
  }
};

/* ================= ADD PRICING ================= */
export const addPricingAction = (formData) => async (dispatch) => {
  try {
    const payload = {
      ...formData,
      category: parseInt(formData.category),
      base_price: parseFloat(formData.base_price),
      extra_adult_price: parseFloat(formData.extra_adult_price || 0),
      extra_child_price: parseFloat(formData.extra_child_price || 0),
      seasonal_discount_percent: parseFloat(formData.seasonal_discount_percent || 0),
      is_weekend: Boolean(formData.is_weekend)
    };
    await AdminAPI.post("catalog/admin/room-pricing/", payload);
    dispatch(getPricingAction());
    toast.success("Pricing added successfully!");
  } catch (error) {
    console.error("❌ ADD PRICING ERROR:", error.response || error.message);
    toast.error("Failed to add pricing.");
  }
};

/* ================= EDIT PRICING ================= */
export const editPricingAction = (id, formData) => async (dispatch) => {
  try {
    const payload = {
      ...formData,
      category: parseInt(formData.category),
      base_price: parseFloat(formData.base_price),
      extra_adult_price: parseFloat(formData.extra_adult_price || 0),
      extra_child_price: parseFloat(formData.extra_child_price || 0),
      seasonal_discount_percent: parseFloat(formData.seasonal_discount_percent || 0),
      is_weekend: Boolean(formData.is_weekend)
    };
    await AdminAPI.put(`catalog/admin/room-pricing/${id}/`, payload);
    dispatch(getPricingAction());
    toast.success("Pricing updated successfully!");
  } catch (error) {
    console.error("❌ EDIT PRICING ERROR:", error.response || error.message);
    toast.error("Failed to update pricing.");
  }
};

/* ================= DELETE PRICING ================= */
export const deletePricingAction = (id) => async (dispatch) => {
  try {
    await AdminAPI.delete(`catalog/admin/room-pricing/${id}/`);
    dispatch(getPricingAction());
    toast.success("Pricing deleted successfully!");
  } catch (error) {
    console.error("❌ DELETE PRICING ERROR:", error.response || error.message);
    toast.error("Failed to delete pricing.");
  }
};

/* ================= REDUCER ================= */
const initialState = {
  loading: false,
  pricing: [],
  error: null
};

export const AdminRoomPricingReducer = (state = initialState, action) => {
  switch (action.type) {

    case "PRICING_REQUEST":
      console.log("Reducer: PRICING_REQUEST");
      return { ...state, loading: true };

    case "PRICING_SUCCESS":
      console.log("Reducer: PRICING_SUCCESS, payload length:", action.payload?.length);
      return { loading: false, pricing: action.payload, error: null };

    case "PRICING_FAIL":
      console.error("Reducer: PRICING_FAIL, error:", action.payload);
      return { loading: false, pricing: [], error: action.payload };

    default:
      return state;
  }
};
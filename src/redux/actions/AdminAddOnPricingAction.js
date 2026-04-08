import AdminAPI from "../../BaseAPI/AdminAPI";
import { toast } from "react-toastify";

/* GET PRICING */
export const getAddOnPricingAction = () => async (dispatch) => {
  try {
    dispatch({ type: "ADDON_PRICING_LIST_REQUEST" });

    const { data } = await AdminAPI.get("catalog/admin/addon-pricing/");

    dispatch({
      type: "ADDON_PRICING_LIST_SUCCESS",
      payload: data,
    });

  } catch (error) {
    dispatch({
      type: "ADDON_PRICING_LIST_FAIL",
      payload: error.response?.data?.detail || error.message,
    });
  }
};

/* CREATE */
export const createAddOnPricingAction = (pricing) => async (dispatch) => {
  try {
    await AdminAPI.post("catalog/admin/addon-pricing/", pricing);
    dispatch(getAddOnPricingAction());
    toast.success("Add-on pricing created successfully!");
  } catch (error) {
    console.log(error);
    toast.error("Failed to create add-on pricing.");
  }
};

/* UPDATE */
export const updateAddOnPricingAction = (id, pricing) => async (dispatch) => {
  try {
    await AdminAPI.put(`catalog/admin/addon-pricing/${id}/`, pricing);
    dispatch(getAddOnPricingAction());
    toast.success("Add-on pricing updated successfully!");
  } catch (error) {
    console.log(error);
    toast.error("Failed to update add-on pricing.");
  }
};

/* DELETE */
export const deleteAddOnPricingAction = (id) => async (dispatch) => {
  try {
    await AdminAPI.delete(`catalog/admin/addon-pricing/${id}/`);
    dispatch(getAddOnPricingAction());
    toast.success("Add-on pricing deleted successfully!");
  } catch (error) {
    console.log(error);
    toast.error("Failed to delete add-on pricing.");
  }
};
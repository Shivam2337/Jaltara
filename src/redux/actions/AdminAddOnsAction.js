import AdminAPI from "../../BaseAPI/AdminAPI";
import { toast } from "react-toastify";

/* GET ADDONS */
export const getAddOnsAction = () => async (dispatch) => {
  try {
    dispatch({ type: "ADDON_LIST_REQUEST" });

    const { data } = await AdminAPI.get("catalog/admin/addons/");

    dispatch({
      type: "ADDON_LIST_SUCCESS",
      payload: data,
    });

  } catch (error) {
    dispatch({
      type: "ADDON_LIST_FAIL",
      payload: error.response?.data?.detail || error.message,
    });
  }
};

/* CREATE ADDON */
export const createAddOnAction = (addon) => async (dispatch) => {
  try {
    const { data } = await AdminAPI.post("catalog/admin/addons/", addon);
    dispatch({ type: "ADDON_CREATE_SUCCESS", payload: data });
    dispatch(getAddOnsAction());
    toast.success("Add-on created successfully!");
  } catch (error) {
    console.log(error);
    toast.error("Failed to create add-on.");
  }
};

/* UPDATE ADDON */
export const updateAddOnAction = (id, addon) => async (dispatch) => {
  try {
    const { data } = await AdminAPI.put(`catalog/admin/addons/${id}/`, addon);
    dispatch({ type: "ADDON_UPDATE_SUCCESS", payload: data });
    dispatch(getAddOnsAction());
    toast.success("Add-on updated successfully!");
  } catch (error) {
    console.log(error);
    toast.error("Failed to update add-on.");
  }
};

/* DELETE ADDON */
export const deleteAddOnAction = (id) => async (dispatch) => {
  try {
    await AdminAPI.delete(`catalog/admin/addons/${id}/`);
    dispatch({ type: "ADDON_DELETE_SUCCESS" });
    dispatch(getAddOnsAction());
    toast.success("Add-on deleted successfully!");
  } catch (error) {
    console.log(error);
    toast.error("Failed to delete add-on.");
  }
};
import AdminAPI from "../../BaseAPI/AdminAPI";
import { toast } from "react-toastify";

export const getPackageItems = () => async (dispatch) => {

  dispatch({ type: "PACKAGE_ITEM_LIST_REQUEST" });

  try {

    const response = await AdminAPI.get("catalog/admin/packages-items/");

    dispatch({
      type: "PACKAGE_ITEM_LIST_SUCCESS",
      payload: response.data
    });

  } catch (error) {

    dispatch({
      type: "PACKAGE_ITEM_LIST_FAIL",
      payload: error.response?.data || "Error"
    });

  }

};



export const createPackageItem = (data) => async (dispatch) => {
  dispatch({ type: "PACKAGE_ITEM_CREATE_REQUEST" });
  try {
    const response = await AdminAPI.post("catalog/admin/packages-items/", data);
    dispatch({ type: "PACKAGE_ITEM_CREATE_SUCCESS", payload: response.data });
    toast.success("Package item added successfully!");
  } catch (error) {
    dispatch(getPackageItems());
    dispatch({ type: "PACKAGE_ITEM_CREATE_FAIL", payload: error.response?.data || "Error" });
    toast.error("Failed to add package item.");
  }
};

/* ============================= */
/* UPDATE PACKAGE ITEM */
/* ============================= */

export const updatePackageItem = (id, data) => async (dispatch) => {
  dispatch({ type: "PACKAGE_ITEM_UPDATE_REQUEST" });
  try {
    const response = await AdminAPI.put(`catalog/admin/packages-items/${id}/`, data);
    dispatch({ type: "PACKAGE_ITEM_UPDATE_SUCCESS", payload: response.data });
    dispatch(getPackageItems());
    toast.success("Package item updated successfully!");
  } catch (error) {
    dispatch(getPackageItems());
    dispatch({ type: "PACKAGE_ITEM_UPDATE_FAIL", payload: error.response?.data || "Error updating package item" });
    toast.error("Failed to update package item.");
  }
};



/* ============================= */
/* DELETE PACKAGE ITEM */
/* ============================= */

export const deletePackageItem = (id) => async (dispatch) => {
  dispatch({ type: "PACKAGE_ITEM_DELETE_REQUEST" });
  try {
    await AdminAPI.delete(`catalog/admin/packages-items/${id}/`);
    dispatch({ type: "PACKAGE_ITEM_DELETE_SUCCESS", payload: id });
    dispatch(getPackageItems());
    toast.success("Package item deleted successfully!");
  } catch (error) {
    dispatch({ type: "PACKAGE_ITEM_DELETE_FAIL", payload: error.response?.data || "Error deleting package item" });
    toast.error("Failed to delete package item.");
  }
};
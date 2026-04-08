import AdminAPI from "../../BaseAPI/AdminAPI";
import { toast } from "react-toastify";


// GET
export const getPackageAction = () => async (dispatch) => {
  try {
    dispatch({ type: "PACKAGE_LIST_REQUEST" });

    const res = await AdminAPI.get("catalog/admin/packages/");

    dispatch({
      type: "PACKAGE_LIST_SUCCESS",
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: "PACKAGE_LIST_FAIL",
      payload: error,
    });
  }
};

// ADD
export const addPackageAction = (data) => async (dispatch) => {
  try {
    const response = await AdminAPI.post("catalog/admin/packages/", data);
    dispatch({ type: "ADD_PACKAGE_SUCCESS", payload: response.data });
    toast.success("Package added successfully!");
    return response.data;
  } catch (error) {
    console.log(error);
    toast.error("Failed to add package.");
    throw error;
  }
};

// Edit Package
export const editPackageAction = (id, data) => async (dispatch) => {
  try {
    const response = await AdminAPI.put(`catalog/admin/packages/${id}/`, data);
    dispatch({ type: "EDIT_PACKAGE_SUCCESS", payload: response.data });
    toast.success("Package updated successfully!");
    return response.data;
  } catch (error) {
    console.log(error);
    toast.error("Failed to update package.");
    throw error;
  }
};

// DELETE
export const deletePackageAction = (id) => async (dispatch) => {
  try {
    await AdminAPI.delete(`catalog/admin/packages/${id}/`);
    dispatch(getPackageAction());
    toast.success("Package deleted successfully!");
  } catch (error) {
    console.log(error);
    toast.error("Failed to delete package.");
  }
};
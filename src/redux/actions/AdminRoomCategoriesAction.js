import AdminAPI from "../../BaseAPI/AdminAPI";
import { toast } from "react-toastify";

/* ================= GET CATEGORIES ================= */
export const getCategoriesAction = () => async (dispatch) => {
  try {
    dispatch({ type: "CATEGORY_LIST_REQUEST" });

    const { data } = await AdminAPI.get("catalog/admin/room-categories/");

    dispatch({
      type: "CATEGORY_LIST_SUCCESS",
      payload: data.results || data.data || data,
    });
  } catch (error) {
    dispatch({
      type: "CATEGORY_LIST_FAIL",
      payload: error.response?.data || error.message,
    });
  }
};

/* ================= ADD CATEGORY ================= */
export const addCategoryAction = (payload) => async (dispatch) => {
  try {
    const { data } = await AdminAPI.post("catalog/admin/room-categories/", payload);
    dispatch(getCategoriesAction());
    return data;
  } catch (error) {
    console.log("ADD CATEGORY ERROR:", error.response?.data);
    throw error;
  }
};

/* ================= EDIT CATEGORY ================= */
export const editCategoryAction = (id, formData) => async (dispatch) => {
  try {
    const response = await AdminAPI.put(`catalog/admin/room-categories/${id}/`, formData);
    dispatch({ type: "EDIT_CATEGORY_SUCCESS", payload: response.data });
    return response.data;
  } catch (err) {
    console.error("❌ UPDATE error:", err.response?.data);
    throw err;
  }
};

/* ================= DELETE CATEGORY ================= */
export const deleteCategoryAction = (id) => async (dispatch) => {
  try {
    await AdminAPI.delete(`catalog/admin/room-categories/${id}/`);
    dispatch(getCategoriesAction());
    toast.success("Category deleted successfully!");
  } catch (error) {
    console.log("DELETE CATEGORY ERROR:", error.response?.data);
    toast.error("Failed to delete category.");
  }
};
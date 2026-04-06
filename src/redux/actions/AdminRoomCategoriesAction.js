import AdminAPI from "../../BaseAPI/AdminAPI";

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
    await AdminAPI.post("catalog/admin/room-categories/", payload);
    dispatch(getCategoriesAction());
  } catch (error) {
    console.log("ADD CATEGORY ERROR:", error.response?.data);
  }
};

/* ================= EDIT CATEGORY ================= */
export const editCategoryAction = (id, formData) => async (dispatch) => {
  try {
    console.log("📤 UPDATE payload:", JSON.stringify(formData)); // ✅ see what's being sent
    const response = await AdminAPI.put(`catalog/admin/room-categories/${id}/`, formData);
    console.log("✅ UPDATE success:", response.data);
    dispatch({ type: "EDIT_CATEGORY_SUCCESS", payload: response.data });
    return response.data;
  } catch (err) {
    console.error("❌ UPDATE error status:", err.response?.status);
    console.error("❌ UPDATE error detail:", JSON.stringify(err.response?.data)); // ✅ exact error
  }
};

/* ================= DELETE CATEGORY ================= */
export const deleteCategoryAction = (id) => async (dispatch) => {
  try {
    await AdminAPI.delete(`catalog/admin/room-categories/${id}/`);

    dispatch(getCategoriesAction());
  } catch (error) {
    console.log("DELETE CATEGORY ERROR:", error.response?.data);
  }
};
import AdminAPI from "../../BaseAPI/AdminAPI";

/* ===============================
   GET ALL PACKAGE PRICING
================================ */
export const getPackagePricing = () => async (dispatch) => {
  try {
    dispatch({ type: "PACKAGE_PRICING_LIST_REQUEST" });

    const response = await AdminAPI.get("catalog/admin/package-pricing/");

    dispatch({
      type: "PACKAGE_PRICING_LIST_SUCCESS",
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: "PACKAGE_PRICING_LIST_FAIL",
      payload: error.response?.data?.detail || error.message,
    });
  }
};

/* ===============================
   CREATE PACKAGE PRICING
================================ */
export const createPackagePricing = (data) => async (dispatch) => {
  try {
    dispatch({ type: "PACKAGE_PRICING_CREATE_REQUEST" });

    const response = await AdminAPI.post(
      "catalog/admin/package-pricing/",
      data
    );

    dispatch({
      type: "PACKAGE_PRICING_CREATE_SUCCESS",
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: "PACKAGE_PRICING_CREATE_FAIL",
      payload: error.response?.data || error.message,
    });
  }
};

/* ===============================
   UPDATE PACKAGE PRICING
================================ */
export const updatePackagePricing = (id, data) => async (dispatch) => {
  try {
    dispatch({ type: "PACKAGE_PRICING_UPDATE_REQUEST" });

    const response = await AdminAPI.put(
      `catalog/admin/package-pricing/${id}/`,
      data
    );

    dispatch({
      type: "PACKAGE_PRICING_UPDATE_SUCCESS",
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: "PACKAGE_PRICING_UPDATE_FAIL",
      payload: error.response?.data || error.message,
    });
  }
};

/* ===============================
   DELETE PACKAGE PRICING
================================ */
export const deletePackagePricing = (id) => async (dispatch) => {
  try {
    dispatch({ type: "PACKAGE_PRICING_DELETE_REQUEST" });

    await AdminAPI.delete(`catalog/admin/package-pricing/${id}/`);

    dispatch({
      type: "PACKAGE_PRICING_DELETE_SUCCESS",
      payload: id,
    });
  } catch (error) {
    dispatch({
      type: "PACKAGE_PRICING_DELETE_FAIL",
      payload: error.response?.data || error.message,
    });
  }
};
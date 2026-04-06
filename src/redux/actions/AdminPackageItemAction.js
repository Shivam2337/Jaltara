import AdminAPI from "../../BaseAPI/AdminAPI";

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

    const response = await AdminAPI.post(
      "catalog/admin/packages-items/",
      data
    );

    dispatch({
      type: "PACKAGE_ITEM_CREATE_SUCCESS",
      payload: response.data
    });

  } catch (error) {
      
    dispatch(getPackageItems()); // Refresh list on error to sync state
    dispatch({
      type: "PACKAGE_ITEM_CREATE_FAIL",
      payload: error.response?.data || "Error"
    });

  }

};

/* ============================= */
/* UPDATE PACKAGE ITEM */
/* ============================= */

export const updatePackageItem = (id, data) => async (dispatch) => {

  dispatch({ type: "PACKAGE_ITEM_UPDATE_REQUEST" });

  try {

    const response = await AdminAPI.put(
      `catalog/admin/packages-items/${id}/`,
      data
    );

    dispatch({
      type: "PACKAGE_ITEM_UPDATE_SUCCESS",
      payload: response.data
    });

    /* Refresh List */
    dispatch(getPackageItems());

  } catch (error) {
    dispatch(getPackageItems()); // Refresh list on error to sync state
    dispatch({
      type: "PACKAGE_ITEM_UPDATE_FAIL",
      payload: error.response?.data || "Error updating package item"
    });

  }

};



/* ============================= */
/* DELETE PACKAGE ITEM */
/* ============================= */

export const deletePackageItem = (id) => async (dispatch) => {

  dispatch({ type: "PACKAGE_ITEM_DELETE_REQUEST" });

  try {

    await AdminAPI.delete(
      `catalog/admin/packages-items/${id}/`
    );

    dispatch({
      type: "PACKAGE_ITEM_DELETE_SUCCESS",
      payload: id
    });

    /* Refresh List */
    dispatch(getPackageItems());

  } catch (error) {

    dispatch({
      type: "PACKAGE_ITEM_DELETE_FAIL",
      payload: error.response?.data || "Error deleting package item"
    });

  }

};
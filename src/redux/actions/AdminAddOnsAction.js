import AdminAPI from "../../BaseAPI/AdminAPI";

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

    dispatch({
      type: "ADDON_CREATE_SUCCESS",
      payload: data,
    });

    dispatch(getAddOnsAction());

  } catch (error) {
    console.log(error);
  }
};

/* UPDATE ADDON */
export const updateAddOnAction = (id, addon) => async (dispatch) => {
  try {

    const { data } = await AdminAPI.put(`catalog/admin/addons/${id}/`, addon);

    dispatch({
      type: "ADDON_UPDATE_SUCCESS",
      payload: data,
    });

    dispatch(getAddOnsAction());

  } catch (error) {
    console.log(error);
  }
};

/* DELETE ADDON */
export const deleteAddOnAction = (id) => async (dispatch) => {
  try {

    await AdminAPI.delete(`catalog/admin/addons/${id}/`);

    dispatch({
      type: "ADDON_DELETE_SUCCESS",
    });

    dispatch(getAddOnsAction());

  } catch (error) {
    console.log(error);
  }
};
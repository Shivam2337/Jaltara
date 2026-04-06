import AdminAPI from "../../BaseAPI/AdminAPI";


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

    dispatch({
      type: "ADD_PACKAGE_SUCCESS",
      payload: response.data,
    });

    return response.data;   // ⭐ VERY IMPORTANT

  } catch (error) {
    console.log(error);
  }
};

// Edit Package
export const editPackageAction = (id, data) => async (dispatch) => {

  try {

    const response = await AdminAPI.put(`catalog/admin/packages/${id}/`, data);

    dispatch({
      type: "EDIT_PACKAGE_SUCCESS",
      payload: response.data,
    });

    return response.data;   // ⭐ VERY IMPORTANT

  } catch (error) {
    console.log(error);
  }

};

// DELETE
export const deletePackageAction = (id) => async (dispatch) => {
  try {
    await AdminAPI.delete(`catalog/admin/packages/${id}/`);
    dispatch(getPackageAction());
  } catch (error) {
    console.log(error);
  }
};
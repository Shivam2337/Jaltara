import AdminAPI from "../../BaseAPI/AdminAPI";

/* GET */
export const getAuditoriums = () => async (dispatch) => {
  try {
    dispatch({ type: "AUDITORIUM_LIST_REQUEST" });

    const { data } = await AdminAPI.get("catalog/admin/auditoriums/");

    dispatch({
      type: "AUDITORIUM_LIST_SUCCESS",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "AUDITORIUM_LIST_FAIL",
      payload: error.response?.data?.detail || error.message,
    });
  }
};

/* CREATE */
export const createAuditorium = (formData) => async (dispatch) => {
  try {
    await AdminAPI.post("catalog/admin/auditoriums/", formData);
    dispatch(getAuditoriums());
  } catch (error) {
    console.log(error);
  }
};

/* UPDATE */
export const updateAuditorium = (id, formData) => async (dispatch) => {
  try {
    await AdminAPI.put(`catalog/admin/auditoriums/${id}/`, formData);
    dispatch(getAuditoriums());
  } catch (error) {
    console.log(error);
  }
};

/* DELETE */
export const deleteAuditorium = (id) => async (dispatch) => {
  try {
    await AdminAPI.delete(`catalog/admin/auditoriums/${id}/`);
    dispatch(getAuditoriums());
  } catch (error) {
    console.log(error);
  }
};
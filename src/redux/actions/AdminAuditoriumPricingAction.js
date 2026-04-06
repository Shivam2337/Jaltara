import AdminAPI from "../../BaseAPI/AdminAPI";

/* GET */
export const getAuditoriumPricing = () => async (dispatch) => {
  try {
    dispatch({ type: "AUDITORIUM_PRICING_REQUEST" });

    const { data } = await AdminAPI.get("catalog/admin/auditorium-pricing/");

    dispatch({
      type: "AUDITORIUM_PRICING_SUCCESS",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "AUDITORIUM_PRICING_FAIL",
      payload: error.response?.data?.detail || error.message,
    });
  }
};

/* CREATE */
export const createAuditoriumPricing = (formData) => async (dispatch) => {
  try {
    await AdminAPI.post("catalog/admin/auditorium-pricing/", formData);
    dispatch(getAuditoriumPricing());
  } catch (error) {
    alert("Error: " + JSON.stringify(error.response?.data));
  }
};

/* UPDATE */
export const updateAuditoriumPricing = (id, formData) => async (dispatch) => {
  try {
    await AdminAPI.put(
      `catalog/admin/auditorium-pricing/${id}/`,
      formData
    );
    dispatch(getAuditoriumPricing());
  } catch (error) {
    alert("Error: " + JSON.stringify(error.response?.data));
  }
};

/* DELETE */
export const deleteAuditoriumPricing = (id) => async (dispatch) => {
  try {
    await AdminAPI.delete(`catalog/admin/auditorium-pricing/${id}/`);
    dispatch(getAuditoriumPricing());
  } catch (error) {
    console.log(error);
  }
};

/* GET AUDITORIUM LIST (for dropdown) */
export const getAuditoriumsList = () => async (dispatch) => {
  try {
    const { data } = await AdminAPI.get("catalog/admin/auditoriums/");
    dispatch({
      type: "AUDITORIUM_LIST_DROPDOWN",
      payload: data,
    });
  } catch (error) {
    console.log(error);
  }
};
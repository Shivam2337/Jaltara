import AdminAPI from "../../BaseAPI/AdminAPI";

/* GET PRICING */
export const getAddOnPricingAction = () => async (dispatch) => {
  try {
    dispatch({ type: "ADDON_PRICING_LIST_REQUEST" });

    const { data } = await AdminAPI.get("catalog/admin/addon-pricing/");

    dispatch({
      type: "ADDON_PRICING_LIST_SUCCESS",
      payload: data,
    });

  } catch (error) {
    dispatch({
      type: "ADDON_PRICING_LIST_FAIL",
      payload: error.response?.data?.detail || error.message,
    });
  }
};

/* CREATE */
export const createAddOnPricingAction = (pricing) => async (dispatch) => {
  await AdminAPI.post("catalog/admin/addon-pricing/", pricing);
  dispatch(getAddOnPricingAction());
};

/* UPDATE */
export const updateAddOnPricingAction = (id, pricing) => async (dispatch) => {
  await AdminAPI.put(`catalog/admin/addon-pricing/${id}/`, pricing);
  dispatch(getAddOnPricingAction());
};

/* DELETE */
export const deleteAddOnPricingAction = (id) => async (dispatch) => {
  await AdminAPI.delete(`catalog/admin/addon-pricing/${id}/`);
  dispatch(getAddOnPricingAction());
};
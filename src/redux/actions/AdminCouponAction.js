import AdminAPI from "../../BaseAPI/AdminAPI";

/* READ */
export const getCouponAction = () => async (dispatch) => {
  try {
    dispatch({ type: "COUPON_LIST_REQUEST" });

    const { data } = await AdminAPI.get("catalog/admin/coupons/");

    dispatch({
      type: "COUPON_LIST_SUCCESS",
      payload: data
    });

  } catch (error) {
    dispatch({
      type: "COUPON_LIST_FAIL",
      payload: error.response?.data || error.message
    });
  }
};

/* CREATE */
export const createCouponAction = (formData) => async (dispatch) => {
  try {
    await AdminAPI.post("catalog/admin/coupons/", formData);
    dispatch(getCouponAction());
  } catch (error) {
    console.log(error);
  }
};

/* UPDATE */
export const updateCouponAction = (id, formData) => async (dispatch) => {
  try {
    await AdminAPI.put(`catalog/admin/coupons/${id}/`, formData);
    dispatch(getCouponAction());
  } catch (error) {
    console.log(error);
  }
};

/* DELETE */
export const deleteCouponAction = (id) => async (dispatch) => {
  try {
    await AdminAPI.delete(`catalog/admin/coupons/${id}/`);
    dispatch(getCouponAction());
  } catch (error) {
    console.log(error);
  }
};
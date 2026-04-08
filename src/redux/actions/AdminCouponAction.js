import AdminAPI from "../../BaseAPI/AdminAPI";
import { toast } from "react-toastify";

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
    toast.success("Coupon created successfully!");
  } catch (error) {
    console.log(error);
    toast.error("Failed to create coupon.");
  }
};

/* UPDATE */
export const updateCouponAction = (id, formData) => async (dispatch) => {
  try {
    await AdminAPI.put(`catalog/admin/coupons/${id}/`, formData);
    dispatch(getCouponAction());
    toast.success("Coupon updated successfully!");
  } catch (error) {
    console.log(error);
    toast.error("Failed to update coupon.");
  }
};

/* DELETE */
export const deleteCouponAction = (id) => async (dispatch) => {
  try {
    await AdminAPI.delete(`catalog/admin/coupons/${id}/`);
    dispatch(getCouponAction());
    toast.success("Coupon deleted successfully!");
  } catch (error) {
    console.log(error);
    toast.error("Failed to delete coupon.");
  }
};
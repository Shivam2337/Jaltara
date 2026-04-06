import AdminAPI from "../../BaseAPI/AdminAPI";

export const getPaymentsAction = (status = "") => async (dispatch) => {
  dispatch({ type: "PAYMENT_LIST_REQUEST" });
  try {
    const url = status
      ? `payments/admin/payments/?status=${status}`
      : "payments/admin/payments/";

    const { data } = await AdminAPI.get(url);
    console.log("📦 Payments API response:", data);

    dispatch({
      type: "PAYMENT_LIST_SUCCESS",
      payload: data.results || data,
    });
  } catch (err) {
    console.error("❌ Payments fetch error:", JSON.stringify(err.response?.data));
    dispatch({
      type: "PAYMENT_LIST_FAIL",
      payload: err.message,
    });
  }
};
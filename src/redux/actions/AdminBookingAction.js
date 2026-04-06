import AdminAPI from "../../BaseAPI/AdminAPI";

export const getBookingsAction = () => async (dispatch) => {
  dispatch({ type: "BOOKING_LIST_REQUEST" });
  try {
    const { data } = await AdminAPI.get("bookings/history/");
    console.log("📦 Bookings API response:", data);
    dispatch({
      type: "BOOKING_LIST_SUCCESS",
      payload: data.results || data,
    });
  } catch (err) {
    console.error("❌ Bookings fetch error:", JSON.stringify(err.response?.data));
    dispatch({
      type: "BOOKING_LIST_FAIL",
      payload: err.message,
    });
  }
};
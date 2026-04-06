import AdminAPI from "../../BaseAPI/AdminAPI";

export const getBookingsAction = () => async (dispatch) => {

  console.log("GET BOOKINGS CALLED");

  dispatch({ type: "BOOKING_REQUEST" });

  try {

    const response = await AdminAPI.get("catalog/admin/room-bookings/");

    console.log("BOOKING RESPONSE:", response.data);

    dispatch({
      type: "BOOKING_SUCCESS",
      payload: response.data
    });

  } catch (error) {

    console.log("BOOKING ERROR:", error);

    dispatch({
      type: "BOOKING_FAIL",
      payload: error.response?.data || "Booking Fetch Failed"
    });

  }

};


export const deleteBookingAction = (id) => async (dispatch) => {

  console.log("DELETE BOOKING:", id);

  try {

    await AdminAPI.delete(`catalog/admin/room-bookings/${id}/`);

    dispatch(getBookingsAction());

  } catch (error) {

    console.log("DELETE ERROR:", error);

  }

};
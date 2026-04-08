import AdminAPI from "../../BaseAPI/AdminAPI";
import { toast } from "react-toastify";

// GET RIDES
export const getRidesAction = () => async (dispatch) => {
  try {
    dispatch({ type: "RIDE_LIST_REQUEST" });

    const { data } = await AdminAPI.get("catalog/admin/rides/");

    console.log("Rides fetched:", data);

    dispatch({
      type: "RIDE_LIST_SUCCESS",
      payload: data,
    });

  } catch (error) {
    dispatch({
      type: "RIDE_LIST_FAIL",
      payload: error.response?.data || error.message,
    });
  }
};


// ADD RIDE
export const addRideAction = (rideData) => async (dispatch) => {
  try {

    console.log("Sending ride:", rideData);

    const { data } = await AdminAPI.post(
      "catalog/admin/rides/",
      rideData
    );

    console.log("Ride created:", data);

    dispatch({
      type: "RIDE_ADD_SUCCESS",
      payload: data,
    });
    return data;

  } catch (error) {

    console.log("Ride error:", error.response?.data);

    dispatch({
      type: "RIDE_ADD_FAIL",
      payload: error.response?.data || error.message,
    });
    throw error;
  }
};

// Delete pricing
export const deleteRidesAction = (id) => async (dispatch) => {
  try {
    
    await AdminAPI.delete(`catalog/admin/rides/${id}/`);
    dispatch({ type: "RIDE_DELETE_SUCCESS", payload: id });
    toast.success("Ride deleted successfully!");
  } catch (error) {
    dispatch({ type: "RIDE_DELETE_FAIL", payload: error.message });
    toast.error("Failed to delete ride.");
  }
};

// Edit pricing
export const editRidesAction = (id, payload) => async (dispatch) => {
  try {
    console.log("📤 UPDATE payload:", JSON.stringify(payload)); // ✅ see what's being sent
    const { data } = await AdminAPI.put(`catalog/admin/rides/${id}/`, payload);
    console.log("✅ UPDATE success:", data);
    dispatch({ type: "EDIT_RIDE_SUCCESS", payload: data });
    dispatch(getRidesAction());
    return data;
  } catch (err) {
    console.error("❌ UPDATE error status:", err.response?.status);
    console.error("❌ UPDATE error detail:", JSON.stringify(err.response?.data)); // ✅ exact error
    dispatch(getRidesAction());
    throw err;
  }
};
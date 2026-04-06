import AdminAPI from "../../BaseAPI/AdminAPI";

/* ================= GET ROOMS ================= */
export const getRoomsAction = () => async (dispatch) => {
  try {
    dispatch({ type: "ROOMS_REQUEST" });

    const { data } = await AdminAPI.get("catalog/admin/rooms/");
    console.log("Rooms fetched:", data); // ✅ log GET response

    dispatch({
      type: "ROOMS_SUCCESS",
      payload: data.results ? data.results : data,
    });
  } catch (error) {
    console.error("Rooms fetch error:", error.response?.data || error.message);
    dispatch({
      type: "ROOMS_FAIL",
      payload: error.response?.data?.detail || error.message,
    });
  }
};

/* ================= CREATE ROOM ================= */
export const createRoomAction = (roomData) => async (dispatch) => {
  try {
    dispatch({ type: "ROOM_CREATE_REQUEST" });
    const { data } = await AdminAPI.post("catalog/admin/rooms/", roomData);

    dispatch({ type: "ROOM_CREATE_SUCCESS", payload: data });
    return data; // ✅ Return the newly created room including ID
  } catch (error) {
    dispatch({ type: "ROOM_CREATE_FAIL", payload: error.response?.data || error.message });
    throw error;
  }
};

/* ================= UPDATE ROOM ================= */
export const updateRoomAction = (id, roomData) => async (dispatch) => {
  try {
    dispatch({ type: "ROOM_UPDATE_REQUEST" });
    console.log("Updating room", id, "with data:", roomData);

    const { data } = await AdminAPI.patch(
      `catalog/admin/rooms/${id}/`,
      roomData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    console.log("Room updated:", data);
dispatch(getRoomsAction()); // ✅ refresh list after update
    dispatch({
      type: "ROOM_UPDATE_SUCCESS",
      payload: data,
    });
 
    return data; // ✅ return data so dispatch(...) resolves
    
  } catch (error) {

    console.error("Room update error:", error.response?.data || error.message);
    dispatch({
      type: "ROOM_UPDATE_FAIL",
      payload: error.response?.data || error.message,
    });
      dispatch(getRoomsAction()); // ✅ refresh list even on error
    throw error;
  }
};

/* ================= DELETE ROOM ================= */
export const deleteRoomAction = (id) => async (dispatch) => {
  try {
    dispatch({ type: "ROOM_DELETE_REQUEST" });
    console.log("Deleting room:", id); // ✅ log DELETE

    await AdminAPI.delete(`catalog/admin/rooms/${id}/`);

    console.log("Room deleted:", id);

    dispatch({
      type: "ROOM_DELETE_SUCCESS",
      payload: id,
    });
  } catch (error) {
    console.error("Room delete error:", error.response?.data || error.message);
    dispatch({
      type: "ROOM_DELETE_FAIL",
      payload: error.response?.data || error.message,
    });
  }
};
import AdminAPI from "../../BaseAPI/AdminAPI";

export const getNotificationsAction = () => async (dispatch) => {
  dispatch({ type: "NOTIFICATION_LIST_REQUEST" });
  try {
    const { data } = await AdminAPI.get("cms/notifications/");
    console.log("🔔 Notifications:", data);
    dispatch({
      type: "NOTIFICATION_LIST_SUCCESS",
      payload: {
        notifications: data.notifications || [],
        unread_count: data.unread_count || 0,
      },
    });
  } catch (err) {
    console.error("❌ Notifications fetch error:", JSON.stringify(err.response?.data));
    dispatch({ type: "NOTIFICATION_LIST_FAIL", payload: err.message });
  }
};

export const markAllNotificationsReadAction = () => async (dispatch) => {
  try {
    await AdminAPI.post("cms/notifications/read-all/");
    console.log("✅ All notifications marked as read");
    dispatch({ type: "NOTIFICATION_MARK_ALL_READ" });
  } catch (err) {
    console.error("❌ Mark all read error:", JSON.stringify(err.response?.data));
  }
};
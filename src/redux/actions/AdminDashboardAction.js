// redux/actions/AdminDashboardAction.js

import AdminAPI from "../../BaseAPI/AdminAPI";

export const getDashboardStats = () => async (dispatch) => {
  dispatch({ type: "DASHBOARD_LOADING" });
  try {
    const { data } = await AdminAPI.get("cms/dashboard/");
    console.log("Dashboard API response:", data);
    dispatch({ type: "DASHBOARD_SUCCESS", payload: data });
  } catch (err) {
    console.error("Dashboard API error:", err);
    dispatch({ type: "DASHBOARD_FAIL", payload: err.message });
  }
};
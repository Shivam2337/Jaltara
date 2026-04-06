import AdminAPI from "../../BaseAPI/AdminAPI";

export const adminLogin = (username, password) => async (dispatch) => {

  console.log("LOGIN FUNCTION CALLED");
  console.log("Username:", username);
  console.log("Password:", password);

  dispatch({ type: "LOGIN_REQUEST" });

  try {

    // ✅ CLEAR OLD DATA FIRST (VERY IMPORTANT)
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRefreshToken");
    localStorage.removeItem("adminRole");
    localStorage.removeItem("adminUsername");
    localStorage.removeItem("isSuperuser");

    console.log("Sending request to API...");

    const response = await AdminAPI.post("auth/admin/login/", {
      username: username,
      password: password
    });

    console.log("API RESPONSE SUCCESS:", response.data);

    // ✅ SAVE ALL REQUIRED DATA
    localStorage.setItem("adminToken", response.data.access);
    localStorage.setItem("adminRefreshToken", response.data.refresh);
    localStorage.setItem("adminRole", response.data.role);
    localStorage.setItem("adminUsername", response.data.username);

    // ✅ IMPORTANT (for sidebar logic)
    localStorage.setItem(
      "isSuperuser",
      response.data.is_superuser ? "true" : "false"
    );

    console.log("Token saved:", response.data.access);
    console.log("Is Superuser:", response.data.is_superuser);

    // ✅ DISPATCH SUCCESS
    dispatch({
      type: "LOGIN_SUCCESS",
      payload: response.data
    });

    return response.data;

  } catch (error) {

    console.log("LOGIN ERROR:", error.response?.data);

    dispatch({
      type: "LOGIN_FAILURE",
      payload: error.response?.data || "Login Failed"
    });

  }

};
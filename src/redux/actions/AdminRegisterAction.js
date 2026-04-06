import AdminAPI from "../../BaseAPI/AdminAPI";

/* ================= REGISTER ADMIN ================= */
export const adminRegister = (formData) => async (dispatch) => {
  dispatch({ type: "REGISTER_REQUEST" });

  try {
    const response = await AdminAPI.post("auth/admin/register/", formData);

    dispatch({
      type: "REGISTER_SUCCESS",
      payload: response.data
    });

    alert("Registration Successful");
    return true;

  } catch (error) {

    const errorMessage =
      error.response?.data?.detail ||
      JSON.stringify(error.response?.data) ||
      "Registration Failed";

    dispatch({
      type: "REGISTER_FAILURE",
      payload: errorMessage
    });

    alert(errorMessage);
    return false;
  }
};

/* ================= GET STAFF USERS ================= */
export const getStaffUsersAction = () => async (dispatch) => {
  dispatch({ type: "STAFF_USER_LIST_REQUEST" });

  try {
    const { data } = await AdminAPI.get("cms/admin/staff-users/");

    dispatch({
      type: "STAFF_USER_LIST_SUCCESS",
      payload: data
    });

  } catch (error) {
    dispatch({
      type: "STAFF_USER_LIST_FAILURE",
      payload: error.response?.data || "Error"
    });
  }
};


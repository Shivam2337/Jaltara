import AdminAPI from "../../BaseAPI/AdminAPI";

export const AdminContactAction = () => async (dispatch) => {
  try {
    dispatch({ type: "ADMIN_CONTACT_REQUEST" });

    const { data } = await AdminAPI.get(
      "cms/admin/contact-enquiries/"
    );

    dispatch({
      type: "ADMIN_CONTACT_SUCCESS",
      payload: data,
    });

  } catch (error) {
    dispatch({
      type: "ADMIN_CONTACT_FAIL",
      payload:
        error.response?.data?.message || error.message,
    });
  }
};
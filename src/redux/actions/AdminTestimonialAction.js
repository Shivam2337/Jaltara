import AdminAPI from "../../BaseAPI/AdminAPI";

export const getTestimonials = () => async (dispatch) => {
  try {
    dispatch({ type: "TESTIMONIAL_LIST_REQUEST" });

    const { data } = await AdminAPI.get("cms/admin-testimonials/");

    dispatch({
      type: "TESTIMONIAL_LIST_SUCCESS",
      payload: data.results ? data.results : data,
    });

  } catch (error) {
    dispatch({
      type: "TESTIMONIAL_LIST_FAIL",
      payload: error.response?.data?.detail || error.message,
    });
  }
};

// Approve a testimonial
export const approveTestimonial = (id) => async (dispatch) => {
  try {
    dispatch({ type: "TESTIMONIAL_APPROVE_REQUEST", payload: id });

    await AdminAPI.patch(`cms/admin/testimonials/${id}/`, {
      is_approved: true,
    });

    dispatch({ type: "TESTIMONIAL_APPROVE_SUCCESS", payload: id });
  } catch (error) {
    dispatch({
      type: "TESTIMONIAL_APPROVE_FAIL",
      payload: error.response?.data?.detail || error.message,
    });
  }
};
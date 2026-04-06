import AdminAPI from "../../BaseAPI/AdminAPI";

export const getFaqList = () => async (dispatch) => {
  try {
    dispatch({ type: "FAQ_GET_REQUEST" });

    const { data } = await AdminAPI.get("/cms/admin/faqs/");

    dispatch({
      type: "FAQ_GET_SUCCESS",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "FAQ_GET_FAIL",
      payload: error.response?.data || error.message,
    });
  }
};
export const createFaq = (faqData) => async (dispatch) => {
  try {
    dispatch({ type: "FAQ_CREATE_REQUEST" });

    const { data } = await AdminAPI.post("/cms/admin/faqs/", faqData);

    dispatch({
      type: "FAQ_CREATE_SUCCESS",
      payload: data,
    });

    dispatch(getFaqList());

    return { success: true, data };
  } catch (error) {
    const err = error.response?.data || error.message;

    dispatch({
      type: "FAQ_CREATE_FAIL",
      payload: err,
    });

    return { success: false, error: err };
  }
};

export const updateFaq = (id, faqData) => async (dispatch) => {
  try {
    dispatch({ type: "FAQ_UPDATE_REQUEST" });

    const { data } = await AdminAPI.put(`/cms/admin/faqs/${id}/`, faqData);

    dispatch({
      type: "FAQ_UPDATE_SUCCESS",
      payload: data,
    });

    dispatch(getFaqList());

    return { success: true, data };
  } catch (error) {
    const err = error.response?.data || error.message;

    dispatch({
      type: "FAQ_UPDATE_FAIL",
      payload: err,
    });

    return { success: false, error: err };
  }
};

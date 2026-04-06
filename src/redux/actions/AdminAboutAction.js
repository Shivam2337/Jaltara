import AdminAPI from "../../BaseAPI/AdminAPI";

export const getAboutPage = () => async (dispatch) => {
  try {
    dispatch({ type: "ABOUT_GET_REQUEST" });

    const { data } = await AdminAPI.get("/cms/admin/about-pages/");

    dispatch({
      type: "ABOUT_GET_SUCCESS",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "ABOUT_GET_FAIL",
      payload: error.response?.data || error.message,
    });
  }
};

export const createAbout = (formData) => async (dispatch) => {
  try {
    dispatch({ type: "ABOUT_CREATE_REQUEST" });

    const { data } = await AdminAPI.post("/cms/admin/about-pages/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    dispatch({
      type: "ABOUT_CREATE_SUCCESS",
      payload: data,
    });

    dispatch(getAboutPage());

    return { success: true, data };
  } catch (error) {
    const err = error.response?.data || error.message;

    dispatch({
      type: "ABOUT_CREATE_FAIL",
      payload: err,
    });

    return { success: false, error: err };
  }
};
export const updateAbout =
  (id = 1, formData) =>
  async (dispatch) => {
    try {
      dispatch({ type: "ABOUT_UPDATE_REQUEST" });

      const { data } = await AdminAPI.patch(
        `/cms/admin/about-pages/${id}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      dispatch({
        type: "ABOUT_UPDATE_SUCCESS",
        payload: data,
      });

      dispatch(getAboutPage());

      return { success: true, data };
    } catch (error) {
      const err = error.response?.data || error.message;

      dispatch({
        type: "ABOUT_UPDATE_FAIL",
        payload: err,
      });

      return { success: false, error: err };
    }
  };

export const createAboutCard = (formData) => async (dispatch) => {
  try {
    dispatch({ type: "ABOUT_CARD_CREATE_REQUEST" });

    const { data } = await AdminAPI.post("/cms/admin/about-cards/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    dispatch({
      type: "ABOUT_CARD_CREATE_SUCCESS",
      payload: data,
    });

    dispatch(getAboutPage());

    return { success: true, data };
  } catch (error) {
    const err = error.response?.data || error.message;

    dispatch({
      type: "ABOUT_CARD_CREATE_FAIL",
      payload: err,
    });

    return { success: false, error: err };
  }
};
export const updateAboutCard = (id, formData) => async (dispatch) => {
  try {
    dispatch({ type: "ABOUT_CARD_UPDATE_REQUEST" });

    const { data } = await AdminAPI.patch(
      `/cms/admin/about-cards/${id}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    dispatch({
      type: "ABOUT_CARD_UPDATE_SUCCESS",
      payload: data,
    });

    dispatch(getAboutPage());

    return { success: true, data };
  } catch (error) {
    const err = error.response?.data || error.message;

    dispatch({
      type: "ABOUT_CARD_UPDATE_FAIL",
      payload: err,
    });

    return { success: false, error: err };
  }
};

export const createFeature = (formData) => async (dispatch) => {
  try {
    dispatch({ type: "ABOUT_FEATURE_CREATE_REQUEST" });

    const { data } = await AdminAPI.post(
      "/cms/admin/about-features/",
      formData
    );

    dispatch({
      type: "ABOUT_FEATURE_CREATE_SUCCESS",
      payload: data,
    });

    dispatch(getAboutPage());

    return { success: true, data };
  } catch (error) {
    const err = error.response?.data || error.message;

    dispatch({
      type: "ABOUT_FEATURE_CREATE_FAIL",
      payload: err,
    });

    return { success: false, error: err };
  }
};

export const updateFeature = (id, formData) => async (dispatch) => {
  try {
    dispatch({ type: "ABOUT_FEATURE_UPDATE_REQUEST" });

    const { data } = await AdminAPI.patch(
      `/cms/admin/about-features/${id}/`,
      formData
    );

    dispatch({
      type: "ABOUT_FEATURE_UPDATE_SUCCESS",
      payload: data,
    });

    dispatch(getAboutPage());

    return { success: true, data };
  } catch (error) {
    const err = error.response?.data || error.message;

    dispatch({
      type: "ABOUT_FEATURE_UPDATE_FAIL",
      payload: err,
    });

    return { success: false, error: err };
  }
};

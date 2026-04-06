import AdminAPI from "../../BaseAPI/AdminAPI";

export const getAllPages = () => async (dispatch) => {
  try {
    dispatch({ type: "PAGES_GET_REQUEST" });

    const { data } = await AdminAPI.get("cms/admin/pages/");

    dispatch({
      type: "PAGES_GET_SUCCESS",
      payload: data,
    });

    return data;
  } catch (error) {
    const errMsg = error.response?.data?.detail || error.message;

    dispatch({
      type: "PAGES_GET_FAIL",
      payload: errMsg,
    });

    throw errMsg;
  }
};

export const getTerms = () => async (dispatch) => {
  try {
    dispatch({ type: "TERMS_GET_REQUEST" });

    const { data } = await AdminAPI.get("cms/admin/pages/");

    const pages = data?.results || data;

    const terms = pages.find((p) => p.slug === "terms-and-conditions");

    dispatch({
      type: "TERMS_GET_SUCCESS",
      payload: terms,
    });

    return terms;
  } catch (error) {
    const errMsg = error.response?.data?.detail || error.message;

    dispatch({
      type: "TERMS_GET_FAIL",
      payload: errMsg,
    });

    throw errMsg;
  }
};

export const createTerms = (payload) => async (dispatch) => {
  try {
    dispatch({ type: "TERMS_CREATE_REQUEST" });

    const { data } = await AdminAPI.post("cms/admin/pages/", payload);

    dispatch({
      type: "TERMS_CREATE_SUCCESS",
      payload: data,
    });

    return data;
  } catch (error) {
    const errMsg = error.response?.data?.detail || error.message;

    dispatch({
      type: "TERMS_CREATE_FAIL",
      payload: errMsg,
    });

    throw errMsg;
  }
};

export const updateTerms =
  (id = 1, payload) =>
  async (dispatch) => {
    try {
      dispatch({ type: "TERMS_UPDATE_REQUEST" });

      const { data } = await AdminAPI.patch(`cms/admin/pages/${id}/`, payload);

      dispatch({
        type: "TERMS_UPDATE_SUCCESS",
        payload: data,
      });

      return data;
    } catch (error) {
      const errMsg = error.response?.data?.detail || error.message;

      dispatch({
        type: "TERMS_UPDATE_FAIL",
        payload: errMsg,
      });

      throw errMsg;
    }
  };

export const getPrivacy = () => async (dispatch) => {
  try {
    dispatch({ type: "PRIVACY_GET_REQUEST" });

    const { data } = await AdminAPI.get("cms/admin/pages/");

    const page = (data || []).find((p) => p.slug === "privacy-policy");

    // console.log("page:", page);

    dispatch({
      type: "PRIVACY_GET_SUCCESS",
      payload: page,
    });

    return page;
  } catch (error) {
    const errMsg = error.response?.data?.detail || error.message;

    dispatch({
      type: "PRIVACY_GET_FAIL",
      payload: errMsg,
    });

    throw errMsg;
  }
};
export const createPrivacy = (payload) => async (dispatch) => {
  try {
    dispatch({ type: "PRIVACY_CREATE_REQUEST" });

    const { data } = await AdminAPI.post("cms/admin/pages/", payload);

    dispatch({
      type: "PRIVACY_CREATE_SUCCESS",
      payload: data,
    });

    return data;
  } catch (error) {
    const errMsg = error.response?.data?.detail || error.message;

    dispatch({
      type: "PRIVACY_CREATE_FAIL",
      payload: errMsg,
    });

    throw errMsg;
  }
};

export const updatePrivacy =
  (id = 2, payload) =>
  async (dispatch) => {
    try {
      dispatch({ type: "PRIVACY_UPDATE_REQUEST" });

      const { data } = await AdminAPI.patch(`cms/admin/pages/${id}/`, payload);

      dispatch({
        type: "PRIVACY_UPDATE_SUCCESS",
        payload: data,
      });

      return data;
    } catch (error) {
      const errMsg = error.response?.data?.detail || error.message;

      dispatch({
        type: "PRIVACY_UPDATE_FAIL",
        payload: errMsg,
      });

      throw errMsg;
    }
  };

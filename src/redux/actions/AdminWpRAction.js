import AdminAPI from "../../BaseAPI/AdminAPI";

export const getWpRSections = () => async (dispatch) => {
  try {
    dispatch({ type: "WPR_SECTION_LIST_REQUEST" });

    const { data } = await AdminAPI.get("cms/admin/sections/");

    dispatch({
      type: "WPR_SECTION_LIST_SUCCESS",
      payload: data?.results || data,
    });
  } catch (error) {
    dispatch({
      type: "WPR_SECTION_LIST_FAIL",
      payload: error.response?.data?.detail || error.message,
    });
  }
};

export const createWpRSection = (sectionData) => async (dispatch) => {
  try {
    dispatch({ type: "WPR_SECTION_CREATE_REQUEST" });

    const formData = new FormData();

    formData.append("name", sectionData.name || "");
    formData.append("section_heading", sectionData.section_heading || "");
    formData.append("section_text", sectionData.section_text || "");
    formData.append("contact_no", sectionData.contact_no || "");

    if (sectionData.front_image instanceof File) {
      formData.append("front_image", sectionData.front_image);
    }

    if (sectionData.background_image instanceof File) {
      formData.append("background_image", sectionData.background_image);
    }

    const { data } = await AdminAPI.post("cms/admin/sections/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    dispatch({
      type: "WPR_SECTION_CREATE_SUCCESS",
      payload: data,
    });

    return data;
  } catch (error) {
    const errMsg = error.response?.data?.detail || error.message;

    dispatch({
      type: "WPR_SECTION_CREATE_FAIL",
      payload: errMsg,
    });

    throw errMsg;
  }
};

export const updateWpRSection = (id, sectionData) => async (dispatch) => {
  try {
    dispatch({ type: "WPR_SECTION_UPDATE_REQUEST", payload: id });

    const formData = new FormData();

    if (sectionData.name) {
      formData.append("name", sectionData.name);
    }

    if (sectionData.section_heading) {
      formData.append("section_heading", sectionData.section_heading);
    }

    if (sectionData.section_text) {
      formData.append("section_text", sectionData.section_text);
    }

    if (sectionData.contact_no) {
      formData.append("contact_no", sectionData.contact_no);
    }

    if (sectionData.front_image instanceof File) {
      formData.append("front_image", sectionData.front_image);
    }

    if (sectionData.background_image instanceof File) {
      formData.append("background_image", sectionData.background_image);
    }

    const { data } = await AdminAPI.patch(
      `cms/admin/sections/${id}/`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    dispatch({
      type: "WPR_SECTION_UPDATE_SUCCESS",
      payload: { ...data, id },
    });

    return data;
  } catch (error) {
    const errMsg = error.response?.data?.detail || error.message;

    dispatch({
      type: "WPR_SECTION_UPDATE_FAIL",
      payload: errMsg,
    });

    throw errMsg;
  }
};

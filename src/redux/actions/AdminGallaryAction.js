import AdminAPI from "../../BaseAPI/AdminAPI";

const generateSlug = (name) => name?.toLowerCase().trim().replace(/\s+/g, "-");

/* GET */
export const getGallaryCategories = () => async (dispatch) => {
  try {
    dispatch({ type: "GALLARY_CATEGORY_LIST_REQUEST" });

    const { data } = await AdminAPI.get("cms/admin/gallery-categories/");

    dispatch({
      type: "GALLARY_CATEGORY_LIST_SUCCESS",
      payload: data?.results || data,
    });

    return data;
  } catch (error) {
    const errMsg = error.response?.data?.detail || error.message;

    dispatch({
      type: "GALLARY_CATEGORY_LIST_FAIL",
      payload: errMsg,
    });

    throw errMsg;
  }
};

/* CREATE */
export const createGallaryCategory = (category) => async (dispatch) => {
  try {
    dispatch({ type: "GALLARY_CATEGORY_CREATE_REQUEST" });

    const payload = {
      name: category.name,
      slug: generateSlug(category.name),
    };

    const { data } = await AdminAPI.post(
      "cms/admin/gallery-categories/",
      payload
    );

    dispatch({
      type: "GALLARY_CATEGORY_CREATE_SUCCESS",
      payload: data,
    });

    return data;
  } catch (error) {
    const errMsg = error.response?.data?.detail || error.message;

    dispatch({
      type: "GALLARY_CATEGORY_CREATE_FAIL",
      payload: errMsg,
    });

    throw errMsg;
  }
};

/* UPDATE */
export const updateGallaryCategory = (id, category) => async (dispatch) => {
  try {
    dispatch({
      type: "GALLARY_CATEGORY_UPDATE_REQUEST",
      payload: id,
    });

    const payload = {
      name: category.name,
      slug: generateSlug(category.name),
    };

    const { data } = await AdminAPI.patch(
      `cms/admin/gallery-categories/${id}/`,
      payload
    );

    dispatch({
      type: "GALLARY_CATEGORY_UPDATE_SUCCESS",
      payload: { ...data, id },
    });

    return data;
  } catch (error) {
    const errMsg = error.response?.data?.detail || error.message;

    dispatch({
      type: "GALLARY_CATEGORY_UPDATE_FAIL",
      payload: errMsg,
    });

    throw errMsg;
  }
};

export const getGallaryImages = () => async (dispatch) => {
  try {
    dispatch({ type: "GALLARY_IMAGE_LIST_REQUEST" });

    const { data } = await AdminAPI.get("cms/admin/gallery/");

    dispatch({
      type: "GALLARY_IMAGE_LIST_SUCCESS",
      payload: data?.results || data,
    });

    return data;
  } catch (error) {
    const errMsg = error.response?.data?.detail || error.message;

    dispatch({
      type: "GALLARY_IMAGE_LIST_FAIL",
      payload: errMsg,
    });

    throw errMsg;
  }
};

export const createGallaryImage = (imageData) => async (dispatch) => {
  try {
    dispatch({ type: "GALLARY_IMAGE_CREATE_REQUEST" });

    const formData = new FormData();

    formData.append("category", imageData.category);
    formData.append("title", imageData.title || "");
    formData.append("media_type", imageData.media_type || "photo");
    formData.append("is_active", imageData.is_active);

    if (imageData.image instanceof File) {
      formData.append("image", imageData.image);
    }

    const { data } = await AdminAPI.post("cms/admin/gallery/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    dispatch({
      type: "GALLARY_IMAGE_CREATE_SUCCESS",
      payload: data,
    });

    return data;
  } catch (error) {
    const errMsg = error.response?.data?.detail || error.message;

    dispatch({
      type: "GALLARY_IMAGE_CREATE_FAIL",
      payload: errMsg,
    });

    throw errMsg;
  }
};

export const updateGallaryImageStatus = (id, is_active) => async (dispatch) => {
  try {
    dispatch({
      type: "GALLARY_IMAGE_UPDATE_REQUEST",
      payload: id,
    });

    const payload = { is_active };

    const { data } = await AdminAPI.patch(`cms/admin/gallery/${id}/`, payload);

    dispatch({
      type: "GALLARY_IMAGE_UPDATE_SUCCESS",
      payload: { ...data, id },
    });

    return data;
  } catch (error) {
    const errMsg = error.response?.data?.detail || error.message;

    dispatch({
      type: "GALLARY_IMAGE_UPDATE_FAIL",
      payload: errMsg,
    });

    throw errMsg;
  }
};

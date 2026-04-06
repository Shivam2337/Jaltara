import AdminAPI from "../../BaseAPI/AdminAPI";

// ========================
// HALL PAGE ACTIONS
// ========================

export const getHallsAction = () => async (dispatch) => {
  dispatch({ type: "HALL_LIST_REQUEST" });
  try {
    const { data } = await AdminAPI.get("cms/admin/hall-page/");
    console.log("📦 Halls:", data);
    dispatch({ type: "HALL_LIST_SUCCESS", payload: data.results || data });
  } catch (err) {
    console.error("❌ Halls fetch error:", JSON.stringify(err.response?.data));
    dispatch({ type: "HALL_LIST_FAIL", payload: err.message });
  }
};

export const createHallAction = (formData) => async (dispatch) => {
  try {
    console.log("📤 CREATE Hall payload:", formData);
    const { data } = await AdminAPI.post("cms/admin/hall-page/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("✅ Hall created:", data);
    dispatch({ type: "HALL_CREATE_SUCCESS", payload: data });
    dispatch(getHallsAction());
    return data;
  } catch (err) {
    console.error("❌ CREATE Hall error:", JSON.stringify(err.response?.data));
  }
};

export const updateHallAction = (id, formData) => async (dispatch) => {
  try {
    console.log("📤 UPDATE Hall payload:", formData);
    const { data } = await AdminAPI.patch(
      // ✅ FIX 1 — changed PUT to PATCH so main_image is not required
      `cms/admin/hall-page/${id}/`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    console.log("✅ Hall updated:", data);
    dispatch({ type: "HALL_UPDATE_SUCCESS", payload: data });
    dispatch(getHallsAction());
    return data;
  } catch (err) {
    console.error("❌ UPDATE Hall error:", JSON.stringify(err.response?.data));
  }
};

export const deleteHallAction = (id) => async (dispatch) => {
  try {
    await AdminAPI.delete(`cms/admin/hall-page/${id}/`);
    console.log("✅ Hall deleted:", id);
    dispatch({ type: "HALL_DELETE_SUCCESS", payload: id });
    dispatch(getHallsAction());
  } catch (err) {
    console.error("❌ DELETE Hall error:", JSON.stringify(err.response?.data));
  }
};

// ========================
// HALL GALLERY ACTIONS
// ========================

export const getHallGalleryAction = () => async (dispatch) => {
  dispatch({ type: "HALL_GALLERY_LIST_REQUEST" });
  try {
    const { data } = await AdminAPI.get("cms/admin/hall-gallery/");
    console.log("📦 Hall Gallery:", data);
    dispatch({ type: "HALL_GALLERY_LIST_SUCCESS", payload: data.results || data });
  } catch (err) {
    console.error("❌ Hall Gallery fetch error:", JSON.stringify(err.response?.data));
    dispatch({ type: "HALL_GALLERY_LIST_FAIL", payload: err.message });
  }
};

export const createHallGalleryAction = (formData) => async (dispatch) => {
  try {
    const { data } = await AdminAPI.post("cms/admin/hall-gallery/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("✅ Hall Gallery image uploaded:", data);
    dispatch(getHallGalleryAction());
    return data;
  } catch (err) {
    console.error("❌ Hall Gallery upload error:", JSON.stringify(err.response?.data));
  }
};

export const deleteHallGalleryAction = (id) => async (dispatch) => {
  try {
    await AdminAPI.delete(`cms/admin/hall-images/${id}/`);
    dispatch(getHallGalleryAction());
  } catch (err) {
    console.error("❌ Hall Gallery delete error:", JSON.stringify(err.response?.data));
  }
};

// ========================
// HALL FEATURE ACTIONS
// ========================

export const getHallFeaturesAction = () => async (dispatch) => {
  dispatch({ type: "HALL_FEATURE_LIST_REQUEST" });
  try {
    const { data } = await AdminAPI.get("cms/admin/hall-feature/");
    console.log("📦 Hall Features:", data);
    dispatch({ type: "HALL_FEATURE_LIST_SUCCESS", payload: data.results || data });
  } catch (err) {
    console.error("❌ Hall Features fetch error:", JSON.stringify(err.response?.data));
    dispatch({ type: "HALL_FEATURE_LIST_FAIL", payload: err.message });
  }
};

export const createHallFeatureAction = (formData) => async (dispatch) => {
  try {
    const { data } = await AdminAPI.post("cms/admin/hall-feature/", formData);
    console.log("✅ Hall Feature created:", data);
    dispatch(getHallFeaturesAction());
    return data;
  } catch (err) {
    console.error("❌ Hall Feature create error:", JSON.stringify(err.response?.data));
  }
};

export const updateHallFeatureAction = (id, formData) => async (dispatch) => {
  try {
    const { data } = await AdminAPI.put(`cms/admin/hall-feature/${id}/`, formData);
    console.log("✅ Hall Feature updated:", data);
    dispatch(getHallFeaturesAction());
    return data;
  } catch (err) {
    console.error("❌ Hall Feature update error:", JSON.stringify(err.response?.data));
  }
};

export const deleteHallFeatureAction = (id) => async (dispatch) => {
  try {
    await AdminAPI.delete(`cms/admin/hall-feature/${id}/`);
    dispatch(getHallFeaturesAction());
  } catch (err) {
    console.error("❌ Hall Feature delete error:", JSON.stringify(err.response?.data));
  }
};
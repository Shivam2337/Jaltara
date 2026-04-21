import AdminAPI from "../../BaseAPI/AdminAPI";
import { toast } from "react-toastify";

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
    const { data } = await AdminAPI.post("cms/admin/hall-page/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    dispatch({ type: "HALL_CREATE_SUCCESS", payload: data });
    dispatch(getHallsAction());
    toast.success("Hall created successfully!");
    return data;
  } catch (err) {
    console.error("❌ CREATE Hall error:", JSON.stringify(err.response?.data));
    toast.error("Failed to create hall.");
    throw err;
  }
};

export const updateHallAction = (id, formData) => async (dispatch) => {
  try {
    const { data } = await AdminAPI.patch(`cms/admin/hall-page/${id}/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    dispatch({ type: "HALL_UPDATE_SUCCESS", payload: data });
    dispatch(getHallsAction());
    toast.success("Hall updated successfully!");
    return data;
  } catch (err) {
    console.error("❌ UPDATE Hall error:", JSON.stringify(err.response?.data));
    toast.error("Failed to update hall.");
    throw err;
  }
};

export const deleteHallAction = (id) => async (dispatch) => {
  try {
    await AdminAPI.delete(`cms/admin/hall-page/${id}/`);
    dispatch({ type: "HALL_DELETE_SUCCESS", payload: id });
    dispatch(getHallsAction());
    toast.success("Hall deleted successfully!");
  } catch (err) {
    console.error("❌ DELETE Hall error:", JSON.stringify(err.response?.data));
    toast.error("Failed to delete hall.");
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
    dispatch(getHallGalleryAction());
    toast.success("Image uploaded successfully!");
    return data;
  } catch (err) {
    console.error("❌ Hall Gallery upload error:", JSON.stringify(err.response?.data));
    toast.error("Failed to upload image.");
    throw err;
  }
};

export const deleteHallGalleryAction = (id) => async (dispatch) => {
  try {
    await AdminAPI.delete(`cms/admin/hall-gallery/${id}/`);
    dispatch(getHallGalleryAction());
    toast.success("Image deleted successfully!");
  } catch (err) {
    console.error("❌ Hall Gallery delete error:", JSON.stringify(err.response?.data));
    toast.error("Failed to delete image.");
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
    dispatch(getHallFeaturesAction());
    toast.success("Feature added successfully!");
    return data;
  } catch (err) {
    console.error("❌ Hall Feature create error:", JSON.stringify(err.response?.data));
    toast.error("Failed to add feature.");
    throw err;
  }
};

export const updateHallFeatureAction = (id, formData) => async (dispatch) => {
  try {
    const { data } = await AdminAPI.put(`cms/admin/hall-feature/${id}/`, formData);
    dispatch(getHallFeaturesAction());
    toast.success("Feature updated successfully!");
    return data;
  } catch (err) {
    console.error("❌ Hall Feature update error:", JSON.stringify(err.response?.data));
    toast.error("Failed to update feature.");
    throw err;
  }
};

export const deleteHallFeatureAction = (id) => async (dispatch) => {
  try {
    await AdminAPI.delete(`cms/admin/hall-feature/${id}/`);
    dispatch(getHallFeaturesAction());
    toast.success("Feature deleted successfully!");
  } catch (err) {
    console.error("❌ Hall Feature delete error:", JSON.stringify(err.response?.data));
    toast.error("Failed to delete feature.");
  }
};
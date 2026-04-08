import AdminAPI from "../../BaseAPI/AdminAPI";
import { toast } from "react-toastify";

/* ================= GET AMENITIES ================= */
export const getAmenitiesAction = () => async (dispatch) => {
  try {
    dispatch({ type: "AMENITY_LIST_REQUEST" });

    const { data } = await AdminAPI.get("cms/admin/amenities/");

    dispatch({
      type: "AMENITY_LIST_SUCCESS",
      payload: data,
    });

  } catch (error) {
    dispatch({
      type: "AMENITY_LIST_FAIL",
      payload: error.response?.data?.detail || error.message,
    });
  }
};


/* ================= CREATE ================= */
export const createAmenityAction = (amenity) => async (dispatch) => {
  try {
    const formData = new FormData();
    formData.append("name", amenity.name || "");
    formData.append("is_active", amenity.is_active ? 1 : 0);
    if (amenity.image instanceof File) {
      formData.append("image", amenity.image);
    }
    await AdminAPI.post("cms/admin/amenities/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    dispatch(getAmenitiesAction());
    toast.success("Amenity created successfully!");
  } catch (error) {
    console.log("❌ CREATE ERROR:", error.response?.data || error.message);
    toast.error("Failed to create amenity.");
  }
};

/* ================= UPDATE ================= */
export const updateAmenityAction = (id, amenity) => async (dispatch) => {
  try {
    const formData = new FormData();
    formData.append("name", amenity.name || "");
    formData.append("is_active", amenity.is_active ? 1 : 0);
    if (amenity.image instanceof File) {
      formData.append("image", amenity.image);
    } else if (typeof amenity.image === "string") {
      formData.append("image", amenity.image);
    }
    await AdminAPI.put(`cms/admin/amenities/${id}/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    dispatch(getAmenitiesAction());
    toast.success("Amenity updated successfully!");
  } catch (error) {
    console.log("❌ UPDATE ERROR:", error.response?.data || error.message);
    toast.error("Failed to update amenity.");
  }
};

/* ================= DELETE ================= */
export const deleteAmenityAction = (id) => async (dispatch) => {
  try {
    await AdminAPI.delete(`cms/admin/amenities/${id}/`);
    dispatch(getAmenitiesAction());
    toast.success("Amenity deleted successfully!");
  } catch (error) {
    console.log("❌ DELETE ERROR:", error.response?.data || error.message);
    toast.error("Failed to delete amenity.");
  }
};
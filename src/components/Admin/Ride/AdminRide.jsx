import React, { useState, useEffect } from "react";
import "./Ride.css";
import { FaSearch, FaBell, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

import {
  getRidesAction,
  addRideAction,
  editRidesAction,
  deleteRidesAction,
} from "../../../redux/actions/AdminRideAction";
import { toast } from "react-toastify";
import AdminAPI from "../../../BaseAPI/AdminAPI";

export default function RideManagement() {
  const dispatch = useDispatch();
  const { rides, loading, error } = useSelector((state) => state.rides);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    is_active: true,
    is_adult_only: false,
    min_age: "",
    max_age: "",
    image: null,
    image_preview: "",
    image_id: null,
  });

  /* FETCH RIDES */
  useEffect(() => {
    console.log("Fetching rides...");
    dispatch(getRidesAction());
  }, [dispatch]);

  useEffect(() => {
    console.log("Rides from Redux:", rides);
  }, [rides]);

  /* HANDLE FORM CHANGE */
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name === "image" && files) {
      console.log("Selected image file:", files[0]);
      setFormData({
        ...formData,
        image: files[0],
        image_preview: URL.createObjectURL(files[0]),
      });
      return;
    }

    console.log(`Form change - ${name}:`, type === "checkbox" ? checked : value);
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  /* EDIT RIDE */
  const handleEdit = (ride) => {
    if (!ride) {
      toast("Ride data is missing.");
      return;
    }
    console.log("Editing Ride ID:", ride.id, "with data: ", ride);
    const primaryImage = ride.images?.find((img) => img.is_primary) || ride.images?.[0];
    console.log("Primary Image:", primaryImage);

    setFormData({
      name: ride.name || "",
      slug: ride.slug || "",
      description: ride.description || "",
      is_active: ride.is_active ?? true,
      is_adult_only: ride.is_adult_only ?? false,
      min_age: ride.min_age || "",
      max_age: ride.max_age || "",
      image: null,
      image_preview: primaryImage ? `https://api.jaltara.techsofast.com${primaryImage.image}` : "",
      image_id: primaryImage?.id || null,
    });

    setEditingId(ride.id);
    setShowModal(true);
  };

  /* DELETE RIDE */
  const handleDelete = (id) => {
    console.log("Deleting Ride ID:", id);
    dispatch(deleteRidesAction(id));
  };

  /* SAVE RIDE */
  const handleSubmit = async () => {
    if (!formData.name || !formData.slug || !formData.description || !formData.min_age || !formData.max_age) {
      toast("Please fill in all fields.");
      return;
    }
    try {
      console.log("Submitting Ride Form Data:", formData);

      const payload = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        is_active: formData.is_active,
        is_adult_only: formData.is_adult_only,
        min_age: formData.min_age,
        max_age: formData.max_age,
      };

      console.log(editingId ? "Editing ride..." : "Adding new ride...", payload);

      let response;
      if (editingId) {
        response = await dispatch(editRidesAction(editingId, payload));
        toast.success("Ride updated successfully!");
      } else {
        response = await dispatch(addRideAction(payload));
        toast.success("Ride added successfully!");
      }

      const rideId = response?.payload?.id || response?.id;
      console.log("Saved Ride ID:", rideId, "Response:", response);

      // IMAGE UPLOAD
      if (formData.image && rideId) {
        console.log("Uploading image for Ride ID:", rideId, formData.image);
        const imageData = new FormData();
        imageData.append("ride", rideId);
        imageData.append("image", formData.image);
        imageData.append("is_primary", true);

        const res = await AdminAPI.post("catalog/admin/ride-images/", imageData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("Image upload response:", res.data);

        dispatch({
          type: "RIDE_ADD_IMAGE_LOCAL",
          payload: { rideId, image: res.data },
        });
      }

      setShowModal(false);
      setEditingId(null);
      setFormData({
        name: "",
        slug: "",
        description: "",
        is_active: true,
        is_adult_only: false,
        min_age: "",
        max_age: "",
        image: null,
        image_preview: "",
        image_id: null,
      });
    } catch (error) {
      console.error("Save Error:", error);
      toast.error(editingId ? "Failed to update ride." : "Failed to add ride.");
    }
  };

  const filteredRides = rides?.filter((ride) =>
  ride.name?.toLowerCase().includes(searchTerm.toLowerCase())
);

  return (
    <div className="Admin-ride-guest-container">
      {/* TOP BAR */}
      

      <h2 className="Admin-ride-page-title">Water Park Rides</h2>

      {/* ACTION BAR */}
      <div className="Admin-ride-action-bar">
        <div className="Admin-ride-search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search rides"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          className="Admin-ride-checkin-btn"
          onClick={() => {
            console.log("Opening Add Ride Modal");
            setFormData({
              name: "",
              slug: "",
              description: "",
              is_active: true,
              is_adult_only: false,
              min_age: "",
              max_age: "",
              image: null,
              image_preview: "",
              image_id: null,
            });
            setEditingId(null);
            setShowModal(true);
          }}
        >
          <FaPlus className="Admin-ride-add-icon" /> Add Ride
        </button>
      </div>

      {/* TABLE */}
      <div className="Admin-ride-table-wrapper">
        <table>
          <thead>
            <tr>
              {/* <th>ID</th> */}
              <th>Name</th>
              <th>Slug</th>
              <th>Description</th>
              <th>Active</th>
              <th>Adult Only</th>
              <th>Min Age</th>
              <th>Max Age</th>
              <th>Image</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center' }}>Loading...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center' }}>Error: {error}</td>
              </tr>
            ) : filteredRides?.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center' }}>No data found</td>
              </tr>
            ) : (
              filteredRides?.map((ride) => {
                console.log("Rendering Ride:", ride);
                const primaryImage = ride.images?.find((img) => img.is_primary) || ride.images?.[0];
                console.log("Ride:", ride.name, "| images array:", ride.images);
                console.log("Primary image URL:", primaryImage?.image);
                console.log("Full image object:", JSON.stringify(ride.images?.[0]));
                return (
                  <tr key={ride.id}>
                    {/* <td>{ride.id}</td> */}
                    <td>{ride.name}</td>
                    <td>{ride.slug}</td>
                    <td>{ride.description}</td>
                    <td>{ride.is_active ? "Yes" : "No"}</td>
                    <td>{ride.is_adult_only ? "Yes" : "No"}</td>
                    <td>{ride.min_age}</td>
                    <td>{ride.max_age ?? "-"}</td>
                    <td>
                      {primaryImage ? (
                        <img
                          src={
                            primaryImage.image?.startsWith("http")
                              ? primaryImage.image
                              : `https://api.jaltara.techsofast.com${primaryImage.image}`
                          }
                          alt="ride"
                          className="Admin-ride-img-thumb"
                          onClick={() =>
                            setPreviewImage(
                              primaryImage.image?.startsWith("http")
                                ? primaryImage.image
                                : `https://api.jaltara.techsofast.com${primaryImage.image}`
                            )
                          }
                          onError={(e) => (e.target.src = "/placeholder.png")}
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>
                    <td className="action-icons">
                      <FaEdit className="edit-icon" onClick={() => handleEdit(ride)} />
                      <FaTrash className="delete-icon" onClick={() => handleDelete(ride.id)} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="Admin-ride-modal-overlay">
          <div className="Admin-ride-modal-box">
            <h3>{editingId ? "Edit Ride" : "Add Ride"}</h3>

            <div className="Admin-ride-form-group">
              <label>Name</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange} />
            </div>

            <div className="Admin-ride-form-group">
              <label>Slug</label>
              <input required type="text" name="slug" value={formData.slug} onChange={handleChange} />
            </div>

            <div className="Admin-ride-form-group">
              <label>Description</label>
              <textarea required name="description" value={formData.description} onChange={handleChange} />
            </div>

            <div className="Admin-ride-form-group">
              <label>Min Age</label>
              <input required type="number" name="min_age" value={formData.min_age} onChange={handleChange} />
            </div>

            <div className="Admin-ride-form-group">
              <label>Max Age</label>
              <input required type="number" name="max_age" value={formData.max_age} onChange={handleChange} />
            </div>

            <div className="Admin-ride-form-group checkbox">
              <label>
                <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} />
                Active
              </label>
            </div>

            <div className="Admin-ride-form-group checkbox">
              <label>
                <input type="checkbox" name="is_adult_only" checked={formData.is_adult_only} onChange={handleChange} />
                Adult Only
              </label>
            </div>

            {/* IMAGE FIELD — only shown when editing, not when adding */}
            {editingId && (
            <div className="Admin-ride-form-group">
              <label>Ride Image</label>
              <input type="file" name="image" accept="image/*" onChange={handleChange} />
              {formData.image_preview && (
                <img src={formData.image_preview} alt="preview" style={{ width: "80px", marginTop: "10px", borderRadius: "6px" }} />
              )}
            </div>
            )}

            <div className="Admin-ride-modal-buttons">
              <button className="Admin-ride-save-btn" onClick={handleSubmit}>Save</button>
              <button className="Admin-ride-cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* IMAGE PREVIEW MODAL */}
      {previewImage && (
        <div className="image-preview-overlay" onClick={() => setPreviewImage(null)}>
          <div className="image-preview-box" onClick={(e) => e.stopPropagation()}>
            <img src={previewImage} alt="preview" />
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState, useEffect } from "react";
import "./AdminHallPage.css";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  getHallsAction,
  createHallAction,
  updateHallAction,
  deleteHallAction,
} from "../../../redux/actions/AdminHallAction";
import { toast } from "react-toastify";

export default function AdminHallPage() {

  const dispatch = useDispatch();
  const { halls, hallLoading } = useSelector((state) => state.hall);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const hallExists = halls?.length > 0;

  const [formData, setFormData] = useState({
    title: "",
    tagline: "",
    description: "",
    capacity: "",
    area: "",
    hall_type: "",
    air_conditioning: false,
    parking: false,
    phone_number: "",
    email: "",
    main_image: null,
    image_preview: "",
  });

  useEffect(() => {
    dispatch(getHallsAction());
  }, [dispatch]);

  const handleChange = (e) => {
  const { name, value, type, checked, files } = e.target;

  if (name === "main_image" && files) {
    setFormData({
      ...formData,
      main_image: files[0],
      image_preview: URL.createObjectURL(files[0]),
    });
    return;
  }

  setFormData({
    ...formData,
    // ✅ FIX — checkbox uses checked, others use value
    [name]: type === "checkbox" ? checked : value,
  });
};

  const handleSubmit = async () => {
  try {
    const form = new FormData();
    form.append("title", formData.title);
    form.append("tagline", formData.tagline);
    form.append("description", formData.description);
    form.append("capacity", formData.capacity);
    form.append("area", formData.area);
    form.append("hall_type", formData.hall_type);
    form.append("air_conditioning", formData.air_conditioning === true ? "true" : "false");
    form.append("parking", formData.parking === true ? "true" : "false");
    form.append("phone_number", formData.phone_number);
    form.append("email", formData.email);
    if (formData.main_image instanceof File) {
      form.append("main_image", formData.main_image);
    }
    if (editId) {
      await dispatch(updateHallAction(editId, form));
    } else {
      await dispatch(createHallAction(form));
    }
    resetForm();
  } catch (err) {
    console.error("❌ Save error:", err);
  }
};

  const handleEdit = (hall) => {
    setFormData({
      title: hall.title || "",
      tagline: hall.tagline || "",
      description: hall.description || "",
      capacity: hall.capacity || "",
      area: hall.area || "",
      hall_type: hall.hall_type || "",
      air_conditioning: Boolean(hall.air_conditioning),
      parking: Boolean(hall.parking),
      phone_number: hall.phone_number || "",
      email: hall.email || "",
      main_image: null,
      image_preview: hall.main_image || "",
    });
    setEditId(hall.id);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this hall?")) {
      dispatch(deleteHallAction(id));
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      tagline: "",
      description: "",
      capacity: "",
      area: "",
      hall_type: "",
      air_conditioning: false,
      parking: false,
      phone_number: "",
      email: "",
      main_image: null,
      image_preview: "",
    });
    setEditId(null);
    setShowModal(false);
  };

  return (
    <div className="admin-hall-container">

      <div className="header-row-hall">
        <h3 className="page-title">Hall Pages</h3>
        <div
          className="add-hall-btn-wrapper"
          onMouseEnter={() => { if (hallExists) setShowTooltip(true); }}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <button
            className={`add-btn ${hallExists ? "add-btn-disabled" : ""}`}
            disabled={hallExists}
            onClick={() => {
              if (hallExists) {
                setShowTooltip(true);
              } else {
                resetForm();
                setShowModal(true);
              }
            }}
          >
            <FaPlus /> Add Hall
          </button>
          {showTooltip && (
            <div className="hall-tooltip">
              Only one hall can be added. Please edit the existing hall.
            </div>
          )}
        </div>
      </div>

      <div className="table-wrapper">
        <table className="categories-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Tagline</th>
              <th>Hall Type</th>
              <th>Capacity</th>
              <th>Area</th>
              <th>AC</th>
              <th>Parking</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Image</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
           
            {hallLoading ? (
              <tr><td colSpan="11" className="no-data">Loading...</td></tr>
            ) : halls?.length === 0 ? (
              <tr><td colSpan="11" className="no-data">No Halls Found</td></tr>
            ) : (
              halls?.map((hall) => (
                <tr key={hall.id}>
                  <td>{hall.title}</td>
                  <td>{hall.tagline}</td>
                  <td>{hall.hall_type}</td>
                  <td>{hall.capacity}</td>
                  <td>{hall.area}</td>
                  <td>{hall.air_conditioning ? "Yes" : "No"}</td>
                  <td>{hall.parking ? "Yes" : "No"}</td>
                  <td>{hall.phone_number}</td>
                  <td>{hall.email}</td>
                  <td>
                    {hall.main_image ? (
                      <img
                        src={
                          hall.main_image?.startsWith("http")
                            ? hall.main_image
                            : `https://api.jaltara.techsofast.com${hall.main_image}`
                        }
                        alt="hall"
                        style={{
                          width: "60px",
                          height: "45px",
                          objectFit: "cover",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                        onClick={() => setPreviewImage(hall.main_image)}
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    ) : "No Image"}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-edit" onClick={() => handleEdit(hall)}>
                        <FaEdit /> Edit
                      </button>
                      {/* <button className="btn-delete" onClick={() => handleDelete(hall.id)}>
                        <FaTrash /> Delete
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3>{editId ? "Edit Hall" : "Add Hall"}</h3>
              <FaTimes className="modal-close" onClick={resetForm} />
            </div>

            <div className="form-group">
              <input name="title" placeholder="Hall Title" value={formData.title} onChange={handleChange} />
            </div>
            <div className="form-group">
              <input name="tagline" placeholder="Tagline" value={formData.tagline} onChange={handleChange} />
            </div>
            <div className="form-group">
              <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
            </div>
            <div className="form-group">
              <input name="hall_type" placeholder="Hall Type (e.g. banquet, conference)" value={formData.hall_type} onChange={handleChange} />
            </div>
            <div className="form-group">
              <input type="number" name="capacity" placeholder="Capacity" value={formData.capacity} onChange={handleChange} />
            </div>
            <div className="form-group">
              <input type="number" name="area" placeholder="Area (sq ft)" value={formData.area} onChange={handleChange} />
            </div>
            <div className="form-group">
              <input name="phone_number" placeholder="Phone Number" value={formData.phone_number} onChange={handleChange} />
            </div>
            <div className="form-group">
              <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Main Image</label>
              <input type="file" name="main_image" accept="image/*" onChange={handleChange} />
              {formData.image_preview && (
                <img
                  src={formData.image_preview}
                  alt="preview"
                  style={{ width: "80px", height: "60px", objectFit: "cover", marginTop: "8px", borderRadius: "6px" }}
                />
              )}
            </div>
            <div className="checkbox-group">
              <label>
                <input type="checkbox" name="air_conditioning" checked={formData.air_conditioning} onChange={handleChange} />
                Air Conditioning
              </label>
            </div>
            <div className="checkbox-group">
              <label>
                <input type="checkbox" name="parking" checked={formData.parking} onChange={handleChange} />
                Parking
              </label>
            </div>

            <div className="modal-buttons">
              <button className="save-btn" onClick={handleSubmit}>{editId ? "Update" : "Save"}</button>
              <button className="cancel-btn" onClick={resetForm}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* IMAGE PREVIEW */}
      {previewImage && (
        <div className="modal-overlay" onClick={() => setPreviewImage(null)}>
          <img
            src={
              previewImage?.startsWith("http")
                ? previewImage
                : `https://api.jaltara.techsofast.com${previewImage}`
            }
            alt="preview"
            style={{ maxWidth: "80vw", maxHeight: "80vh", borderRadius: "10px" }}
          />
        </div>
      )}

    </div>
  );
}
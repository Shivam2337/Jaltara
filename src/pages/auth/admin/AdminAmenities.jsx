import React, { useEffect, useState } from "react";
import "./AdminAmenities.css";

import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  getAmenitiesAction,
  createAmenityAction,
  updateAmenityAction,
  deleteAmenityAction
} from "../../../redux/actions/AdminAmenitiesAction";

const AdminAmenities = () => {

  const dispatch = useDispatch();
  const { amenities } = useSelector((state) => state.amenities);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const amenityLimitReached = amenities?.length >= 4;

  // ✅ CLEAN STATE (NO is_active)
  const [formData, setFormData] = useState({
    name: "",
    image: null,
  });

  // FETCH DATA
  useEffect(() => {
    dispatch(getAmenitiesAction());
  }, [dispatch]);

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // SUBMIT FORM (FORCE ACTIVE)
  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast.warn("Name is required.");
      return;
    }
    if (!editId && !(formData.image instanceof File)) {
      toast.warn("Image is required.");
      return;
    }

    const payload = {
      ...formData,
      is_active: 1,
    };

    if (editId) {
      dispatch(updateAmenityAction(editId, payload));
    } else {
      dispatch(createAmenityAction(payload));
    }

    setFormData({ name: "", image: null });
    setShowModal(false);
    setEditId(null);
  };

  // EDIT
  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      image: item.image,
    });

    setEditId(item.id);
    setShowModal(true);
  };

  return (
    <div className="Admin-amenity-page">

      {/* HEADER */}
      <div className="Admin-amenity-header">
        <h2>Amenities Management</h2>

        <div
          className="amenity-btn-wrapper"
          onMouseEnter={() => { if (amenityLimitReached) setShowTooltip(true); }}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <button
            className={`Admin-amenity-add-btn ${amenityLimitReached ? "amenity-btn-disabled" : ""}`}
            disabled={amenityLimitReached}
            onClick={() => {
              if (amenityLimitReached) return;
              setShowModal(true);
              setEditId(null);
              setFormData({ name: "", image: null });
            }}
          >
            <FaPlus /> Add Amenity
          </button>
          {showTooltip && (
            <div className="amenity-tooltip">
              Maximum 4 amenities allowed. Please edit or delete an existing one.
            </div>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="Admin-amenity-table-container">

        <table className="Admin-amenity-table">

          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {amenities?.length > 0 ? (
              amenities.map((item) => (
                <tr key={item.id}>

                  <td>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="Admin-amenity-img"
                    />
                  </td>

                  <td>{item.name}</td>

                  <td>
                    <div className="Admin-amenity-action-icons">

                      <FaEdit
                        className="Admin-amenity-edit-icon"
                        onClick={() => handleEdit(item)}
                      />

                      <FaTrash
                        className="Admin-amenity-delete-icon"
                        onClick={() => dispatch(deleteAmenityAction(item.id))}
                      />

                    </div>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>
                  No amenities found
                </td>
              </tr>
            )}

          </tbody>

        </table>

      </div>

      {/* MODAL */}
      {showModal && (

        <div className="Admin-amenity-modal-overlay">

          <div className="Admin-amenity-modal">

            <div className="Admin-amenity-modal-header">
              <h3>{editId ? "Edit Amenity" : "Add Amenity"}</h3>

              <FaTimes
                className="Admin-amenity-close-icon"
                onClick={() => setShowModal(false)}
              />
            </div>

            <div className="Admin-amenity-modal-form">

              {/* TITLE */}
              <div className="Admin-amenity-form-group">
                <label>Title</label>
                <input
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                />
              </div>

              {/* IMAGE */}
              <div className="Admin-amenity-form-group">
                <label>Image</label>
                <input
                  type="file"
                  name="image"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      image: e.target.files[0],
                    })
                  }
                />
              </div>

              {/* SAVE BUTTON */}
              <div className="Admin-amenity-modal-buttons">
                <button
                  className="Admin-amenity-save-btn"
                  onClick={handleSubmit}
                >
                  Save
                </button>
              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default AdminAmenities;
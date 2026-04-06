import React, { useEffect, useState } from "react";
import "./AdminAuditorium.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getAuditoriums,
  createAuditorium,
  updateAuditorium,
  deleteAuditorium,
} from "../../../redux/actions/AdminAuditoriumAction";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";

const AdminAuditorium = () => {
  const dispatch = useDispatch();

  const { auditoriums = [] } =
    useSelector((state) => state.auditoriums) || {};

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    area_sq_ft: "",
    capacity: "",
    description: "",
    is_active: true,
  });

  useEffect(() => {
    dispatch(getAuditoriums());
  }, [dispatch]);

  useEffect(() => {
  console.log("auditoriums state:", auditoriums);
  console.log("auditoriums.results:", auditoriums?.results);
}, [auditoriums]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = () => {
    if (editId) {
      dispatch(updateAuditorium(editId, formData));
    } else {
      dispatch(createAuditorium(formData));
    }

    setShowModal(false);
    resetForm();
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setFormData(item);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    dispatch(deleteAuditorium(id));
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({
      name: "",
      area_sq_ft: "",
      capacity: "",
      description: "",
      is_active: true,
    });
  };

  return (
    <div className="Admin-auditorium-page">

      <div className="Admin-auditorium-header">
        <h2>Auditoriums</h2>

        <button
          className="Admin-auditorium-add-btn"
          onClick={() => setShowModal(true)}
        >
          <FaPlus /> Add Auditorium
        </button>
      </div>

      <div className="Admin-auditorium-table-container">
        <table className="Admin-auditorium-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Area</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

         <tbody>
          {(auditoriums?.results || []).map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.area_sq_ft} sq ft</td>
              <td>{item.capacity}</td>
              <td>{item.is_active ? "Active" : "Inactive"}</td>

              <td>
                <div className="Admin-auditorium-actions">
                  <FaEdit
                    className="Admin-auditorium-edit"
                    onClick={() => handleEdit(item)}
                  />
                  <FaTrash
                    className="Admin-auditorium-delete"
                    onClick={() => handleDelete(item.id)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="Admin-auditorium-modal-overlay">
          <div className="Admin-auditorium-modal">

            <div className="Admin-auditorium-modal-header">
              <h3>{editId ? "Edit" : "Add"} Auditorium</h3>
              <FaTimes
                onClick={() => setShowModal(false)}
                className="Admin-auditorium-close"
              />
            </div>

            <div className="Admin-auditorium-form">

              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
              />

              <input
                type="number"
                name="area_sq_ft"
                placeholder="Area (sq ft)"
                value={formData.area_sq_ft}
                onChange={handleChange}
              />

              <input
                type="number"
                name="capacity"
                placeholder="Capacity"
                value={formData.capacity}
                onChange={handleChange}
              />

              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
              />

              <label>
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                />
                Active
              </label>

              <button
                className="Admin-auditorium-save"
                onClick={handleSubmit}
              >
                Save
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAuditorium;
import React, { useEffect, useState } from "react";
import "./AdminAuditoriumPricing.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getAuditoriumPricing,
  createAuditoriumPricing,
  updateAuditoriumPricing,
  deleteAuditoriumPricing,
  getAuditoriumsList,
} from "../../../redux/actions/AdminAuditoriumPricingAction";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";

const AdminAuditoriumPricing = () => {
  const dispatch = useDispatch();

  const { pricing = [], auditoriums = [] } =
    useSelector((state) => state.auditoriumPricing) || {};

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    auditorium: "",
    date: "",
    base_price: "",
  });

  useEffect(() => {
    dispatch(getAuditoriumPricing());
    dispatch(getAuditoriumsList());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (!formData.auditorium || !formData.date) {
      return alert("All fields required");
    }

    if (editId) {
      dispatch(updateAuditoriumPricing(editId, formData));
    } else {
      dispatch(createAuditoriumPricing(formData));
    }

    setShowModal(false);
    resetForm();
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setFormData({
      auditorium: item.auditorium,
      date: item.date,
      base_price: item.base_price,
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    dispatch(deleteAuditoriumPricing(id));
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({
      auditorium: "",
      date: "",
      base_price: "",
    });
  };

  return (
    <div className="Admin-auditorium-pricing-page">

      <div className="Admin-auditorium-pricing-header">
        <h2>Auditorium Pricing</h2>

        <button
          className="Admin-auditorium-pricing-add-btn"
          onClick={() => setShowModal(true)}
        >
          <FaPlus /> Add Pricing
        </button>
      </div>

      <div className="Admin-auditorium-pricing-table-container">
        <table className="Admin-auditorium-pricing-table">
          <thead>
            <tr>
              <th>Auditorium</th>
              <th>Date</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
          {(pricing || []).map((item) => (
            <tr key={item.id}>
              <td>
                {(auditoriums?.results || []).find(
                  (a) => a.id === item.auditorium
                )?.name || item.auditorium}
              </td>

              <td>{item.date}</td>
              <td>₹{item.base_price}</td>

              <td>
                <div className="Admin-auditorium-pricing-actions">
                  <FaEdit onClick={() => handleEdit(item)} />
                  <FaTrash onClick={() => handleDelete(item.id)} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="Admin-auditorium-pricing-modal-overlay">
          <div className="Admin-auditorium-pricing-modal">

            <div className="Admin-auditorium-pricing-modal-header">
              <h3>{editId ? "Edit" : "Add"} Pricing</h3>
              <FaTimes onClick={() => setShowModal(false)} />
            </div>

            <div className="Admin-auditorium-pricing-form">

              <select
                name="auditorium"
                value={formData.auditorium}
                onChange={handleChange}
                >
                <option value="">Select Auditorium</option>

                {auditoriums && auditoriums.length > 0 ? (
                    auditoriums.map((a) => (
                    <option key={a.id} value={a.id}>
                        {a.name}
                    </option>
                    ))
                ) : (
                    <option disabled>No Auditoriums Found</option>
                )}
                </select>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />

              <input
                type="number"
                name="base_price"
                placeholder="Base Price"
                value={formData.base_price}
                onChange={handleChange}
              />

              <button
                className="Admin-auditorium-pricing-save"
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

export default AdminAuditoriumPricing;
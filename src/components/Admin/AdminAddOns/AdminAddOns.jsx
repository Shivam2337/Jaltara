import React, { useEffect, useState } from "react";
import "./AdminAddOns.css";

import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

import {
  getAddOnsAction,
  createAddOnAction,
  updateAddOnAction,
  deleteAddOnAction
} from "../../../redux/actions/AdminAddOnsAction";

const AdminAddOns = () => {

  const dispatch = useDispatch();

  const { addons, loading, error } = useSelector((state) => state.addons);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    addon_type: "ride",
    is_per_person: true,
    is_active: true
  });

  useEffect(() => {
    dispatch(getAddOnsAction());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = () => {

    if (editId) {
      dispatch(updateAddOnAction(editId, formData));
    } else {
      dispatch(createAddOnAction(formData));
    }

    setShowModal(false);
    setEditId(null);
  };

  const handleEdit = (addon) => {

    setFormData(addon);
    setEditId(addon.id);
    setShowModal(true);

  };

  return (
    <div className="Admin-add-package-page">

      {/* HEADER */}

      <div className="Admin-add-package-header">
        

        <button
          className="Admin-add-add-btn"
          onClick={() => setShowModal(true)}
        >
          <FaPlus /> Add AddOn
        </button>
      </div>

      {/* TABLE */}

      <div className="Admin-add-table-container">

        <table className="Admin-add-package-table">

          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Per Person</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {loading ? (
              <tr>
                <td colSpan="5" className="addon-state-cell">
                  <div className="addon-state-wrapper">
                    <div className="addon-spinner" />
                    <span>Loading add-ons...</span>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="5" className="addon-state-cell addon-error-state">
                  <div className="addon-state-wrapper">⚠️ Failed to load add-ons. Please try again.</div>
                </td>
              </tr>
            ) : !addons?.length ? (
              <tr>
                <td colSpan="5" className="addon-state-cell">
                  <div className="addon-state-wrapper">🧩 No Add-Ons Found</div>
                </td>
              </tr>
            ) : (
              addons.map((addon) => (

              <tr key={addon.id}>

                <td>{addon.name}</td>
                <td>{addon.addon_type}</td>

                <td>
                  {addon.is_per_person ? "Yes" : "No"}
                </td>

                <td>
                  {addon.is_active ? "Active" : "Inactive"}
                </td>

                <td>
                  <div className="Admin-add-action-icons">

                    <FaEdit
                      className="Admin-add-edit-icon"
                      onClick={() => handleEdit(addon)}
                    />

                    <FaTrash
                      className="Admin-add-delete-icon"
                      onClick={() => dispatch(deleteAddOnAction(addon.id))}
                    />

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

        <div className="Admin-add-modal-overlay">

          <div className="Admin-add-modal">

            <div className="Admin-add-modal-header">
              <h3>Add Add-On</h3>

              <FaTimes
                className="Admin-add-close-icon"
                onClick={() => setShowModal(false)}
              />

            </div>

            <div className="Admin-add-modal-form">

              <div className="Admin-add-form-group">
                <label>Name</label>

                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="Admin-add-form-group">
                <label>Type</label>

                <select
                  name="addon_type"
                  value={formData.addon_type}
                  onChange={handleChange}
                >
                  <option value="ride">Ride</option>
                  <option value="meal">Meal</option>
                  <option value="locker">Locker</option>
                  <option value="costume">Costume</option>
                </select>

              </div>

              <div className="Admin-add-form-group">

                <label>
                  <input
                    type="checkbox"
                    name="is_per_person"
                    checked={formData.is_per_person}
                    onChange={handleChange}
                  />

                  Per Person
                </label>

              </div>

              <div className="Admin-add-form-group">

                <label>
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                  />

                  Active
                </label>

              </div>

              <div className="Admin-add-modal-buttons">

                <button
                  className="Admin-add-save-btn"
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

export default AdminAddOns;
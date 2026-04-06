import React, { useEffect, useState } from "react";
import "./AdminTicketType.css";

import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

import {
  getTicketTypesAction,
  createTicketTypeAction,
  updateTicketTypeAction,
  deleteTicketTypeAction
} from "../../../redux/actions/AdminTicketTypeAction";
import { toast } from "react-toastify";

const AdminTicketType = () => {

  const dispatch = useDispatch();

  const { ticketTypes, loading, error } = useSelector((state) => state.ticketTypes);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    duration_hours: "",
    includes_meal: false,
    includes_stay: false,
    max_capacity_per_slot: "",
    entry_anytime: true,
    is_active: true
  });

  useEffect(() => {
    dispatch(getTicketTypesAction());
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
      dispatch(updateTicketTypeAction(editId, formData));
    } else {
      dispatch(createTicketTypeAction(formData));
    }

    resetForm();

  };

  const resetForm = () => {

    setFormData({
      name: "",
      duration_hours: "",
      includes_meal: false,
      includes_stay: false,
      max_capacity_per_slot: "",
      entry_anytime: false,
      is_active: false
    });

    setEditId(null);
    setShowModal(false);

  };

  const handleEdit = (ticket) => {

    setFormData({
      name: ticket.name || "",
      duration_hours: ticket.duration_hours || "",
      includes_meal: ticket.includes_meal || false,
      includes_stay: ticket.includes_stay || false,
      max_capacity_per_slot: ticket.max_capacity_per_slot || "",
      entry_anytime: ticket.entry_anytime || false,
      is_active: ticket.is_active || false
    });

    setEditId(ticket.id);
    setShowModal(true);

  };

  const handleAddNew = () => {

    resetForm();
    setShowModal(true);

  };

  return (

    <div className="Admin-ticket-page">

      <div className="Admin-ticket-header">

        <button
          className="Admin-ticket-add-btn"
          onClick={handleAddNew}
        >
          <FaPlus/> Add Ticket
        </button>

      </div>

      <div className="Admin-ticket-table-container">

        <table className="Admin-ticket-table">

          <thead>

            <tr>
              <th>Name</th>
              <th>Duration</th>
              <th>Meal</th>
              <th>Stay</th>
              <th>Capacity</th>
              <th>Entry</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>

          </thead>

          <tbody>

            {loading ? (
              <tr>
                <td colSpan="8" className="ticket-state-cell">
                  <div className="ticket-state-wrapper">
                    <div className="ticket-spinner" />
                    <span>Loading ticket types...</span>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="8" className="ticket-state-cell ticket-error-state">
                  <div className="ticket-state-wrapper">⚠️ Failed to load ticket types. Please try again.</div>
                </td>
              </tr>
            ) : !ticketTypes?.length ? (
              <tr>
                <td colSpan="8" className="ticket-state-cell">
                  <div className="ticket-state-wrapper">🎫 No Ticket Types Found</div>
                </td>
              </tr>
            ) : (
              ticketTypes.map((ticket) => (

              <tr key={ticket.id}>

                <td>{ticket.name}</td>
                <td>{ticket.duration_hours} hrs</td>
                <td>{ticket.includes_meal ? "Yes" : "No"}</td>
                <td>{ticket.includes_stay ? "Yes" : "No"}</td>
                <td>{ticket.max_capacity_per_slot}</td>
                <td>{ticket.entry_anytime ? "Anytime" : "Fixed"}</td>
                <td>{ticket.is_active ? "Active" : "Inactive"}</td>

                <td>

                  <div className="Admin-ticket-actions">

                    <FaEdit
                      className="Admin-ticket-edit"
                      onClick={() => handleEdit(ticket)}
                    />

                    <FaTrash
                      className="Admin-ticket-delete"
                      onClick={() =>
                        dispatch(deleteTicketTypeAction(ticket.id))
                      }
                    />

                  </div>

                </td>

              </tr>

            ))
            )}

          </tbody>

        </table>

      </div>

      {showModal && (

        <div className="Admin-ticket-modal-overlay">

          <div className="Admin-ticket-modal">

            <div className="Admin-ticket-modal-header">

              <h3>{editId ? "Edit Ticket Type" : "Add Ticket Type"}</h3>

              <FaTimes
                className="Admin-ticket-close"
                onClick={() => setShowModal(false)}
              />

            </div>

            <form className="Admin-ticket-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>

              <input
                name="name"
                placeholder="Ticket Name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                name="duration_hours"
                placeholder="Duration Hours"
                value={formData.duration_hours}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                name="max_capacity_per_slot"
                placeholder="Capacity per Slot"
                value={formData.max_capacity_per_slot}
                onChange={handleChange}
                required
              />

              <label>
                <input
                  type="checkbox"
                  name="includes_meal"
                  checked={formData.includes_meal}
                  onChange={handleChange}
                />
                Includes Meal
              </label>

              <label>
                <input
                  type="checkbox"
                  name="includes_stay"
                  checked={formData.includes_stay}
                  onChange={handleChange}
                />
                Includes Stay
              </label>

              <label>
                <input
                  type="checkbox"
                  name="entry_anytime"
                  checked={formData.entry_anytime}
                  onChange={handleChange}
                />
                Entry Anytime
              </label>

              <label>
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                />
                Active
              </label>

              <div className="Admin-ticket-modal-buttons">

                <button
                  type="submit"
                  className="Admin-ticket-save-btn"
                >
                  {editId ? "Update" : "Save"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>

  );

};

export default AdminTicketType;
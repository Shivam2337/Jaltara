import React, { useEffect, useState } from "react";
import "./AdminTicketPricing.css";

import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

import {
  getTicketPricingAction,
  createTicketPricingAction,
  updateTicketPricingAction,
  deleteTicketPricingAction
} from "../../../redux/actions/AdminTicketPricingAction";

import AdminAPI from "../../../BaseAPI/AdminAPI";

const AdminTicketPricing = () => {

  const dispatch = useDispatch();

  const { ticketPricing, loading, error } = useSelector((state) => state.ticketPricing);
   const [ticketTypes, setTicketTypes] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    ticket_type: "",
    start_date: "",
    end_date: "",
    adult_price: "",
    child_price: "",
    senior_price: "",
    weekend_adult_price: "",
    weekend_child_price: "",
    weekend_senior_price: "",
    group_price: "",
    group_discount_percent: "",
    group_min_size: ""
  });

  // ✅ CHANGE 3 — Added fetchTicketTypes inside useEffect
  useEffect(() => {
    dispatch(getTicketPricingAction());

    const fetchTicketTypes = async () => {
      try {
        const { data } = await AdminAPI.get("catalog/admin/ticket-types/");
        setTicketTypes(data.results || data);
        console.log("Ticket types:", data);
      } catch (err) {
        console.error("Ticket types fetch error:", err);
      }
    };

    fetchTicketTypes();
  }, [dispatch]);

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

  };

  const handleSubmit = () => {

    if (editId) {
      dispatch(updateTicketPricingAction(editId, formData));
    } else {
      dispatch(createTicketPricingAction(formData));
    }

    resetForm();

  };

  const resetForm = () => {

    setFormData({
      ticket_type: "",
      start_date: "",
      end_date: "",
      adult_price: "",
      child_price: "",
      senior_price: "",
      weekend_adult_price: "",
      weekend_child_price: "",
      weekend_senior_price: "",
      group_price: "",
      group_discount_percent: "",
      group_min_size: ""
    });

    setEditId(null);
    setShowModal(false);

  };

  const handleEdit = (item) => {

    setFormData({
      ticket_type: item.ticket_type,
      start_date: item.start_date,
      end_date: item.end_date,
      adult_price: item.adult_price,
      child_price: item.child_price,
      senior_price: item.senior_price,
      weekend_adult_price: item.weekend_adult_price,
      weekend_child_price: item.weekend_child_price,
      weekend_senior_price: item.weekend_senior_price,
      group_price: item.group_price,
      group_discount_percent: item.group_discount_percent,
      group_min_size: item.group_min_size
    });

    setEditId(item.id);
    setShowModal(true);

  };

  return (

    <div className="Admin-ticket-pricing-page">

      <div className="Admin-ticket-pricing-header">

        <button
          className="Admin-ticket-pricing-add-btn"
          onClick={() => setShowModal(true)}
        >
          <FaPlus /> Add Pricing
        </button>

      </div>

      <div className="Admin-ticket-pricing-table-container">

        <table className="Admin-ticket-pricing-table">

          <thead>

            <tr>
              <th>Ticket</th>
              <th>Start</th>
              <th>End</th>
              <th>Adult</th>
              <th>Child</th>
              <th>Senior</th>
              <th>Weekend Adult Price</th>
              <th>Weekend child Price</th>
              <th>Weekend senior Price</th>
              <th>Group Price</th>
              <th>Group %</th>
              <th>Min Size</th>
              <th>Actions</th>
            </tr>

          </thead>

          <tbody>

            {loading ? (
              <tr>
                <td colSpan="13" className="ticket-state-cell">
                  <div className="ticket-state-wrapper">
                    <div className="ticket-spinner" />
                    <span>Loading pricing...</span>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="13" className="ticket-state-cell ticket-error-state">
                  <div className="ticket-state-wrapper">⚠️ Failed to load pricing. Please try again.</div>
                </td>
              </tr>
            ) : !ticketPricing?.length ? (
              <tr>
                <td colSpan="13" className="ticket-state-cell">
                  <div className="ticket-state-wrapper">💰 No Pricing Found</div>
                </td>
              </tr>
            ) : (
              ticketPricing.map((item) => (

              <tr key={item.id}>

                <td>{item.ticket_name}</td>
                <td>{item.start_date}</td>
                <td>{item.end_date}</td>
                <td>{item.adult_price}</td>
                <td>{item.child_price}</td>
                <td>{item.senior_price}</td>
                <td>{item.weekend_adult_price}</td>
                <td>{item.weekend_child_price}</td>
                <td>{item.weekend_senior_price}</td>
                <td>{item.group_price}</td>
                <td>{item.group_discount_percent}%</td>
                <td>{item.group_min_size}</td>

                <td>

                  <div className="Admin-ticket-pricing-actions">

                    <FaEdit
                      className="Admin-ticket-pricing-edit"
                      onClick={() => handleEdit(item)}
                    />

                    <FaTrash
                      className="Admin-ticket-pricing-delete"
                      onClick={() =>
                        dispatch(deleteTicketPricingAction(item.id))
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

        <div className="Admin-ticket-pricing-modal-overlay">

          <div className="Admin-ticket-pricing-modal">

            <div className="Admin-ticket-pricing-modal-header">

              <h3>{editId ? "Edit Pricing" : "Add Pricing"}</h3>

              <FaTimes
                className="Admin-ticket-pricing-close"
                onClick={() => setShowModal(false)}
              />

            </div>

            <form className="Admin-ticket-pricing-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>

              <select
                name="ticket_type"
                value={formData.ticket_type}
                onChange={handleChange}
                required
              >
                <option value="">Select Ticket Type</option>
                {ticketTypes?.map((ticket) => (
                  <option key={ticket.id} value={ticket.id}>
                    {ticket.name}
                  </option>
                ))}
              </select>

              <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} required />
              <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} required />

              <input type="number" name="adult_price" placeholder="Adult Price" value={formData.adult_price} onChange={handleChange} required />
              <input type="number" name="child_price" placeholder="Child Price" value={formData.child_price} onChange={handleChange} required />
              <input type="number" name="senior_price" placeholder="Senior Price" value={formData.senior_price} onChange={handleChange}/>

              <input type="number" name="weekend_adult_price" placeholder="Weekend Adult Price" value={formData.weekend_adult_price} onChange={handleChange} />
              <input type="number" name="weekend_child_price" placeholder="Weekend Child Price" value={formData.weekend_child_price} onChange={handleChange} />
              <input type="number" name="weekend_senior_price" placeholder="Weekend Senior Price" value={formData.weekend_senior_price} onChange={handleChange} />

              <input type="number" name="group_price" placeholder="Group Price" value={formData.group_price} onChange={handleChange}/>
              <input type="number" name="group_discount_percent" placeholder="Group Discount %" value={formData.group_discount_percent} onChange={handleChange} required />
              <input type="number" name="group_min_size" placeholder="Group Min Size" value={formData.group_min_size} onChange={handleChange} required />

              <div className="Admin-ticket-pricing-modal-buttons">

                <button
                  type="submit"
                  className="Admin-ticket-pricing-save-btn"
                >
                  Save
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>

  );

};

export default AdminTicketPricing;
import React, { useEffect, useState } from "react";
import "./AdminAddOnsPricing.css";

import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

import {
  getAddOnPricingAction,
  createAddOnPricingAction,
  updateAddOnPricingAction,
  deleteAddOnPricingAction
} from "../../../redux/actions/AdminAddOnPricingAction";

import AdminAPI from "../../../BaseAPI/AdminAPI";

const AdminAddOnPricing = () => {

  const dispatch = useDispatch();

  const { pricings, loading, error } = useSelector((state) => state.addonPricing);

  const [addons, setAddons] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    addon: "",
    start_date: "",
    end_date: "",
    price: ""
  });

  useEffect(() => {

    dispatch(getAddOnPricingAction());

    /* FETCH ADDONS FOR DROPDOWN */

    const fetchAddons = async () => {
      const { data } = await AdminAPI.get("catalog/admin/addons/");
      setAddons(data);
    };

    fetchAddons();

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
      dispatch(updateAddOnPricingAction(editId, formData));
    } else {
      dispatch(createAddOnPricingAction(formData));
    }

    setShowModal(false);
    setEditId(null);

  };

  const handleEdit = (item) => {

    setFormData({
      addon: item.addon,
      start_date: item.start_date,
      end_date: item.end_date,
      price: item.price
    });

    setEditId(item.id);
    setShowModal(true);

  };

  return (

    <div className="Admin-addons-pricing-page">

      <div className="Admin-addons-pricing-header">

        <button
          className="Admin-addons-pricing-btn"
          onClick={() => setShowModal(true)}
        >
          <FaPlus/> Add Pricing
        </button>

      </div>

      <div className="Admin-addons-pricing-container">

        <table className="Admin-addons-pricing-table">

          <thead>
            <tr>
              <th>AddOn</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {loading ? (
              <tr>
                <td colSpan="5" className="addon-state-cell">
                  <div className="addon-state-wrapper">
                    <div className="addon-spinner" />
                    <span>Loading pricing...</span>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="5" className="addon-state-cell addon-error-state">
                  <div className="addon-state-wrapper">⚠️ Failed to load pricing. Please try again.</div>
                </td>
              </tr>
            ) : !pricings?.length ? (
              <tr>
                <td colSpan="5" className="addon-state-cell">
                  <div className="addon-state-wrapper">💰 No Pricing Found</div>
                </td>
              </tr>
            ) : (
              pricings.map((item) => (

              <tr key={item.id}>

                <td>{item.addon_name || item.addon}</td>
                <td>{item.start_date}</td>
                <td>{item.end_date}</td>
                <td>₹{item.price}</td>

                <td>

                  <div className="Admin-addons-pricing-icons">

                    <FaEdit
                      className="Admin-addons-pricing-icon"
                      onClick={() => handleEdit(item)}
                    />

                    <FaTrash
                      className="Admin-addons-pricing-icon"
                      onClick={() =>
                        dispatch(deleteAddOnPricingAction(item.id))
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

      {/* MODAL */}

      {showModal && (

        <div className="Admin-addons-pricing-modal-overlay">

          <div className="Admin-addons-pricing-modal">

            <div className="Admin-addons-pricing-modal-header">

              <h3>Add AddOn Pricing</h3>

              <FaTimes
                className="Admin-addons-pricing-close-icon"
                onClick={() => setShowModal(false)}
              />

            </div>

            <div className="Admin-addons-pricing-modal-form">

              <div className="Admin-addons-pricing-form-group">

                <label>AddOn</label>

                <select
                  name="addon"
                  value={formData.addon}
                  onChange={handleChange}
                >

                  <option value="">Select AddOn</option>

                  {addons.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}

                </select>

              </div>

              <div className="Admin-addons-pricing-form-group">

                <label>Start Date</label>

                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                />

              </div>

              <div className="Admin-addons-pricing-form-group">

                <label>End Date</label>

                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                />

              </div>

              <div className="Admin-addons-pricing-form-group">

                <label>Price</label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                />

              </div>

              <div className="Admin-addons-pricing-modal-buttons">

                <button
                  className="Admin-addons-pricing-save-btn"
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

export default AdminAddOnPricing;
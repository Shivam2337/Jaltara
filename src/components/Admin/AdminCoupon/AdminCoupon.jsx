import React, { useEffect, useState } from "react";
import "./AdminCoupon.css";

import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

import {
  getCouponAction,
  createCouponAction,
  updateCouponAction,
  deleteCouponAction
} from "../../../redux/actions/AdminCouponAction";

const AdminCoupon = () => {

  const dispatch = useDispatch();

  const { coupons, loading, error } = useSelector((state) => state.coupons);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    code: "",
    discount_type: "percentage",
    discount_value: "",
    max_discount: "",
    min_amount: "",
    valid_from: "",
    valid_to: "",
    is_active: true
  });

  useEffect(() => {
    dispatch(getCouponAction());
  }, [dispatch]);

  /* HANDLE CHANGE */
  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });

  };

  /* FORMAT DATETIME FOR INPUT */
  const formatDateTime = (value) => {
    return value ? value.slice(0, 16) : "";
  };

  /* SUBMIT */
  const handleSubmit = () => {

    if (editId) {
      dispatch(updateCouponAction(editId, formData));
    } else {
      dispatch(createCouponAction(formData));
    }

    resetForm();

  };

  /* RESET FORM */
  const resetForm = () => {

    setFormData({
      code: "",
      discount_type: "percentage",
      discount_value: "",
      max_discount: "",
      min_amount: "",
      valid_from: "",
      valid_to: "",
      is_active: true
    });

    setEditId(null);
    setShowModal(false);

  };

  /* EDIT */
  const handleEdit = (item) => {

    setFormData({
      code: item.code,
      discount_type: item.discount_type,
      discount_value: item.discount_value,
      max_discount: item.max_discount || "",
      min_amount: item.min_amount,
      valid_from: formatDateTime(item.valid_from),
      valid_to: formatDateTime(item.valid_to),
      is_active: item.is_active
    });

    setEditId(item.id);
    setShowModal(true);

  };

  /* DELETE */
  const handleDelete = (id) => {

    if (window.confirm("Are you sure you want to delete this coupon?")) {
      dispatch(deleteCouponAction(id));
    }

  };

  return (

    <div className="Admin-coupon-page">

      {/* HEADER */}
      <div className="Admin-coupon-header">

        <h2>Coupons</h2>

        <button
          className="Admin-coupon-add-btn"
          onClick={() => setShowModal(true)}
        >
          <FaPlus /> Add Coupon
        </button>

      </div>

      {/* LOADING / ERROR */}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* TABLE */}
      <div className="Admin-coupon-table-container">

        <table className="Admin-coupon-table">

          <thead>
            <tr>
              <th>Code</th>
              <th>Type</th>
              <th>Value</th>
              <th>Max</th>
              <th>Min Amt</th>
              <th>Validity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {coupons?.length > 0 ? (

              coupons.map((item) => {

                const isExpired = new Date(item.valid_to) < new Date();

                return (

                  <tr key={item.id}>

                    <td>{item.code}</td>

                    <td>
                      {item.discount_type === "percentage" ? "Percentage" : "Flat"}
                    </td>

                    <td>
                      {item.discount_type === "percentage"
                        ? `${item.discount_value}%`
                        : `₹${item.discount_value}`}
                    </td>

                    <td>{item.max_discount || "-"}</td>

                    <td>₹{item.min_amount}</td>

                    <td>
                      {item.valid_from?.slice(0, 10)} <br />
                      {item.valid_to?.slice(0, 10)}
                    </td>

                    <td>
                      {isExpired ? "Expired" : item.is_active ? "Active" : "Inactive"}
                    </td>

                    <td>

                      <div className="Admin-coupon-actions">

                        <FaEdit
                          className="Admin-coupon-edit"
                          onClick={() => handleEdit(item)}
                        />

                        <FaTrash
                          className="Admin-coupon-delete"
                          onClick={() => handleDelete(item.id)}
                        />

                      </div>

                    </td>

                  </tr>

                );

              })

            ) : (

              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No Coupons Found
                </td>
              </tr>

            )}

          </tbody>

        </table>

      </div>

      {/* MODAL */}
      {showModal && (

        <div className="Admin-coupon-modal-overlay">

          <div className="Admin-coupon-modal">

            <div className="Admin-coupon-modal-header">

              <h3>{editId ? "Edit Coupon" : "Add Coupon"}</h3>

              <FaTimes
                className="Admin-coupon-close"
                onClick={() => setShowModal(false)}
              />

            </div>

            <div className="Admin-coupon-form">

              <input
                name="code"
                placeholder="Coupon Code"
                value={formData.code}
                onChange={handleChange}
              />

              <select
                name="discount_type"
                value={formData.discount_type}
                onChange={handleChange}
              >
                <option value="percentage">Percentage</option>
                <option value="flat">Flat</option>
              </select>

              <input
                type="number"
                name="discount_value"
                placeholder="Discount Value"
                value={formData.discount_value}
                onChange={handleChange}
              />

              <input
                type="number"
                name="max_discount"
                placeholder="Max Discount"
                value={formData.max_discount}
                onChange={handleChange}
              />

              <input
                type="number"
                name="min_amount"
                placeholder="Minimum Amount"
                value={formData.min_amount}
                onChange={handleChange}
              />

              <input
                type="datetime-local"
                name="valid_from"
                value={formData.valid_from}
                onChange={handleChange}
              />

              <input
                type="datetime-local"
                name="valid_to"
                value={formData.valid_to}
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

              <div className="Admin-coupon-modal-buttons">

                <button
                  className="Admin-coupon-save-btn"
                  onClick={handleSubmit}
                >
                  {editId ? "Update" : "Save"}
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default AdminCoupon;
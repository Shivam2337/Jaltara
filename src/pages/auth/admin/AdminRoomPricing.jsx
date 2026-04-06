import React, { useState, useEffect } from "react";
import "./AdminRoomPricing.css";
import { FaPlus, FaEdit, FaTrash, FaFilter,FaTimes,FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

import {
  getPricingAction,
  addPricingAction,
  editPricingAction,
  deletePricingAction
} from "../../../redux/actions/AdminRoomPricingAction";

import { getCategoriesAction } from "../../../redux/actions/AdminRoomCategoriesAction";

const AdminRoomPricing = () => {

  const dispatch = useDispatch();

  /* ================= REDUX STATE ================= */

  const pricingState = useSelector((state) => state.pricing);
  const pricing = pricingState?.pricing || [];
  const loading = pricingState?.loading || false;
  const error = pricingState?.error || null;

  const categoryState = useSelector((state) => state.categories);
  const categories = categoryState?.categories || [];

  /* ================= LOCAL STATE ================= */

  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    category: "",
    start_date: "",
    end_date: "",
    base_price: "",
    extra_adult_price: "",
    extra_child_price: "",
    meal_plan: "",
    weekend_price: "",
    seasonal_discount_percent: ""
  });

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    dispatch(getPricingAction());
    dispatch(getCategoriesAction());
  }, [dispatch]);

  /* ================= HANDLE INPUT ================= */

  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });

  };

  /* ================= SUBMIT ================= */

  const handleSubmit = (e) => {

    e.preventDefault();

    if (!formData.category || !formData.start_date || !formData.end_date || !formData.base_price) {
      alert("Please fill all required fields");
      return;
    }

    const payload = {
      category: parseInt(formData.category),
      start_date: formData.start_date,
      end_date: formData.end_date,
      base_price: parseFloat(formData.base_price),
      extra_adult_price: parseFloat(formData.extra_adult_price || 0),
      extra_child_price: parseFloat(formData.extra_child_price || 0),
      meal_plan: formData.meal_plan || null,
      weekend_price: parseFloat(formData.weekend_price),
      seasonal_discount_percent: parseFloat(formData.seasonal_discount_percent || 0)
    };

    if (editId) {
      dispatch(editPricingAction(editId, payload));
    } else {
      dispatch(addPricingAction(payload));
    }

    resetForm();

  };

  /* ================= EDIT ================= */

  const handleEdit = (item) => {

    setFormData({
      category: item.category || "",
      start_date: item.start_date || "",
      end_date: item.end_date || "",
      base_price: item.base_price || "",
      extra_adult_price: item.extra_adult_price || "",
      extra_child_price: item.extra_child_price || "",
      meal_plan: item.meal_plan || "",
      weekend_price: item.weekend_price || "",
      seasonal_discount_percent: item.seasonal_discount_percent || ""
    });

    setEditId(item.id);
    setShowModal(true);

  };

  /* ================= DELETE ================= */

  const handleDelete = (id) => {

    if (window.confirm("Delete this pricing?")) {
      dispatch(deletePricingAction(id));
    }

  };

  /* ================= RESET ================= */

  const resetForm = () => {

    setFormData({
      category: "",
      start_date: "",
      end_date: "",
      base_price: "",
      extra_adult_price: "",
      extra_child_price: "",
      meal_plan: "",
      is_weekend: false,
      seasonal_discount_percent: ""
    });

    setEditId(null);
    setShowModal(false);

  };

  /* ================= SEARCH ================= */

  console.log("Pricing Data:", pricing);

 const filteredPricing = (pricing || []).filter((item) =>
  item.category_name
    ?.toLowerCase()
    .includes(searchTerm.toLowerCase())
);
  /* ================= UI ================= */

  return (

    <div className="pricing-container">

      {/* SEARCH */}

      

      {/* HEADER */}

      <div className="header-row-pricing">
        <div className="header-actions">
          <div className="search-row-pricing">
            <FaSearch />
            <input
              type="text"
              placeholder="Search by Category"
              className="search-input"
              value={searchTerm}
              onChange={(e)=>setSearchTerm(e.target.value)}
            />

          </div>

          <button
            className="add-btn"
            onClick={() => setShowModal(true)}
          >
            <FaPlus className="add-icon"/> Add Pricing
          </button>

          <button className="filter-btn">
            <FaFilter /> Filter
          </button>

        </div>

      </div>


      {/* TABLE */}

      <div className="table-wrapper">

        <table className="pricing-table">

          <thead>
            <tr>
              <th>Category</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Base</th>
              <th>Adult</th>
              <th>Child</th>
              <th>Meal</th>
              <th>Weekend</th>
              <th>Discount</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {loading ? (

              <tr>
                <td colSpan="10" className="no-data">
                  Loading Pricing...
                </td>
              </tr>

            ) : error ? (

              <tr>
                <td colSpan="10" className="no-data">
                  Error: {error}
                </td>
              </tr>

            ) : filteredPricing.length === 0 ? (

              <tr>
                <td colSpan="10" className="no-data">No Pricing Added</td>
              </tr>

            ) : (

              filteredPricing.map((item) => (

                <tr key={item.id}>

                  <td>
                    {categories.find((cat) => cat.id === item.category)?.name || item.category}
                  </td>

                  <td>{item.start_date}</td>
                  <td>{item.end_date}</td>
                  <td>{item.base_price}</td>
                  <td>{item.extra_adult_price}</td>
                  <td>{item.extra_child_price}</td>
                  <td>{item.meal_plan}</td>
                  <td>{item.weekend_price}</td>
                  <td>{item.seasonal_discount_percent}%</td>

                  <td>

                    <div className="action-buttons">

                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(item)}
                      >
                        <FaEdit /> Edit
                      </button>

                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(item.id)}
                      >
                        <FaTrash /> Delete
                      </button>

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
  <h3>{editId ? "Edit Category" : "Add Category"}</h3>

  <FaTimes
    className="modal-close"
    onClick={resetForm}
  />
</div>

            <form onSubmit={handleSubmit}>

              <div className="form-grid">

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>

                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                />

                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  required
                />

                <input
                  type="number"
                  name="base_price"
                  placeholder="Base Price"
                  value={formData.base_price}
                  onChange={handleChange}
                  required
                />

                <input
                  type="number"
                  name="extra_adult_price"
                  placeholder="Extra Adult Price"
                  value={formData.extra_adult_price}
                  onChange={handleChange}
                />

                <input
                  type="number"
                  name="extra_child_price"
                  placeholder="Extra Child Price"
                  value={formData.extra_child_price}
                  onChange={handleChange}
                />

                <select
                  name="meal_plan"
                  value={formData.meal_plan}
                  onChange={handleChange}
                >
                  <option value="">Select Meal Plan</option>
                  <option value="room_only">Room Only</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="full_board">Full Board</option>
                </select>

                <input
                  type="number"
                  name="seasonal_discount_percent"
                  placeholder="Discount %"
                  value={formData.seasonal_discount_percent}
                  onChange={handleChange}
                />

                <input
                  type="number"
                  name="weekend_price"
                  placeholder="Weekend Price"
                  value={formData.weekend_price}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="modal-buttons">

                <button type="submit" className="save-btn">
                  {editId ? "Update" : "Save"}
                </button>

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={resetForm}
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>

  );

};

export default AdminRoomPricing;
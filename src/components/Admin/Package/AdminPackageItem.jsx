import React, { useState, useEffect } from "react";
import "./AdminPackageItem.css";

import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaFilter,
  FaTimes,
  FaSearch,
} from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";

import {
  getPackageItems,
  createPackageItem,
  updatePackageItem,
  deletePackageItem,
} from "../../../redux/actions/AdminPackageItemAction";

import AdminAPI from "../../../BaseAPI/AdminAPI";
import { toast } from "react-toastify";

export default function AdminPackageItems() {

  const dispatch = useDispatch();
  const { packageItems, loading, error } = useSelector((state) => state.packageItems);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [itemType, setItemType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ CHANGE 1 — Added state for dropdown data fetched from API
  const [packages, setPackages] = useState([]);
  const [roomCategories, setRoomCategories] = useState([]);
  const [ticketTypes, setTicketTypes] = useState([]);

  // ✅ CHANGE 2 — Fetch packages, room categories, ticket types from your API
  useEffect(() => {
  dispatch(getPackageItems());

  /* FETCH PACKAGES FOR DROPDOWN */
  const fetchPackages = async () => {
    const { data } = await AdminAPI.get("catalog/admin/packages/");
    setPackages(data);
  };

  /* FETCH ROOM CATEGORIES FOR DROPDOWN */
  const fetchRoomCategories = async () => {
    const { data } = await AdminAPI.get("catalog/admin/room-categories/");
    setRoomCategories(data);
  };

  /* FETCH TICKET TYPES FOR DROPDOWN */
  const fetchTicketTypes = async () => {
    const { data } = await AdminAPI.get("catalog/admin/ticket-types/");
    setTicketTypes(data);
  };

  fetchPackages();
  fetchRoomCategories();
  fetchTicketTypes();

}, [dispatch]);

  const [formData, setFormData] = useState({
    package: "",
    item_type: "",
    room_category: "",
    ticket_type: "",
    ride: "",
    quantity: "",
  });

  useEffect(() => {
    dispatch(getPackageItems());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      dispatch(updatePackageItem(editId, formData));
    } else {
      dispatch(createPackageItem(formData));
    }

    setShowModal(false);
    setEditId(null);
    setFormData({ package_name: "", item_type: "", room_category_name: "", ticket_type_name: "", ride: "", quantity: "" });
  };

  const handleEdit = (item) => {
    setShowModal(true);
    setEditId(item.id);
    setItemType(item.item_type);

    setFormData({
      package: item.package,
      item_type: item.item_type,
      room_category: item.room_category || "",
      ticket_type: item.ticket_type || "",
      ride: item.ride || "",
      quantity: item.quantity,
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      dispatch(deletePackageItem(id));
    }
  };

  const filteredItems = packageItems?.filter((item) =>
    item.item_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (

    <div className="categories-container">
      {/* HEADER */}

      <div className="header-row">
        <div className="header-actions">
          <div className="room-search">

          <FaSearch />

          <input
            type="text"
            placeholder="Search Package Items"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

        </div>
          <button
            className="add-btn"
            onClick={() => {
              setShowModal(true);
              setEditId(null);
            }}
          >
            <FaPlus className="add-icon" /> Add Package Item  
          </button>

          <button className="filter-btn">
            <FaFilter /> Filter
          </button>

        </div>
      </div>


      {/* TABLE */}

      <div className="table-wrapper">

        <table className="categories-table">

          <thead>
            <tr>
              {/* <th>ID</th> */}
              <th>Package</th>
              <th>Item Type</th>
              <th>Room Category</th>
              <th>Ticket Type</th>
              <th>Ride</th>
              <th>Quantity</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {loading ? (
              <tr>
                <td colSpan="7" className="no-data">
                  <div className="state-wrapper">
                    <div className="spinner" />
                    <span>Loading package items...</span>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="7" className="no-data error-state">
                  <div className="state-wrapper">⚠️ Failed to load package items. Please try again.</div>
                </td>
              </tr>
            ) : filteredItems && filteredItems.length > 0 ? (

              filteredItems.map((item) => (

                <tr key={item.id}>

                  {/* <td>{item.id}</td> */}
                  <td>{item.package_name}</td>
                  <td>{item.item_type}</td>
                  <td>{item.room_category_name || "-"}</td>
                  <td>{item.ticket_type_name || "-"}</td>
                  <td>{item.ride || "-"}</td>
                  <td>{item.quantity}</td>

                  <td>

                    <div className="action-buttons">

                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(item)}
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(item.id)}
                      >
                        <FaTrash />
                      </button>

                    </div>

                  </td>

                </tr>

              ))

            ) : (

              <tr>
                <td colSpan="7" className="no-data">
                  <div className="state-wrapper">📦 No Package Items Found</div>
                </td>
              </tr>

            )}

          </tbody>

        </table>

      </div>


      {/* MODAL */}

      {showModal && (

        <div className="modal-overlay">

          <div className="modal-box">

            <div className="header-row">

              <h3>
                {editId ? "Edit Package Item" : "Add Package Item"}
              </h3>

              <FaTimes
                style={{ cursor: "pointer" }}
                onClick={() => setShowModal(false)}
              />

            </div>


            <form onSubmit={handleSubmit}>

              <div className="form-group">
                <label>Package Name</label>
                <select
                  name="package"
                  value={formData.package}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Package</option>
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">

                <label>Item Type</label>

                <select
                  name="item_type"
                  value={formData.item_type}
                  onChange={(e) => {
                    setItemType(e.target.value);
                    handleChange(e);
                  }}
                  required
                >

                  <option value="">Select Type</option>
                  <option value="room">Room</option>
                  <option value="ticket">Ticket</option>
                  <option value="ride">Ride</option>
                  <option value="meal">Meal</option>

                </select>

              </div>


              {itemType === "room" && (
                <div className="form-group">
                  <label>Room Category</label>
                  <select
                    name="room_category"
                    value={formData.room_category}
                    onChange={handleChange}
                  >
                    <option value="">Select Room Category</option>
                    {roomCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* ✅ CHANGE 5 — Ticket Type dropdown from API (was a number input) */}
              {itemType === "ticket" && (
                <div className="form-group">
                  <label>Ticket Type</label>
                  <select
                    name="ticket_type"
                    value={formData.ticket_type}
                    onChange={handleChange}
                  >
                    <option value="">Select Ticket Type</option>
                    {ticketTypes.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {itemType === "ride" && (

                <div className="form-group">

                  <label>Ride</label>

                  <input
                    type="number"
                    name="ride"
                    value={formData.ride}
                    onChange={handleChange}
                  />

                </div>

              )}


              <div className="form-group">

                <label>Quantity</label>

                <input
                  type="number"
                  min="1"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="modal-buttons">

                <button type="submit" className="save-btn">
                  Save
                </button>

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
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
}
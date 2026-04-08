import React, { useState, useEffect } from "react";
import "./AdminRoomCategories.css";
import { FaSearch, FaPlus, FaEdit, FaTrash, FaTimes, FaFilter } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

import {
  getCategoriesAction,
  addCategoryAction,
  editCategoryAction,
  deleteCategoryAction,
} from "../../../redux/actions/AdminRoomCategoriesAction";

import { toast } from "react-toastify";
import AdminAPI from "../../../BaseAPI/AdminAPI";

export default function AdminRoomCategories() {

  const dispatch = useDispatch();
  const { categories = [], loading, error } = useSelector((state) => state.categories || {});

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    bed_type: "single",
    maxAdults: "",
    maxChildren: "",
    roomSize: "",
    checkIn: "",
    checkOut: "",
    active: false,
    // ✅ CHANGE 2 — Added image fields
    image: null,
    image_preview: "",
  });

  useEffect(() => {
    dispatch(getCategoriesAction());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    // ✅ CHANGE 3 — Handle image file input
    if (name === "image" && files) {
      setFormData((prev) => ({
        ...prev,
        image: files[0],
        image_preview: URL.createObjectURL(files[0]),
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.warn("Category Name is required");
      return;
    }

    const payload = {
      name: formData.name,
      description: formData.description,
      bed_type: formData.bed_type,
      max_adults: parseInt(formData.maxAdults) || 1,
      max_children: parseInt(formData.maxChildren) || 0,
      room_size: formData.roomSize || "",
      check_in_time: formData.checkIn ? formData.checkIn + ":00" : null,
      check_out_time: formData.checkOut ? formData.checkOut + ":00" : null,
      is_active: formData.active,
    };

    try {
      let response;
      if (editId) {
        response = await dispatch(editCategoryAction(editId, payload));
        toast.success("Category updated successfully!");
      } else {
        response = await dispatch(addCategoryAction(payload));
        toast.success("Category added successfully!");
      }

      const categoryId = response?.id || response?.payload?.id || editId;

      if (formData.image && categoryId) {
        try {
          const imageData = new FormData();
          imageData.append("category", categoryId);
          imageData.append("image", formData.image);
          imageData.append("is_primary", true);
          await AdminAPI.post("catalog/admin/room-images/", imageData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } catch (err) {
          console.error("❌ Image upload error:", err.response?.data);
        }
      }

      dispatch(getCategoriesAction());
      resetForm();
    } catch (error) {
      toast.error(editId ? "Failed to update category." : "Failed to add category.");
    }
  };

  const handleEdit = (cat) => {
    // ✅ CHANGE 5 — Load existing image preview on edit
    const primaryImage = cat.images?.find((img) => img.is_primary) || cat.images?.[0];

    setFormData({
      name: cat.name || "",
      description: cat.description || "",
      bed_type: cat.bed_type || "single",
      maxAdults: cat.max_adults ?? "",
      maxChildren: cat.max_children ?? "",
      roomSize: cat.room_size || "",
      checkIn: cat.check_in_time ? cat.check_in_time.slice(0, 5) : "",
      checkOut: cat.check_out_time ? cat.check_out_time.slice(0, 5) : "",
      active: cat.is_active ?? false,
      image: null,
      image_preview: primaryImage?.image || "",
    });

    setEditId(cat.id);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this category?")) {
      dispatch(deleteCategoryAction(id));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      bed_type: "single",
      maxAdults: "",
      maxChildren: "",
      roomSize: "",
      checkIn: "",
      checkOut: "",
      active: false,
      image: null,
      image_preview: "",
    });
    setEditId(null);
    setShowModal(false);
  };

  const filteredCategories = Array.isArray(categories)
    ? categories.filter((cat) =>
        cat?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="categories-container">

      {/* SEARCH BAR */}
      {/* <div className="search-row">
        <div className="room-search">
          <FaSearch />
          <input
            type="text"
            placeholder="Search Category"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div> */}

      {/* HEADER */}
      <div className="Room-header-row">
        <div className="header-actions">
          <div className="room-search">
            <FaSearch />
            <input
              type="text"
              placeholder="Search Category"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="add-btn" onClick={() => { resetForm(); setShowModal(true); }}>
            <FaPlus /> Add Category
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
              <th>Name</th>
              {/* ✅ CHANGE 6 — Added Image column in table */}
              <th>Image</th>
              <th>Bed Type</th>
              <th>Adults</th>
              <th>Children</th>
              <th>Room Size</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10" className="no-data">Loading Categories...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="10" className="no-data">Error: {error}</td>
              </tr>
            ) : filteredCategories.length === 0 ? (
              <tr>
                <td colSpan="10" className="no-data">No Categories Added</td>
              </tr>
            ) : (
              filteredCategories.map((cat) => {
                const primaryImage = cat.images?.find((img) => img.is_primary) || cat.images?.[0];
                return (
                  <tr key={cat.id}>
                    <td>{cat.name}</td>

                    {/* ✅ CHANGE 7 — Show image in table */}
                    <td>
                      {primaryImage ? (
                        <img
                          src={
                            primaryImage.image?.startsWith("http")
                              ? primaryImage.image
                              : `https://api.jaltara.techsofast.com${primaryImage.image}`
                          }
                          alt="category"
                          style={{
                            width: "60px",
                            height: "45px",
                            objectFit: "cover",
                            borderRadius: "6px",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            setPreviewImage(
                              primaryImage.image?.startsWith("http")
                                ? primaryImage.image
                                : `https://api.jaltara.techsofast.com${primaryImage.image}`
                            )
                          }
                          onError={(e) => (e.target.style.display = "none")}
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>

                    <td>{cat.bed_type}</td>
                    <td>{cat.max_adults}</td>
                    <td>{cat.max_children}</td>
                    <td>{cat.room_size}</td>
                    <td>{cat.check_in_time?.slice(0, 5)}</td>
                    <td>{cat.check_out_time?.slice(0, 5)}</td>
                    <td>
                      <span className={cat.is_active ? "status-active" : "status-inactive"}>
                        {cat.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-edit" onClick={() => handleEdit(cat)}>
                          <FaEdit /> Edit
                        </button>
                        <button className="btn-delete" onClick={() => handleDelete(cat.id)}>
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
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
              <FaTimes className="modal-close" onClick={resetForm} />
            </div>

            <div className="form-group">
              <input name="name" placeholder="Category Name" value={formData.name} onChange={handleChange} />
            </div>

            <div className="form-group">
              <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Bed Type</label>
              <select name="bed_type" value={formData.bed_type} onChange={handleChange}>
                <option value="single">Single Bed</option>
                <option value="double">Double Bed</option>
                <option value="vip">VIP / King Size</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <input type="number" name="maxAdults" placeholder="Max Adults" value={formData.maxAdults} onChange={handleChange} />
              </div>
              <div className="form-group">
                <input type="number" name="maxChildren" placeholder="Max Children" value={formData.maxChildren} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <input name="roomSize" placeholder="Room Size" value={formData.roomSize} onChange={handleChange} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Check In</label>
                <input type="time" name="checkIn" value={formData.checkIn} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Check Out</label>
                <input type="time" name="checkOut" value={formData.checkOut} onChange={handleChange} />
              </div>
            </div>

            {/* IMAGE FIELD — only shown when editing, not when adding */}
            {editId && (
            <div className="form-group">
              <label>Category Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
              />
              {formData.image_preview && (
                <img
                  src={formData.image_preview}
                  alt="preview"
                  style={{
                    width: "80px",
                    height: "60px",
                    objectFit: "cover",
                    marginTop: "8px",
                    borderRadius: "6px",
                  }}
                />
              )}
            </div>
            )}

            <div className="checkbox-group">
              <label>
                <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} />
                Active
              </label>
            </div>

            <div className="modal-buttons">
              <button className="save-btn" onClick={handleSave}>
                {editId ? "Update" : "Save"}
              </button>
              <button className="cancel-btn" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ CHANGE 9 — Added image preview modal */}
      {previewImage && (
        <div className="modal-overlay" onClick={() => setPreviewImage(null)}>
          <img
            src={previewImage}
            alt="preview"
            style={{ maxWidth: "80vw", maxHeight: "80vh", borderRadius: "10px" }}
          />
        </div>
      )}

    </div>
  );
}
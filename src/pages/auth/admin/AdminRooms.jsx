import React, { useState, useEffect } from "react";
import "./AdminRooms.css";
import { FaPlus, FaEdit, FaTrash, FaFilter,FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

import {
  getRoomsAction,
  createRoomAction,
  updateRoomAction,
  deleteRoomAction,
} from "../../../redux/actions/AdminRoomsAction";

import { toast } from "react-toastify";
import AdminAPI from "../../../BaseAPI/AdminAPI";

export default function AdminRooms() {
  const dispatch = useDispatch();
  const { rooms = [], loading, error } = useSelector((state) => state.rooms);

  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [localRooms, setLocalRooms] = useState([]);

  const [formData, setFormData] = useState({
    room_number: "",
    category_name: "",
    floor: "1st",
    status: "available",
    image: null,
    image_preview: "",
    is_active: true,
  });

  // ================= LOAD ROOMS & CATEGORIES =================
  useEffect(() => {
    dispatch(getRoomsAction());
    fetchCategories();
  }, [dispatch]);

  // ================= NORMALIZE ROOMS =================
  useEffect(() => {
  const roomArray = rooms.results || rooms;
  const normalizedRooms = roomArray.map((room) => {
    const imgs = room.images || room.room_images || [];
    const normalizedImages = imgs.map((img) => {
      let url = img.image || img;
      if (url.startsWith("http") || url.startsWith("blob:")) return url;
      // Use the API endpoint for persisted images
      return `https://jaltara.techsofast.com/admin/room-images/${url}`;
    });
    return { ...room, images: normalizedImages.map((i) => ({ image: i })) };
  });
  setLocalRooms(normalizedRooms);
}, [rooms]);

  const fetchCategories = async () => {
    try {
      const { data } = await AdminAPI.get("catalog/admin/room-categories/");
      setCategories(data.results || data);
    } catch (error) {
      console.log("Category fetch error:", error);
    }
  };

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
        image_preview: URL.createObjectURL(file),
      });
      console.log("📸 Selected Image:", file);
    }
  };

  // ================= RESET =================
  const resetForm = () => {
    setFormData({
      room_number: "",
      category_name: "",
      floor: "1st",
      status: "available",
      image: null,
      image_preview: "",
      is_active: true,
    });
    setEditId(null);
    setShowModal(false);
  };

  const handleSubmit = async () => {
  if (!formData.room_number || !formData.category_name) {
    toast.warn("Room number and category are required.");
    return;
  }

  const form = new FormData();
  form.append("room_number", formData.room_number);
  form.append("category", formData.category_name);
  form.append("floor", formData.floor);
  form.append("status", formData.status);
  form.append("is_active", formData.is_active ? "true" : "false");
  if (formData.image) form.append("image", formData.image);

  try {
    if (editId) {
      await dispatch(updateRoomAction(editId, form));
      toast.success("Room updated successfully!");
      setLocalRooms((prev) =>
        prev.map((r) =>
          r.id === editId
            ? {
                ...r,
                room_number: formData.room_number,
                category_name: categories.find((c) => c.id === +formData.category)?.name,
                floor: formData.floor,
                status: formData.status,
                images: formData.image ? [{ image: formData.image_preview }] : r.images,
              }
            : r
        )
      );
    } else {
      const tempId = Date.now();
      setLocalRooms((prev) => [
        ...prev,
        {
          id: tempId,
          room_number: formData.room_number,
          category_name: categories.find((c) => c.id === +formData.category)?.name,
          floor: formData.floor,
          status: formData.status,
          images: formData.image ? [{ image: formData.image_preview }] : [],
        },
      ]);
      await dispatch(createRoomAction(form));
      toast.success("Room added successfully!");
      dispatch(getRoomsAction());
    }
    resetForm();
  } catch (error) {
    console.error("❌ Save Error:", error);
    toast.error(editId ? "Failed to update room." : "Failed to add room.");
  }
};

  // ================= EDIT =================
  const handleEdit = (room) => {
    const primaryImageUrl =
      room.images && room.images.length > 0 ? room.images[0].image : "";

    setFormData({
      room_number: room.room_number,
      category_name: room.category,
      floor: room.floor,
      status: room.status,
      image: null,
      image_preview: primaryImageUrl,
      is_active: room.is_active,
    });

    setEditId(room.id);
    setShowModal(true);
  };

  // ================= DELETE =================
  const handleDelete = (id) => {
    if (window.confirm("Delete this room?")) {
      dispatch(deleteRoomAction(id));
      setLocalRooms((prev) => prev.filter((r) => r.id !== id));
    }
  };

  // ================= SEARCH =================
  const filteredRooms = localRooms.filter((room) =>
    room.room_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ================= GET ROOM IMAGE URL =================
  const getRoomImageUrl = (room) => {
  if (!room.images || !room.images.length) return null;

  let img = room.images[0].image; // first image
  if (!img) return null;

  // If already a full URL or blob preview
  if (img.startsWith("http") || img.startsWith("blob:")) return img;

  // Use your API endpoint for images
  return `https://jaltara.techsofast.com/admin/room-images/${img}`;
};

  return (
    <div className="rooms-container">
      {/* SEARCH */}
      

      {/* HEADER */}
        <div className="Rooms-header-row">
          {/* <h2 className="page-title">Room Management</h2> */}
          <div className="header-actions">
            <div className="search-row-room">
              <FaSearch />
              <input
                type="text"
                placeholder="Search Room"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          <button
            className="add-btn"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            <FaPlus /> Add Room
          </button>
          <button className="filter-btn">
            <FaFilter /> Filter
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="table-wrapper">
        <table className="rooms-table">
          <thead>
            <tr>
              {/* <th>ID</th> */}
              {/* <th>Image</th> */}
              <th>Room Number</th>
              <th>Category</th>
              <th>Floor</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>Loading Rooms...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>Error: {error}</td>
              </tr>
            ) : filteredRooms.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>No Rooms Found</td>
              </tr>
            ) : (
              filteredRooms.map((room) => {
                const firstImageUrl = getRoomImageUrl(room);
                return (
                  <tr key={room.id}>
                    {/* <td>{room.id}</td> */}
                    {/* <td>
                      {firstImageUrl ? (
                        <img
                          src={firstImageUrl}
                          alt={`Room ${room.room_number}`}
                          className="table-img"
                          onClick={() => setPreviewImage(firstImageUrl)}
                        />
                      ) : (
                        <span>No Image</span>
                      )}
                    </td> */}
                    <td>{room.room_number}</td>
                    <td>{room.category_name}</td>
                    <td>{room.floor}</td>
                    <td>
                      <span
                        className={
                          room.status === "available"
                            ? "status-available"
                            : room.status === "maintenance"
                            ? "status-maintenance"
                            : "status-blocked"
                        }
                      >
                        {room.status}
                      </span>
                    </td>
                    <td className="action-buttons">
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(room)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(room.id)}
                      >
                        <FaTrash />
                      </button>
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
            <h3>{editId ? "Edit Room" : "Add Room"}</h3>
            <div className="form-group">
              <label>Room Number</label>
              <input
                name="room_number"
                value={formData.room_number}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Floor</label>
              <select
                name="floor"
                value={formData.floor}
                onChange={handleChange}
              >
                <option value="1st">1st Floor</option>
                <option value="2nd">2nd Floor</option>
                <option value="3rd">3rd Floor</option>
                <option value="4th">4th Floor</option>
                <option value="5th">5th Floor</option>
              </select>
            </div>
            <div className="form-group">
              <label>Room Category</label>
              <select
                name="category_name"
                value={formData.category_name}
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Room Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {formData.image_preview && (
                <img
                  src={formData.image_preview}
                  alt="preview"
                  className="preview-img"
                />
              )}
            </div>
            <div className="modal-buttons">
              <button className="save-btn" onClick={handleSubmit}>
                Save
              </button>
              <button className="cancel-btn" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMAGE PREVIEW */}
      {previewImage && (
        <div
          className="image-preview-overlay"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="image-preview-box"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={previewImage} alt="preview" />
          </div>
        </div>
      )}
    </div>
  );
}
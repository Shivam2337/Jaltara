import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaFilter, FaSearch } from "react-icons/fa";
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

  const emptyForm = { room_number: "", category_name: "", floor: "1st", status: "available", image: null, image_preview: "", is_active: true };
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => { dispatch(getRoomsAction()); fetchCategories(); }, [dispatch]);

  useEffect(() => {
    const roomArray = rooms.results || rooms;
    const normalizedRooms = roomArray.map((room) => {
      const imgs = room.images || room.room_images || [];
      const normalizedImages = imgs.map((img) => {
        let url = img.image || img;
        if (url.startsWith("http") || url.startsWith("blob:")) return url;
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
    } catch (error) { console.log("Category fetch error:", error); }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setFormData({ ...formData, image: file, image_preview: URL.createObjectURL(file) });
  };

  const resetForm = () => { setFormData(emptyForm); setEditId(null); setShowModal(false); };

  const handleSubmit = async () => {
    if (!formData.room_number || !formData.category_name) { toast.warn("Room number and category are required."); return; }
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
        setLocalRooms((prev) => prev.map((r) => r.id === editId
          ? { ...r, room_number: formData.room_number, category_name: categories.find((c) => c.id === +formData.category)?.name, floor: formData.floor, status: formData.status, images: formData.image ? [{ image: formData.image_preview }] : r.images }
          : r));
      } else {
        const tempId = Date.now();
        setLocalRooms((prev) => [...prev, { id: tempId, room_number: formData.room_number, category_name: categories.find((c) => c.id === +formData.category)?.name, floor: formData.floor, status: formData.status, images: formData.image ? [{ image: formData.image_preview }] : [] }]);
        await dispatch(createRoomAction(form));
        toast.success("Room added successfully!");
        dispatch(getRoomsAction());
      }
      resetForm();
    } catch (error) {
      toast.error(editId ? "Failed to update room." : "Failed to add room.");
    }
  };

  const handleEdit = (room) => {
    const primaryImageUrl = room.images && room.images.length > 0 ? room.images[0].image : "";
    setFormData({ room_number: room.room_number, category_name: room.category, floor: room.floor, status: room.status, image: null, image_preview: primaryImageUrl, is_active: room.is_active });
    setEditId(room.id);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this room?")) { dispatch(deleteRoomAction(id)); setLocalRooms((prev) => prev.filter((r) => r.id !== id)); }
  };

  const filteredRooms = localRooms.filter((room) => room.room_number?.toLowerCase().includes(searchTerm.toLowerCase()));

  const getRoomImageUrl = (room) => {
    if (!room.images || !room.images.length) return null;
    let img = room.images[0].image;
    if (!img) return null;
    if (img.startsWith("http") || img.startsWith("blob:")) return img;
    return `https://jaltara.techsofast.com/admin/room-images/${img}`;
  };

  const statusCls = (status) => {
    if (status === "available") return "bg-[#dcfce7] text-[#16a34a]";
    if (status === "maintenance") return "bg-[#fef3c7] text-[#d97706]";
    return "bg-[#fee2e2] text-[#dc2626]";
  };

  const inputCls = "px-3 py-[9px] border border-[#ccc] rounded-md text-sm outline-none focus:border-[#2563eb] w-full";

  return (
    <div className="p-5 bg-white min-h-screen font-[Poppins]">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 mb-5">
        <div className="flex items-center gap-2 bg-white border border-[#e5e7eb] px-3 py-2 rounded-md w-full sm:w-[260px]">
          <FaSearch className="text-[#999] shrink-0" />
          <input type="text" placeholder="Search Room" value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-none outline-none bg-transparent w-full text-sm" />
        </div>
        <button onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center justify-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-4 py-2 rounded-md text-sm cursor-pointer transition-colors">
          <FaPlus /> Add Room
        </button>
        <button className="flex items-center justify-center gap-2 px-4 py-2 border border-[#ddd] bg-white hover:bg-[#d1d5db] rounded-md text-sm cursor-pointer transition-colors">
          <FaFilter /> Filter
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-x-auto">
        <table className="w-full border-collapse min-w-[500px]">
          <thead className="bg-[#f1f5f9]">
            <tr>
              {["Room Number","Category","Floor","Status","Action"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-sm font-semibold text-[#374151]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="text-center py-6 text-sm text-[#9ca3af]">Loading Rooms...</td></tr>
            ) : error ? (
              <tr><td colSpan="5" className="text-center py-6 text-sm text-red-500">Error: {error}</td></tr>
            ) : filteredRooms.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-6 text-sm text-[#9ca3af]">No Rooms Found</td></tr>
            ) : (
              filteredRooms.map((room) => (
                <tr key={room.id} className="border-t border-[#eee]">
                  <td className="px-4 py-3 text-sm text-[#374151] align-middle">{room.room_number}</td>
                  <td className="px-4 py-3 text-sm text-[#374151] align-middle">{room.category_name}</td>
                  <td className="px-4 py-3 text-sm text-[#374151] align-middle">{room.floor}</td>
                  <td className="px-4 py-3 align-middle">
                    <span className={`px-[10px] py-1 rounded text-[13px] ${statusCls(room.status)}`}>{room.status}</span>
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(room)}
                        className="flex items-center gap-1 bg-[#f59e0b] hover:bg-[#d97706] text-white border-none px-[10px] py-[6px] rounded text-[13px] cursor-pointer transition-colors">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(room.id)}
                        className="flex items-center gap-1 bg-[#ef4444] hover:bg-[#dc2626] text-white border-none px-[10px] py-[6px] rounded text-[13px] cursor-pointer transition-colors">
                        <FaTrash />
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
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[1000] px-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-[400px] max-h-[90vh] overflow-y-auto shadow-[0_10px_25px_rgba(0,0,0,0.1)]">
            <h3 className="text-lg font-semibold mb-4">{editId ? "Edit Room" : "Add Room"}</h3>
            <div className="flex flex-col mb-4">
              <label className="text-sm mb-1">Room Number</label>
              <input name="room_number" value={formData.room_number} onChange={handleChange} className={inputCls} />
            </div>
            <div className="flex flex-col mb-4">
              <label className="text-sm mb-1">Floor</label>
              <select name="floor" value={formData.floor} onChange={handleChange} className={inputCls}>
                {["1st","2nd","3rd","4th","5th"].map((f) => <option key={f} value={f}>{f} Floor</option>)}
              </select>
            </div>
            <div className="flex flex-col mb-4">
              <label className="text-sm mb-1">Room Category</label>
              <select name="category_name" value={formData.category_name} onChange={handleChange} className={inputCls}>
                <option value="">Select Category</option>
                {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            <div className="flex flex-col mb-4">
              <label className="text-sm mb-1">Room Image</label>
              <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm" />
              {formData.image_preview && (
                <img src={formData.image_preview} alt="preview" className="w-[100px] h-[100px] object-cover rounded-md mt-2" />
              )}
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={handleSubmit}
                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white border-none px-4 py-2 rounded-md text-sm cursor-pointer transition-colors">
                Save
              </button>
              <button onClick={resetForm}
                className="bg-[#b5b8bc] hover:bg-[#d8dadc] text-white border-none px-4 py-2 rounded-md text-sm cursor-pointer transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMAGE PREVIEW */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[1000]" onClick={() => setPreviewImage(null)}>
          <div className="max-w-[90%] max-h-[90%]" onClick={(e) => e.stopPropagation()}>
            <img src={previewImage} alt="preview" className="w-full h-auto rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
}

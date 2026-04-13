import React, { useState, useEffect } from "react";
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

  const emptyForm = {
    name: "", description: "", bed_type: "single",
    maxAdults: "", maxChildren: "", roomSize: "",
    checkIn: "", checkOut: "", active: false,
    image: null, image_preview: "",
  };

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => { dispatch(getCategoriesAction()); }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === "image" && files) {
      setFormData((prev) => ({ ...prev, image: files[0], image_preview: URL.createObjectURL(files[0]) }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) { toast.warn("Category Name is required"); return; }
    const payload = {
      name: formData.name, description: formData.description, bed_type: formData.bed_type,
      max_adults: parseInt(formData.maxAdults) || 1, max_children: parseInt(formData.maxChildren) || 0,
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
          await AdminAPI.post("catalog/admin/room-images/", imageData, { headers: { "Content-Type": "multipart/form-data" } });
        } catch (err) { console.error("Image upload error:", err.response?.data); }
      }
      dispatch(getCategoriesAction());
      resetForm();
    } catch (error) {
      toast.error(editId ? "Failed to update category." : "Failed to add category.");
    }
  };

  const handleEdit = (cat) => {
    const primaryImage = cat.images?.find((img) => img.is_primary) || cat.images?.[0];
    setFormData({
      name: cat.name || "", description: cat.description || "", bed_type: cat.bed_type || "single",
      maxAdults: cat.max_adults ?? "", maxChildren: cat.max_children ?? "",
      roomSize: cat.room_size || "",
      checkIn: cat.check_in_time ? cat.check_in_time.slice(0, 5) : "",
      checkOut: cat.check_out_time ? cat.check_out_time.slice(0, 5) : "",
      active: cat.is_active ?? false, image: null, image_preview: primaryImage?.image || "",
    });
    setEditId(cat.id);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this category?")) dispatch(deleteCategoryAction(id));
  };

  const resetForm = () => { setFormData(emptyForm); setEditId(null); setShowModal(false); };

  const filteredCategories = Array.isArray(categories)
    ? categories.filter((cat) => cat?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  const inputCls = "px-[10px] py-[10px] border border-[#d1d5db] rounded-md w-full text-sm outline-none focus:border-[#2563eb] box-border";

  return (
    <div className="p-5 bg-white min-h-screen font-[Poppins]">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 mb-5">
        <div className="flex items-center gap-2 bg-white border border-[#e5e7eb] px-3 py-2 rounded-md w-full sm:w-[260px]">
          <FaSearch className="text-[#999] shrink-0" />
          <input type="text" placeholder="Search Category" value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-none outline-none bg-transparent w-full text-sm" />
        </div>
        <button onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center justify-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-4 py-2 rounded-md text-sm cursor-pointer transition-colors">
          <FaPlus /> Add Category
        </button>
        <button className="flex items-center justify-center gap-2 px-4 py-2 border border-[#ddd] bg-white hover:bg-[#d1d5db] rounded-md text-sm cursor-pointer transition-colors">
          <FaFilter /> Filter
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-x-auto">
        <table className="w-full border-collapse min-w-[700px]">
          <thead className="bg-[#f1f5f9]">
            <tr>
              {["Name","Image","Bed Type","Adults","Children","Room Size","Check In","Check Out","Status","Action"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-sm font-semibold text-[#374151]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="10" className="text-center py-6 text-sm text-[#9ca3af]">Loading Categories...</td></tr>
            ) : error ? (
              <tr><td colSpan="10" className="text-center py-6 text-sm text-red-500">Error: {error}</td></tr>
            ) : filteredCategories.length === 0 ? (
              <tr><td colSpan="10" className="text-center py-6 text-sm text-[#9ca3af]">No Categories Added</td></tr>
            ) : (
              filteredCategories.map((cat) => {
                const primaryImage = cat.images?.find((img) => img.is_primary) || cat.images?.[0];
                const imgSrc = primaryImage?.image?.startsWith("http")
                  ? primaryImage.image
                  : `https://api.jaltara.techsofast.com${primaryImage?.image}`;
                return (
                  <tr key={cat.id} className="border-t border-[#f1f5f9] hover:bg-[#f9fafb]">
                    <td className="px-4 py-3 text-sm text-[#374151]">{cat.name}</td>
                    <td className="px-4 py-3">
                      {primaryImage ? (
                        <img src={imgSrc} alt="category"
                          className="w-[60px] h-[45px] object-cover rounded-md cursor-pointer"
                          onClick={() => setPreviewImage(imgSrc)}
                          onError={(e) => (e.target.style.display = "none")} />
                      ) : <span className="text-sm text-[#9ca3af]">No Image</span>}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#374151]">{cat.bed_type}</td>
                    <td className="px-4 py-3 text-sm text-[#374151]">{cat.max_adults}</td>
                    <td className="px-4 py-3 text-sm text-[#374151]">{cat.max_children}</td>
                    <td className="px-4 py-3 text-sm text-[#374151]">{cat.room_size}</td>
                    <td className="px-4 py-3 text-sm text-[#374151]">{cat.check_in_time?.slice(0, 5)}</td>
                    <td className="px-4 py-3 text-sm text-[#374151]">{cat.check_out_time?.slice(0, 5)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-[10px] py-1 rounded-full text-[12px] font-medium inline-block
                        ${cat.is_active ? "bg-[#dcfce7] text-[#16a34a]" : "bg-[#fee2e2] text-[#dc2626]"}`}>
                        {cat.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(cat)}
                          className="flex items-center gap-1 bg-[#f59e0b] hover:bg-[#d97706] text-white border-none px-[10px] py-[5px] rounded text-[13px] cursor-pointer transition-colors">
                          <FaEdit /> Edit
                        </button>
                        <button onClick={() => handleDelete(cat.id)}
                          className="flex items-center gap-1 bg-[#ef4444] hover:bg-[#dc2626] text-white border-none px-[10px] py-[5px] rounded text-[13px] cursor-pointer transition-colors">
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
        <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-[1000] px-4">
          <div className="bg-white p-7 rounded-xl w-full max-w-[520px] max-h-[90vh] overflow-y-auto shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[20px] font-semibold text-[#1f2937]">{editId ? "Edit Category" : "Add Category"}</h3>
              <FaTimes className="cursor-pointer text-[#666] hover:text-red-500 transition-colors" onClick={resetForm} />
            </div>

            <div className="flex flex-col mb-3">
              <input name="name" placeholder="Category Name" value={formData.name} onChange={handleChange} className={inputCls} />
            </div>
            <div className="flex flex-col mb-3">
              <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange}
                className={`${inputCls} resize-none h-20`} />
            </div>
            <div className="flex flex-col mb-3">
              <label className="text-sm mb-1">Bed Type</label>
              <select name="bed_type" value={formData.bed_type} onChange={handleChange} className={inputCls}>
                <option value="single">Single Bed</option>
                <option value="double">Double Bed</option>
                <option value="vip">VIP / King Size</option>
              </select>
            </div>
            <div className="flex gap-3 mb-3">
              <input type="number" name="maxAdults" placeholder="Max Adults" value={formData.maxAdults} onChange={handleChange} className={inputCls} />
              <input type="number" name="maxChildren" placeholder="Max Children" value={formData.maxChildren} onChange={handleChange} className={inputCls} />
            </div>
            <div className="flex flex-col mb-3">
              <input name="roomSize" placeholder="Room Size" value={formData.roomSize} onChange={handleChange} className={inputCls} />
            </div>
            <div className="flex gap-3 mb-3">
              <div className="flex flex-col flex-1">
                <label className="text-sm mb-1">Check In</label>
                <input type="time" name="checkIn" value={formData.checkIn} onChange={handleChange} className={inputCls} />
              </div>
              <div className="flex flex-col flex-1">
                <label className="text-sm mb-1">Check Out</label>
                <input type="time" name="checkOut" value={formData.checkOut} onChange={handleChange} className={inputCls} />
              </div>
            </div>

            {editId && (
              <div className="flex flex-col mb-3">
                <label className="text-sm mb-1">Category Image</label>
                <input type="file" name="image" accept="image/*" onChange={handleChange} className="text-sm" />
                {formData.image_preview && (
                  <img src={formData.image_preview} alt="preview"
                    className="w-20 h-[60px] object-cover mt-2 rounded-md" />
                )}
              </div>
            )}

            <div className="flex items-center gap-2 text-sm mt-2 mb-5">
              <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} id="active" />
              <label htmlFor="active" className="cursor-pointer">Active</label>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={handleSave}
                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white border-none px-4 py-2 rounded-md cursor-pointer text-sm transition-colors">
                {editId ? "Update" : "Save"}
              </button>
              <button onClick={resetForm}
                className="bg-[#b5b8bc] hover:bg-[#d8dadc] text-white border-none px-4 py-2 rounded-md cursor-pointer text-sm transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMAGE PREVIEW */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-[1000]"
          onClick={() => setPreviewImage(null)}>
          <img src={previewImage} alt="preview" className="max-w-[80vw] max-h-[80vh] rounded-xl" />
        </div>
      )}
    </div>
  );
}

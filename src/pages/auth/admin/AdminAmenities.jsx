import React, { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  getAmenitiesAction, createAmenityAction,
  updateAmenityAction, deleteAmenityAction,
} from "../../../redux/actions/AdminAmenitiesAction";

const inputCls = "w-full px-[8px] py-[8px] border border-[#ddd] rounded-md text-sm outline-none focus:border-[#2563eb]";

const AdminAmenities = () => {
  const dispatch = useDispatch();
  const { amenities } = useSelector((state) => state.amenities);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const amenityLimitReached = amenities?.length >= 4;

  const [formData, setFormData] = useState({ name: "", image: null });

  useEffect(() => { dispatch(getAmenitiesAction()); }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) { toast.warn("Name is required."); return; }
    if (!editId && !(formData.image instanceof File)) { toast.warn("Image is required."); return; }
    const payload = { ...formData, is_active: 1 };
    if (editId) { dispatch(updateAmenityAction(editId, payload)); }
    else { dispatch(createAmenityAction(payload)); }
    setFormData({ name: "", image: null });
    setShowModal(false);
    setEditId(null);
  };

  const handleEdit = (item) => {
    setFormData({ name: item.name, image: item.image });
    setEditId(item.id);
    setShowModal(true);
  };

  return (
    <div className="p-[30px] bg-[#f5f7fb] min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-[26px] font-semibold">Amenities Management</h2>
        <div
          className="relative inline-block"
          onMouseEnter={() => { if (amenityLimitReached) setShowTooltip(true); }}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <button
            disabled={amenityLimitReached}
            onClick={() => { if (amenityLimitReached) return; setShowModal(true); setEditId(null); setFormData({ name: "", image: null }); }}
            className={`flex items-center gap-2 bg-[#2563eb] text-white border-none px-4 py-2 rounded-md text-[13px] transition-colors
              ${amenityLimitReached ? "opacity-50 cursor-not-allowed" : "hover:bg-[#1d4ed8] cursor-pointer"}`}
          >
            <FaPlus /> Add Amenity
          </button>
          {showTooltip && (
            <div className="absolute top-[calc(100%+8px)] right-0 bg-[#1e293b] text-white text-[12px] px-3 py-[7px] rounded-md whitespace-nowrap z-[100]
              after:content-[''] after:absolute after:bottom-full after:right-[14px] after:border-[6px] after:border-transparent after:border-b-[#1e293b]">
              Maximum 4 amenities allowed. Please edit or delete an existing one.
            </div>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-x-auto">
        <table className="w-full border-collapse min-w-[300px]">
          <thead className="bg-[#f1f5f9]">
            <tr>
              {["Image","Title","Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-sm font-semibold text-[#374151] border-t border-[#eee]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {amenities?.length > 0 ? (
              amenities.map((item) => (
                <tr key={item.id} className="border-t border-[#eee] hover:bg-[#f9fafb]">
                  <td className="px-4 py-3">
                    <img src={item.image} alt={item.name} className="w-[60px] h-[60px] object-cover rounded-md" />
                  </td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{item.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <FaEdit className="text-[#2563eb] cursor-pointer text-base hover:text-[#1d4ed8] transition-colors" onClick={() => handleEdit(item)} />
                      <FaTrash className="text-[#dc2626] cursor-pointer text-base hover:text-[#b91c1c] transition-colors" onClick={() => dispatch(deleteAmenityAction(item.id))} />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="3" className="text-center py-6 text-sm text-[#9ca3af]">No amenities found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/35 flex justify-center items-center z-[1000] px-4">
          <div className="bg-white w-full max-w-[420px] p-6 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-[20px] font-semibold">{editId ? "Edit Amenity" : "Add Amenity"}</h3>
              <FaTimes className="cursor-pointer text-[18px] text-[#6b7280] hover:text-[#111827] transition-colors" onClick={() => setShowModal(false)} />
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm">Title</label>
                <input name="name" value={formData.name || ""} onChange={handleChange} className={inputCls} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm">Image</label>
                <input type="file" name="image" onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })} className="text-sm" />
              </div>
              <div className="flex justify-end mt-2">
                <button onClick={handleSubmit}
                  className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white border-none px-4 py-2 rounded-md text-sm cursor-pointer transition-colors">
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

export default AdminAmenities;

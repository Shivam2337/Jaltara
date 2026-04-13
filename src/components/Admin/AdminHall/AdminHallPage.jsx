import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  getHallsAction,
  createHallAction,
  updateHallAction,
  deleteHallAction,
} from "../../../redux/actions/AdminHallAction";
import { toast } from "react-toastify";

export default function AdminHallPage() {
  const dispatch = useDispatch();
  const { halls, hallLoading } = useSelector((state) => state.hall);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const hallExists = halls?.length > 0;

  const emptyForm = {
    title: "", tagline: "", description: "", capacity: "", area: "",
    hall_type: "", air_conditioning: false, parking: false,
    phone_number: "", email: "", main_image: null, image_preview: "",
  };
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => { dispatch(getHallsAction()); }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === "main_image" && files) {
      setFormData({ ...formData, main_image: files[0], image_preview: URL.createObjectURL(files[0]) });
      return;
    }
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async () => {
    try {
      const form = new FormData();
      form.append("title", formData.title);
      form.append("tagline", formData.tagline);
      form.append("description", formData.description);
      form.append("capacity", formData.capacity);
      form.append("area", formData.area);
      form.append("hall_type", formData.hall_type);
      form.append("air_conditioning", formData.air_conditioning === true ? "true" : "false");
      form.append("parking", formData.parking === true ? "true" : "false");
      form.append("phone_number", formData.phone_number);
      form.append("email", formData.email);
      if (formData.main_image instanceof File) form.append("main_image", formData.main_image);
      if (editId) { await dispatch(updateHallAction(editId, form)); }
      else { await dispatch(createHallAction(form)); }
      resetForm();
    } catch (err) { console.error("Save error:", err); }
  };

  const handleEdit = (hall) => {
    setFormData({
      title: hall.title || "", tagline: hall.tagline || "", description: hall.description || "",
      capacity: hall.capacity || "", area: hall.area || "", hall_type: hall.hall_type || "",
      air_conditioning: Boolean(hall.air_conditioning), parking: Boolean(hall.parking),
      phone_number: hall.phone_number || "", email: hall.email || "",
      main_image: null, image_preview: hall.main_image || "",
    });
    setEditId(hall.id);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this hall?")) dispatch(deleteHallAction(id));
  };

  const resetForm = () => { setFormData(emptyForm); setEditId(null); setShowModal(false); };

  const inputCls = "px-[10px] py-[10px] border border-[#d1d5db] rounded-md w-full text-sm outline-none focus:border-[#2563eb] box-border";

  return (
    <div className="p-5">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[18px] font-semibold text-[#1f2937]">Hall Pages</h3>
        <div
          className="relative inline-block"
          onMouseEnter={() => { if (hallExists) setShowTooltip(true); }}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <button
            disabled={hallExists}
            onClick={() => { if (!hallExists) { resetForm(); setShowModal(true); } }}
            className={`flex items-center gap-2 bg-[#2563eb] text-white px-4 py-2 rounded-md text-sm border-none transition-colors
              ${hallExists ? "opacity-50 cursor-not-allowed" : "hover:bg-[#1d4ed8] cursor-pointer"}`}
          >
            <FaPlus /> Add Hall
          </button>
          {showTooltip && (
            <div className="absolute top-[calc(100%+8px)] right-0 bg-[#1e293b] text-white text-[12px] px-3 py-[7px] rounded-md whitespace-nowrap z-[100]
              after:content-[''] after:absolute after:bottom-full after:right-[14px] after:border-[6px] after:border-transparent after:border-b-[#1e293b]">
              Only one hall can be added. Please edit the existing hall.
            </div>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-x-auto">
        <table className="w-full border-collapse min-w-[900px]">
          <thead className="bg-[#f1f5f9]">
            <tr>
              {["Title","Tagline","Hall Type","Capacity","Area","AC","Parking","Phone","Email","Image","Action"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-sm font-semibold text-[#374151]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hallLoading ? (
              <tr><td colSpan="11" className="text-center py-6 text-sm text-[#9ca3af]">Loading...</td></tr>
            ) : halls?.length === 0 ? (
              <tr><td colSpan="11" className="text-center py-6 text-sm text-[#9ca3af]">No Halls Found</td></tr>
            ) : (
              halls?.map((hall) => (
                <tr key={hall.id} className="border-t border-[#f1f5f9] hover:bg-[#f9fafb]">
                  <td className="px-4 py-3 text-sm text-[#374151]">{hall.title}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{hall.tagline}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{hall.hall_type}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{hall.capacity}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{hall.area}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{hall.air_conditioning ? "Yes" : "No"}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{hall.parking ? "Yes" : "No"}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{hall.phone_number}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{hall.email}</td>
                  <td className="px-4 py-3">
                    {hall.main_image ? (
                      <img
                        src={hall.main_image?.startsWith("http") ? hall.main_image : `https://api.jaltara.techsofast.com${hall.main_image}`}
                        alt="hall"
                        className="w-[60px] h-[45px] object-cover rounded-md cursor-pointer"
                        onClick={() => setPreviewImage(hall.main_image)}
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    ) : <span className="text-sm text-[#9ca3af]">No Image</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(hall)}
                        className="flex items-center gap-1 bg-[#f59e0b] hover:bg-[#d97706] text-white border-none px-[10px] py-[5px] rounded text-[13px] cursor-pointer transition-colors">
                        <FaEdit /> Edit
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
        <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-[1000] px-4">
          <div className="bg-white p-7 rounded-xl w-full max-w-[520px] max-h-[90vh] overflow-y-auto shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[20px] font-semibold text-[#1f2937]">{editId ? "Edit Hall" : "Add Hall"}</h3>
              <FaTimes className="cursor-pointer text-[#666] hover:text-red-500 transition-colors" onClick={resetForm} />
            </div>

            {[
              { name: "title", placeholder: "Hall Title" },
              { name: "tagline", placeholder: "Tagline" },
              { name: "hall_type", placeholder: "Hall Type (e.g. banquet, conference)" },
              { name: "phone_number", placeholder: "Phone Number" },
              { name: "email", placeholder: "Email" },
            ].map(({ name, placeholder }) => (
              <div key={name} className="flex flex-col mb-3">
                <input name={name} placeholder={placeholder} value={formData[name]} onChange={handleChange} className={inputCls} />
              </div>
            ))}

            <div className="flex flex-col mb-3">
              <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange}
                className={`${inputCls} resize-none h-20`} />
            </div>

            <div className="flex gap-3 mb-3">
              <input type="number" name="capacity" placeholder="Capacity" value={formData.capacity} onChange={handleChange} className={inputCls} />
              <input type="number" name="area" placeholder="Area (sq ft)" value={formData.area} onChange={handleChange} className={inputCls} />
            </div>

            <div className="flex flex-col mb-3">
              <label className="text-sm mb-1">Main Image</label>
              <input type="file" name="main_image" accept="image/*" onChange={handleChange} className="text-sm" />
              {formData.image_preview && (
                <img src={formData.image_preview} alt="preview" className="w-20 h-[60px] object-cover mt-2 rounded-md" />
              )}
            </div>

            <div className="flex items-center gap-2 text-sm mb-3">
              <input type="checkbox" name="air_conditioning" id="ac" checked={formData.air_conditioning} onChange={handleChange} />
              <label htmlFor="ac" className="cursor-pointer">Air Conditioning</label>
            </div>
            <div className="flex items-center gap-2 text-sm mb-5">
              <input type="checkbox" name="parking" id="parking" checked={formData.parking} onChange={handleChange} />
              <label htmlFor="parking" className="cursor-pointer">Parking</label>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={handleSubmit}
                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white border-none px-4 py-2 rounded-md text-sm cursor-pointer transition-colors">
                {editId ? "Update" : "Save"}
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
        <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-[1000]" onClick={() => setPreviewImage(null)}>
          <img
            src={previewImage?.startsWith("http") ? previewImage : `https://api.jaltara.techsofast.com${previewImage}`}
            alt="preview"
            className="max-w-[80vw] max-h-[80vh] rounded-xl"
          />
        </div>
      )}
    </div>
  );
}

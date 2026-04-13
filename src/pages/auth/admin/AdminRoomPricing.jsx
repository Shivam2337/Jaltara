import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaFilter, FaTimes, FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  getPricingAction,
  addPricingAction,
  editPricingAction,
  deletePricingAction,
} from "../../../redux/actions/AdminRoomPricingAction";
import { getCategoriesAction } from "../../../redux/actions/AdminRoomCategoriesAction";
import { toast } from "react-toastify";

const AdminRoomPricing = () => {
  const dispatch = useDispatch();

  const pricingState = useSelector((state) => state.pricing);
  const pricing = pricingState?.pricing || [];
  const loading = pricingState?.loading || false;
  const error = pricingState?.error || null;

  const categoryState = useSelector((state) => state.categories);
  const categories = categoryState?.categories || [];

  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const emptyForm = {
    category: "", start_date: "", end_date: "", base_price: "",
    extra_adult_price: "", extra_child_price: "", meal_plan: "",
    weekend_price: "", seasonal_discount_percent: "",
  };
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => { dispatch(getPricingAction()); dispatch(getCategoriesAction()); }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.category || !formData.start_date || !formData.end_date || !formData.base_price || !formData.meal_plan) {
      toast.warn("Please fill all required fields"); return;
    }
    const payload = {
      category: parseInt(formData.category),
      start_date: formData.start_date, end_date: formData.end_date,
      base_price: parseFloat(formData.base_price),
      extra_adult_price: parseFloat(formData.extra_adult_price || 0),
      extra_child_price: parseFloat(formData.extra_child_price || 0),
      meal_plan: formData.meal_plan || null,
      weekend_price: parseFloat(formData.weekend_price),
      seasonal_discount_percent: parseFloat(formData.seasonal_discount_percent || 0),
    };
    if (editId) { dispatch(editPricingAction(editId, payload)); } else { dispatch(addPricingAction(payload)); }
    resetForm();
  };

  const handleEdit = (item) => {
    setFormData({
      category: item.category || "", start_date: item.start_date || "", end_date: item.end_date || "",
      base_price: item.base_price || "", extra_adult_price: item.extra_adult_price || "",
      extra_child_price: item.extra_child_price || "", meal_plan: item.meal_plan || "",
      weekend_price: item.weekend_price || "", seasonal_discount_percent: item.seasonal_discount_percent || "",
    });
    setEditId(item.id);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this pricing?")) dispatch(deletePricingAction(id));
  };

  const resetForm = () => { setFormData(emptyForm); setEditId(null); setShowModal(false); };

  const filteredPricing = (pricing || []).filter((item) =>
    item.category_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const inputCls = "w-full px-[10px] py-[10px] border border-[#d1d5db] rounded-md text-sm outline-none focus:border-[#2563eb] box-border";

  return (
    <div className="p-5 bg-white min-h-screen font-[Poppins]">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 mb-5">
        <div className="flex items-center gap-2 bg-white border border-[#e5e7eb] px-3 py-2 rounded-md w-full sm:w-[260px]">
          <FaSearch className="text-[#999] shrink-0" />
          <input type="text" placeholder="Search by Category" value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-none outline-none bg-transparent w-full text-sm" />
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-4 py-2 rounded-md text-sm cursor-pointer transition-colors">
          <FaPlus /> Add Pricing
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
              {["Category","Start Date","End Date","Base","Adult","Child","Meal","Weekend","Discount","Action"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-sm font-semibold text-[#374151]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="10" className="text-center py-6 text-sm text-[#9ca3af]">Loading Pricing...</td></tr>
            ) : error ? (
              <tr><td colSpan="10" className="text-center py-6 text-sm text-red-500">Error: {error}</td></tr>
            ) : filteredPricing.length === 0 ? (
              <tr><td colSpan="10" className="text-center py-6 text-sm text-[#9ca3af]">No Pricing Added</td></tr>
            ) : (
              filteredPricing.map((item) => (
                <tr key={item.id} className="border-t border-[#f1f5f9] hover:bg-[#f9fafb]">
                  <td className="px-4 py-3 text-sm text-[#374151]">{categories.find((cat) => cat.id === item.category)?.name || item.category}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{item.start_date}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{item.end_date}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{item.base_price}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{item.extra_adult_price}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{item.extra_child_price}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{item.meal_plan}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{item.weekend_price}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{item.seasonal_discount_percent}%</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(item)}
                        className="flex items-center gap-1 bg-[#f59e0b] hover:bg-[#d97706] text-white border-none px-[10px] py-[5px] rounded text-[13px] cursor-pointer transition-colors">
                        <FaEdit /> Edit
                      </button>
                      <button onClick={() => handleDelete(item.id)}
                        className="flex items-center gap-1 bg-[#ef4444] hover:bg-[#dc2626] text-white border-none px-[10px] py-[5px] rounded text-[13px] cursor-pointer transition-colors">
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
        <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-[1000] px-4">
          <div className="bg-white p-7 rounded-xl w-full max-w-[520px] max-h-[90vh] overflow-y-auto shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[20px] font-semibold text-[#1f2937]">{editId ? "Edit Pricing" : "Add Pricing"}</h3>
              <FaTimes className="cursor-pointer text-[#666] hover:text-red-500 transition-colors" onClick={resetForm} />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select name="category" value={formData.category} onChange={handleChange} required className={inputCls}>
                  <option value="">Select Category</option>
                  {categories?.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
                <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} required className={inputCls} />
                <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} required className={inputCls} />
                <input type="number" name="base_price" placeholder="Base Price" value={formData.base_price} onChange={handleChange} required className={inputCls} />
                <input type="number" name="extra_adult_price" placeholder="Extra Adult Price" value={formData.extra_adult_price} onChange={handleChange} className={inputCls} />
                <input type="number" name="extra_child_price" placeholder="Extra Child Price" value={formData.extra_child_price} onChange={handleChange} className={inputCls} />
                <select name="meal_plan" value={formData.meal_plan} onChange={handleChange} required className={inputCls}>
                  <option value="">Select Meal Plan</option>
                  <option value="room_only">Room Only</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="full_board">Full Board</option>
                </select>
                <input type="number" name="seasonal_discount_percent" placeholder="Discount %" value={formData.seasonal_discount_percent} onChange={handleChange} className={inputCls} />
                <input type="number" name="weekend_price" placeholder="Weekend Price" value={formData.weekend_price} onChange={handleChange} required className={inputCls} />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button type="submit"
                  className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white border-none px-4 py-2 rounded-md text-sm cursor-pointer transition-colors">
                  {editId ? "Update" : "Save"}
                </button>
                <button type="button" onClick={resetForm}
                  className="bg-[#b5b8bc] hover:bg-[#d8dadc] text-white border-none px-4 py-2 rounded-md text-sm cursor-pointer transition-colors">
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

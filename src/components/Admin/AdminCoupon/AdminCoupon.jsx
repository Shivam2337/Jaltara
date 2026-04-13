import React, { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  getCouponAction, createCouponAction,
  updateCouponAction, deleteCouponAction,
} from "../../../redux/actions/AdminCouponAction";

const inputCls = "w-full px-[8px] py-[8px] border border-[#ddd] rounded-md text-sm outline-none focus:border-[#2563eb]";

const AdminCoupon = () => {
  const dispatch = useDispatch();
  const { coupons, loading, error } = useSelector((state) => state.coupons);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const emptyForm = {
    code: "", discount_type: "percentage", discount_value: "",
    max_discount: "", min_amount: "", valid_from: "", valid_to: "", is_active: true,
  };
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => { dispatch(getCouponAction()); }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const formatDateTime = (value) => value ? value.slice(0, 16) : "";

  const handleSubmit = () => {
    if (!formData.code.trim())     { toast.warn("Coupon Code is required."); return; }
    if (!formData.discount_value)  { toast.warn("Discount Value is required."); return; }
    if (!formData.min_amount)      { toast.warn("Minimum Amount is required."); return; }
    if (!formData.valid_from)      { toast.warn("Valid From date is required."); return; }
    if (!formData.valid_to)        { toast.warn("Valid To date is required."); return; }
    if (editId) { dispatch(updateCouponAction(editId, formData)); }
    else        { dispatch(createCouponAction(formData)); }
    resetForm();
  };

  const resetForm = () => { setFormData(emptyForm); setEditId(null); setShowModal(false); };

  const handleEdit = (item) => {
    setFormData({
      code: item.code, discount_type: item.discount_type,
      discount_value: item.discount_value, max_discount: item.max_discount || "",
      min_amount: item.min_amount, valid_from: formatDateTime(item.valid_from),
      valid_to: formatDateTime(item.valid_to), is_active: item.is_active,
    });
    setEditId(item.id);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) dispatch(deleteCouponAction(id));
  };

  return (
    <div className="p-[30px] bg-[#f5f7fb] min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-[26px] font-semibold">Coupons</h2>
        <button onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white border-none px-4 py-2 rounded-md text-[13px] cursor-pointer transition-colors">
          <FaPlus /> Add Coupon
        </button>
      </div>

      {loading && <p className="text-sm text-[#6b7280] mb-3">Loading...</p>}
      {error   && <p className="text-sm text-red-500 mb-3">{error}</p>}

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-x-auto">
        <table className="w-full border-collapse min-w-[600px]">
          <thead className="bg-[#f1f5f9]">
            <tr>
              {["Code","Type","Value","Max","Min Amt","Validity","Status","Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-sm font-semibold text-[#374151]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {coupons?.length > 0 ? (
              coupons.map((item) => {
                const isExpired = new Date(item.valid_to) < new Date();
                return (
                  <tr key={item.id} className="border-t border-[#eee] hover:bg-[#f9fafb]">
                    <td className="px-4 py-3 text-sm text-[#374151]">{item.code}</td>
                    <td className="px-4 py-3 text-sm text-[#374151]">{item.discount_type === "percentage" ? "Percentage" : "Flat"}</td>
                    <td className="px-4 py-3 text-sm text-[#374151]">{item.discount_type === "percentage" ? `${item.discount_value}%` : `₹${item.discount_value}`}</td>
                    <td className="px-4 py-3 text-sm text-[#374151]">{item.max_discount || "-"}</td>
                    <td className="px-4 py-3 text-sm text-[#374151]">₹{item.min_amount}</td>
                    <td className="px-4 py-3 text-sm text-[#374151]">
                      {item.valid_from?.slice(0, 10)}<br />{item.valid_to?.slice(0, 10)}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#374151]">
                      {isExpired ? "Expired" : item.is_active ? "Active" : "Inactive"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <FaEdit className="text-[#2563eb] cursor-pointer text-base hover:text-[#1d4ed8] transition-colors" onClick={() => handleEdit(item)} />
                        <FaTrash className="text-[#dc2626] cursor-pointer text-base hover:text-[#b91c1c] transition-colors" onClick={() => handleDelete(item.id)} />
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr><td colSpan="8" className="text-center py-6 text-sm text-[#6b7280]">No Coupons Found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/35 flex justify-center items-center z-[1000] px-4">
          <div className="bg-white w-full max-w-[420px] p-6 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-[20px] font-semibold">{editId ? "Edit Coupon" : "Add Coupon"}</h3>
              <FaTimes className="cursor-pointer text-[18px] text-[#6b7280] hover:text-[#111827] transition-colors" onClick={() => setShowModal(false)} />
            </div>

            <div className="flex flex-col gap-4">
              <input name="code" placeholder="Coupon Code" value={formData.code} onChange={handleChange} required className={inputCls} />
              <select name="discount_type" value={formData.discount_type} onChange={handleChange} className={inputCls}>
                <option value="percentage">Percentage</option>
                <option value="flat">Flat</option>
              </select>
              <input type="number" name="discount_value" placeholder="Discount Value" value={formData.discount_value} onChange={handleChange} required className={inputCls} />
              <input type="number" name="max_discount" placeholder="Max Discount" value={formData.max_discount} onChange={handleChange} className={inputCls} />
              <input type="number" name="min_amount" placeholder="Minimum Amount" value={formData.min_amount} onChange={handleChange} required className={inputCls} />
              <input type="datetime-local" name="valid_from" value={formData.valid_from} onChange={handleChange} required className={inputCls} />
              <input type="datetime-local" name="valid_to" value={formData.valid_to} onChange={handleChange} required className={inputCls} />
              <div className="flex items-center gap-2 text-sm">
                <input type="checkbox" id="is_active" name="is_active" checked={formData.is_active} onChange={handleChange} />
                <label htmlFor="is_active" className="cursor-pointer">Active</label>
              </div>
              <div className="flex justify-end mt-2">
                <button onClick={handleSubmit}
                  className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white border-none px-4 py-2 rounded-md text-sm cursor-pointer transition-colors">
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

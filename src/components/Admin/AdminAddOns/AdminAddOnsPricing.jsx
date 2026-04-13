import React, { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  getAddOnPricingAction, createAddOnPricingAction,
  updateAddOnPricingAction, deleteAddOnPricingAction,
} from "../../../redux/actions/AdminAddOnPricingAction";
import AdminAPI from "../../../BaseAPI/AdminAPI";

const inputCls = "w-full px-[8px] py-[8px] border border-[#ddd] rounded-md text-sm outline-none focus:border-[#2563eb]";

const AdminAddOnPricing = () => {
  const dispatch = useDispatch();
  const { pricings, loading, error } = useSelector((state) => state.addonPricing);

  const [addons, setAddons] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const emptyForm = { addon: "", start_date: "", end_date: "", price: "" };
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    dispatch(getAddOnPricingAction());
    const fetchAddons = async () => {
      const { data } = await AdminAPI.get("catalog/admin/addons/");
      setAddons(data);
    };
    fetchAddons();
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!formData.addon)       { toast.warn("Please select an AddOn."); return; }
    if (!formData.start_date)  { toast.warn("Start Date is required."); return; }
    if (!formData.end_date)    { toast.warn("End Date is required."); return; }
    if (!formData.price)       { toast.warn("Price is required."); return; }
    if (editId) { dispatch(updateAddOnPricingAction(editId, formData)); }
    else        { dispatch(createAddOnPricingAction(formData)); }
    setShowModal(false);
    setEditId(null);
  };

  const handleEdit = (item) => {
    setFormData({ addon: item.addon, start_date: item.start_date, end_date: item.end_date, price: item.price });
    setEditId(item.id);
    setShowModal(true);
  };

  return (
    <div className="p-[30px] bg-white min-h-screen">

      {/* HEADER */}
      <div className="flex justify-end items-center mb-5">
        <button
          onClick={() => { setFormData(emptyForm); setEditId(null); setShowModal(true); }}
          className="flex items-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white border-none px-4 py-2 rounded-md text-[13px] font-medium cursor-pointer transition-colors"
        >
          <FaPlus /> Add Pricing
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-x-auto">
        <table className="w-full border-collapse min-w-[400px]">
          <thead className="bg-[#f1f5f9]">
            <tr>
              {["AddOn", "Start Date", "End Date", "Price", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-sm font-semibold text-[#374151]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="text-center py-6">
                <div className="flex items-center justify-center gap-2 text-sm text-[#6b7280]">
                  <div className="w-5 h-5 border-[3px] border-[#e5e7eb] border-t-[#2563eb] rounded-full animate-spin" />
                  Loading pricing...
                </div>
              </td></tr>
            ) : error ? (
              <tr><td colSpan="5" className="text-center py-6 text-sm text-[#dc2626]">
                ⚠️ Failed to load pricing. Please try again.
              </td></tr>
            ) : !pricings?.length ? (
              <tr><td colSpan="5" className="text-center py-6 text-sm text-[#6b7280]">💰 No Pricing Found</td></tr>
            ) : (
              pricings.map((item) => (
                <tr key={item.id} className="border-t border-[#eee] hover:bg-[#f9fafb]">
                  <td className="px-4 py-3 text-sm text-[#374151]">{item.addon_name || item.addon}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{item.start_date}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{item.end_date}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">₹{item.price}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <FaEdit
                        className="text-[#2563eb] cursor-pointer text-base hover:text-[#1d4ed8] transition-colors"
                        onClick={() => handleEdit(item)}
                      />
                      <FaTrash
                        className="text-[#dc2626] cursor-pointer text-base hover:text-[#b91c1c] transition-colors"
                        onClick={() => dispatch(deleteAddOnPricingAction(item.id))}
                      />
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
        <div className="fixed inset-0 bg-black/35 flex justify-center items-center z-[1000] px-4">
          <div className="bg-white w-full max-w-[420px] p-6 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] max-h-[90vh] overflow-y-auto">

            <div className="flex justify-between items-center mb-5">
              <h3 className="text-[20px] font-semibold">Add AddOn Pricing</h3>
              <FaTimes
                className="cursor-pointer text-[18px] text-[#6b7280] hover:text-[#111827] transition-colors"
                onClick={() => setShowModal(false)}
              />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-[#374151]">AddOn</label>
                <select name="addon" value={formData.addon} onChange={handleChange} className={inputCls}>
                  <option value="">Select AddOn</option>
                  {addons.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-[#374151]">Start Date</label>
                <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} className={inputCls} />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-[#374151]">End Date</label>
                <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} className={inputCls} />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-[#374151]">Price</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} className={inputCls} />
              </div>

              <div className="flex justify-end mt-2">
                <button
                  onClick={handleSubmit}
                  className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white border-none px-4 py-2 rounded-md text-sm cursor-pointer transition-colors"
                >
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

export default AdminAddOnPricing;

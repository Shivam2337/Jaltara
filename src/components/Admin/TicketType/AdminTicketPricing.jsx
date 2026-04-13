import React, { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  getTicketPricingAction, createTicketPricingAction,
  updateTicketPricingAction, deleteTicketPricingAction,
} from "../../../redux/actions/AdminTicketPricingAction";
import AdminAPI from "../../../BaseAPI/AdminAPI";
import { toast } from "react-toastify";

const inputCls = "w-full px-[8px] py-[8px] border border-[#ddd] rounded-md text-sm outline-none focus:border-[#2563eb]";

const AdminTicketPricing = () => {
  const dispatch = useDispatch();
  const { ticketPricing, loading, error } = useSelector((state) => state.ticketPricing);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const emptyForm = {
    ticket_type: "", start_date: "", end_date: "",
    adult_price: "", child_price: "", senior_price: "",
    weekend_adult_price: "", weekend_child_price: "", weekend_senior_price: "",
    group_price: "", group_discount_percent: "", group_min_size: "",
  };
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    dispatch(getTicketPricingAction());
    const fetchTicketTypes = async () => {
      try {
        const { data } = await AdminAPI.get("catalog/admin/ticket-types/");
        setTicketTypes(data.results || data);
      } catch (err) { console.error("Ticket types fetch error:", err); }
    };
    fetchTicketTypes();
  }, [dispatch]);

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

  const handleSubmit = () => {
    if (editId) { dispatch(updateTicketPricingAction(editId, formData)); }
    else { dispatch(createTicketPricingAction(formData)); }
    resetForm();
  };

  const resetForm = () => { setFormData(emptyForm); setEditId(null); setShowModal(false); };

  const handleEdit = (item) => {
    setFormData({
      ticket_type: item.ticket_type, start_date: item.start_date, end_date: item.end_date,
      adult_price: item.adult_price, child_price: item.child_price, senior_price: item.senior_price,
      weekend_adult_price: item.weekend_adult_price, weekend_child_price: item.weekend_child_price,
      weekend_senior_price: item.weekend_senior_price, group_price: item.group_price,
      group_discount_percent: item.group_discount_percent, group_min_size: item.group_min_size,
    });
    setEditId(item.id);
    setShowModal(true);
  };

  return (
    <div className="p-[30px] bg-white min-h-screen">

      <div className="flex justify-end mb-5">
        <button onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white border-none px-4 py-2 rounded-md text-[13px] font-medium cursor-pointer transition-colors">
          <FaPlus /> Add Pricing
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-x-auto">
        <table className="w-full border-collapse min-w-[900px]">
          <thead className="bg-[#f1f5f9]">
            <tr>
              {["Ticket","Start","End","Adult","Child","Senior","Wknd Adult","Wknd Child","Wknd Senior","Group","Group %","Min Size","Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-sm font-semibold text-[#374151]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="13" className="text-center py-6">
                <div className="flex items-center justify-center gap-2 text-sm text-[#6b7280]">
                  <div className="w-5 h-5 border-[3px] border-[#e5e7eb] border-t-[#2563eb] rounded-full animate-spin" />
                  Loading pricing...
                </div>
              </td></tr>
            ) : error ? (
              <tr><td colSpan="13" className="text-center py-6 text-sm text-[#dc2626]">⚠️ Failed to load pricing.</td></tr>
            ) : !ticketPricing?.length ? (
              <tr><td colSpan="13" className="text-center py-6 text-sm text-[#6b7280]">💰 No Pricing Found</td></tr>
            ) : (
              ticketPricing.map((item) => (
                <tr key={item.id} className="border-t border-[#eee] hover:bg-[#f9fafb]">
                  <td className="px-4 py-3 text-sm text-[#374151]">{item.ticket_name}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{item.start_date}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{item.end_date}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{item.adult_price}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{item.child_price}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{item.senior_price}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{item.weekend_adult_price}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{item.weekend_child_price}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{item.weekend_senior_price}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{item.group_price}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{item.group_discount_percent}%</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{item.group_min_size}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <FaEdit className="text-[#2563eb] cursor-pointer text-base hover:text-[#1d4ed8] transition-colors" onClick={() => handleEdit(item)} />
                      <FaTrash className="text-[#dc2626] cursor-pointer text-base hover:text-[#b91c1c] transition-colors" onClick={() => dispatch(deleteTicketPricingAction(item.id))} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/35 flex justify-center items-center z-[1000] px-4">
          <div className="bg-white w-full max-w-[420px] p-6 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-[20px] font-semibold">{editId ? "Edit Pricing" : "Add Pricing"}</h3>
              <FaTimes className="cursor-pointer text-[18px] text-[#6b7280] hover:text-[#111827] transition-colors" onClick={() => setShowModal(false)} />
            </div>

            <form className="flex flex-col gap-3" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              <select name="ticket_type" value={formData.ticket_type} onChange={handleChange} required className={inputCls}>
                <option value="">Select Ticket Type</option>
                {ticketTypes?.map((ticket) => (
                  <option key={ticket.id} value={ticket.id}>{ticket.name}</option>
                ))}
              </select>
              <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} required className={inputCls} />
              <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} required className={inputCls} />
              <input type="number" name="adult_price" placeholder="Adult Price" value={formData.adult_price} onChange={handleChange} required className={inputCls} />
              <input type="number" name="child_price" placeholder="Child Price" value={formData.child_price} onChange={handleChange} required className={inputCls} />
              <input type="number" name="senior_price" placeholder="Senior Price" value={formData.senior_price} onChange={handleChange} className={inputCls} />
              <input type="number" name="weekend_adult_price" placeholder="Weekend Adult Price" value={formData.weekend_adult_price} onChange={handleChange} className={inputCls} />
              <input type="number" name="weekend_child_price" placeholder="Weekend Child Price" value={formData.weekend_child_price} onChange={handleChange} className={inputCls} />
              <input type="number" name="weekend_senior_price" placeholder="Weekend Senior Price" value={formData.weekend_senior_price} onChange={handleChange} className={inputCls} />
              <input type="number" name="group_price" placeholder="Group Price" value={formData.group_price} onChange={handleChange} className={inputCls} />
              <input type="number" name="group_discount_percent" placeholder="Group Discount %" value={formData.group_discount_percent} onChange={handleChange} required className={inputCls} />
              <input type="number" name="group_min_size" placeholder="Group Min Size" value={formData.group_min_size} onChange={handleChange} required className={inputCls} />

              <div className="flex justify-end mt-2">
                <button type="submit"
                  className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white border-none px-4 py-2 rounded-md text-sm cursor-pointer transition-colors">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTicketPricing;

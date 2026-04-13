import React, { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  getTicketTypesAction, createTicketTypeAction,
  updateTicketTypeAction, deleteTicketTypeAction,
} from "../../../redux/actions/AdminTicketTypeAction";
import { toast } from "react-toastify";

const inputCls = "w-full px-[8px] py-[8px] border border-[#ddd] rounded-md text-sm outline-none focus:border-[#2563eb]";

const AdminTicketType = () => {
  const dispatch = useDispatch();
  const { ticketTypes, loading, error } = useSelector((state) => state.ticketTypes);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const emptyForm = {
    name: "", duration_hours: "", includes_meal: false,
    includes_stay: false, max_capacity_per_slot: "",
    entry_anytime: true, is_active: true,
  };
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => { dispatch(getTicketTypesAction()); }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = () => {
    if (editId) { dispatch(updateTicketTypeAction(editId, formData)); }
    else { dispatch(createTicketTypeAction(formData)); }
    resetForm();
  };

  const resetForm = () => { setFormData(emptyForm); setEditId(null); setShowModal(false); };

  const handleEdit = (ticket) => {
    setFormData({
      name: ticket.name || "", duration_hours: ticket.duration_hours || "",
      includes_meal: ticket.includes_meal || false, includes_stay: ticket.includes_stay || false,
      max_capacity_per_slot: ticket.max_capacity_per_slot || "",
      entry_anytime: ticket.entry_anytime || false, is_active: ticket.is_active || false,
    });
    setEditId(ticket.id);
    setShowModal(true);
  };

  const checks = [
    { name: "includes_meal",  label: "Includes Meal" },
    { name: "includes_stay",  label: "Includes Stay" },
    { name: "entry_anytime",  label: "Entry Anytime" },
    { name: "is_active",      label: "Active" },
  ];

  return (
    <div className="p-[30px] bg-white min-h-screen">

      <div className="flex justify-end mb-5">
        <button onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white border-none px-4 py-2 rounded-md text-[13px] font-medium cursor-pointer transition-colors">
          <FaPlus /> Add Ticket
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-x-auto">
        <table className="w-full border-collapse min-w-[600px]">
          <thead className="bg-[#f1f5f9]">
            <tr>
              {["Name","Duration","Meal","Stay","Capacity","Entry","Status","Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-sm font-semibold text-[#374151]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" className="text-center py-6">
                <div className="flex items-center justify-center gap-2 text-sm text-[#6b7280]">
                  <div className="w-5 h-5 border-[3px] border-[#e5e7eb] border-t-[#2563eb] rounded-full animate-spin" />
                  Loading ticket types...
                </div>
              </td></tr>
            ) : error ? (
              <tr><td colSpan="8" className="text-center py-6 text-sm text-[#dc2626]">⚠️ Failed to load ticket types.</td></tr>
            ) : !ticketTypes?.length ? (
              <tr><td colSpan="8" className="text-center py-6 text-sm text-[#6b7280]">🎫 No Ticket Types Found</td></tr>
            ) : (
              ticketTypes.map((ticket) => (
                <tr key={ticket.id} className="border-t border-[#eee] hover:bg-[#f9fafb]">
                  <td className="px-4 py-3 text-sm text-[#374151]">{ticket.name}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{ticket.duration_hours} hrs</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{ticket.includes_meal ? "Yes" : "No"}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{ticket.includes_stay ? "Yes" : "No"}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{ticket.max_capacity_per_slot}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{ticket.entry_anytime ? "Anytime" : "Fixed"}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{ticket.is_active ? "Active" : "Inactive"}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <FaEdit className="text-[#2563eb] cursor-pointer text-base hover:text-[#1d4ed8] transition-colors" onClick={() => handleEdit(ticket)} />
                      <FaTrash className="text-[#dc2626] cursor-pointer text-base hover:text-[#b91c1c] transition-colors" onClick={() => dispatch(deleteTicketTypeAction(ticket.id))} />
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
              <h3 className="text-[20px] font-semibold">{editId ? "Edit Ticket Type" : "Add Ticket Type"}</h3>
              <FaTimes className="cursor-pointer text-[18px] text-[#6b7280] hover:text-[#111827] transition-colors" onClick={() => setShowModal(false)} />
            </div>

            <form className="flex flex-col gap-3" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              <input name="name" placeholder="Ticket Name" value={formData.name} onChange={handleChange} required className={inputCls} />
              <input type="number" name="duration_hours" placeholder="Duration Hours" value={formData.duration_hours} onChange={handleChange} required className={inputCls} />
              <input type="number" name="max_capacity_per_slot" placeholder="Capacity per Slot" value={formData.max_capacity_per_slot} onChange={handleChange} required className={inputCls} />

              {checks.map(({ name, label }) => (
                <div key={name} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" id={name} name={name} checked={formData[name]} onChange={handleChange} />
                  <label htmlFor={name} className="cursor-pointer">{label}</label>
                </div>
              ))}

              <div className="flex justify-end mt-2">
                <button type="submit"
                  className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white border-none px-4 py-2 rounded-md text-sm cursor-pointer transition-colors">
                  {editId ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTicketType;

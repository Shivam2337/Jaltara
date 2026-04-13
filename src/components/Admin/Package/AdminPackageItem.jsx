import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaFilter, FaTimes, FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  getPackageItems, createPackageItem, updatePackageItem, deletePackageItem,
} from "../../../redux/actions/AdminPackageItemAction";
import AdminAPI from "../../../BaseAPI/AdminAPI";
import { toast } from "react-toastify";

const inputCls = "w-full px-[10px] py-[8px] border border-[#ddd] rounded-md text-sm outline-none focus:border-[#2563eb]";

export default function AdminPackageItems() {
  const dispatch = useDispatch();
  const { packageItems, loading, error } = useSelector((state) => state.packageItems);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [itemType, setItemType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [packages, setPackages] = useState([]);
  const [roomCategories, setRoomCategories] = useState([]);
  const [ticketTypes, setTicketTypes] = useState([]);

  useEffect(() => {
    dispatch(getPackageItems());
    const fetchPackages = async () => { const { data } = await AdminAPI.get("catalog/admin/packages/"); setPackages(data); };
    const fetchRoomCategories = async () => { const { data } = await AdminAPI.get("catalog/admin/room-categories/"); setRoomCategories(data); };
    const fetchTicketTypes = async () => { const { data } = await AdminAPI.get("catalog/admin/ticket-types/"); setTicketTypes(data); };
    fetchPackages(); fetchRoomCategories(); fetchTicketTypes();
  }, [dispatch]);

  const emptyForm = { package: "", item_type: "", room_category: "", ticket_type: "", ride: "", quantity: "" };
  const [formData, setFormData] = useState(emptyForm);

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) { dispatch(updatePackageItem(editId, formData)); }
    else { dispatch(createPackageItem(formData)); }
    setShowModal(false); setEditId(null);
    setFormData({ package_name: "", item_type: "", room_category_name: "", ticket_type_name: "", ride: "", quantity: "" });
  };

  const handleEdit = (item) => {
    setShowModal(true); setEditId(item.id); setItemType(item.item_type);
    setFormData({ package: item.package, item_type: item.item_type, room_category: item.room_category || "", ticket_type: item.ticket_type || "", ride: item.ride || "", quantity: item.quantity });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) dispatch(deletePackageItem(id));
  };

  const filteredItems = packageItems?.filter((item) =>
    item.item_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-5 bg-white min-h-screen font-[Poppins]">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 mb-5">
        <div className="flex items-center gap-2 bg-white border border-[#e5e7eb] px-3 py-2 rounded-lg w-full sm:w-[260px]">
          <FaSearch className="text-[#9ca3af] shrink-0" />
          <input type="text" placeholder="Search Package Items" value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-none outline-none w-full text-sm bg-transparent" />
        </div>
        <button onClick={() => { setShowModal(true); setEditId(null); setItemType(""); setFormData(emptyForm); }}
          className="flex items-center justify-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-4 py-2 rounded-lg text-sm border-none cursor-pointer transition-colors">
          <FaPlus /> Add Package Item
        </button>
        <button className="flex items-center justify-center gap-2 bg-white border border-[#ddd] hover:bg-[#f3f4f6] px-4 py-2 rounded-lg text-sm cursor-pointer transition-colors">
          <FaFilter /> Filter
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-x-auto">
        <table className="w-full border-collapse min-w-[600px]">
          <thead className="bg-[#f1f5f9]">
            <tr>
              {["Package","Item Type","Room Category","Ticket Type","Ride","Quantity","Action"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-sm font-semibold text-[#374151]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="text-center py-6 text-sm text-[#6b7280]">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-[3px] border-[#e5e7eb] border-t-[#2563eb] rounded-full animate-spin" />
                  Loading package items...
                </div>
              </td></tr>
            ) : error ? (
              <tr><td colSpan="7" className="text-center py-6 text-sm text-[#dc2626]">⚠️ Failed to load package items. Please try again.</td></tr>
            ) : filteredItems && filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <tr key={item.id} className="border-t border-[#eee] hover:bg-[#f9fafb]">
                  <td className="px-4 py-3 text-sm text-[#374151]">{item.package_name}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{item.item_type}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{item.room_category_name || "-"}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{item.ticket_type_name || "-"}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{item.ride || "-"}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{item.quantity}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(item)}
                        className="bg-transparent border-none text-[#f59e0b] hover:text-[#d97706] text-base cursor-pointer transition-colors hover:scale-110">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(item.id)}
                        className="bg-transparent border-none text-[#dc2626] hover:text-[#b91c1c] text-base cursor-pointer transition-colors hover:scale-110">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="7" className="text-center py-6 text-sm text-[#6b7280]">📦 No Package Items Found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[999] px-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-[450px] max-h-[90vh] overflow-y-auto shadow-[0_5px_20px_rgba(0,0,0,0.2)]">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold">{editId ? "Edit Package Item" : "Add Package Item"}</h3>
              <FaTimes className="cursor-pointer text-[#6b7280] hover:text-[#111827] transition-colors" onClick={() => setShowModal(false)} />
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[13px] text-[#374151]">Package Name</label>
                <select name="package" value={formData.package} onChange={handleChange} required className={inputCls}>
                  <option value="">Select Package</option>
                  {packages.map((pkg) => <option key={pkg.id} value={pkg.id}>{pkg.name}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[13px] text-[#374151]">Item Type</label>
                <select name="item_type" value={formData.item_type}
                  onChange={(e) => { setItemType(e.target.value); handleChange(e); }} required className={inputCls}>
                  <option value="">Select Type</option>
                  <option value="room">Room</option>
                  <option value="ticket">Ticket</option>
                  <option value="ride">Ride</option>
                  <option value="meal">Meal</option>
                </select>
              </div>

              {itemType === "room" && (
                <div className="flex flex-col gap-1">
                  <label className="text-[13px] text-[#374151]">Room Category</label>
                  <select name="room_category" value={formData.room_category} onChange={handleChange} className={inputCls}>
                    <option value="">Select Room Category</option>
                    {roomCategories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
              )}

              {itemType === "ticket" && (
                <div className="flex flex-col gap-1">
                  <label className="text-[13px] text-[#374151]">Ticket Type</label>
                  <select name="ticket_type" value={formData.ticket_type} onChange={handleChange} className={inputCls}>
                    <option value="">Select Ticket Type</option>
                    {ticketTypes.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              )}

              {itemType === "ride" && (
                <div className="flex flex-col gap-1">
                  <label className="text-[13px] text-[#374151]">Ride</label>
                  <input type="number" name="ride" value={formData.ride} onChange={handleChange} className={inputCls} />
                </div>
              )}

              <div className="flex flex-col gap-1">
                <label className="text-[13px] text-[#374151]">Quantity</label>
                <input type="number" min="1" name="quantity" value={formData.quantity} onChange={handleChange} required className={inputCls} />
              </div>

              <div className="flex justify-end gap-3 mt-2">
                <button type="submit"
                  className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white border-none px-4 py-2 rounded-md text-sm cursor-pointer transition-colors">
                  Save
                </button>
                <button type="button" onClick={() => setShowModal(false)}
                  className="bg-[#b5b8bc] hover:bg-[#8f9397] text-white border-none px-4 py-2 rounded-md text-sm cursor-pointer transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

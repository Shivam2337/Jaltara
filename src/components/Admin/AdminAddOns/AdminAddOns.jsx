import React, { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  getAddOnsAction, createAddOnAction, updateAddOnAction, deleteAddOnAction,
} from "../../../redux/actions/AdminAddOnsAction";

const inputCls = "w-full px-[8px] py-[8px] border border-[#ddd] rounded-md text-sm outline-none focus:border-[#2563eb]";

const AdminAddOns = () => {
  const dispatch = useDispatch();
  const { addons, loading, error } = useSelector((state) => state.addons);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: "", addon_type: "ride", is_per_person: true, is_active: true,
  });

  useEffect(() => { dispatch(getAddOnsAction()); }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) { toast.warn("Name is required."); return; }
    if (editId) { dispatch(updateAddOnAction(editId, formData)); }
    else { dispatch(createAddOnAction(formData)); }
    setShowModal(false);
    setEditId(null);
  };

  const handleEdit = (addon) => {
    setFormData(addon);
    setEditId(addon.id);
    setShowModal(true);
  };

  return (
    <div className="p-[30px] bg-white min-h-screen">

      {/* HEADER */}
      <div className="flex justify-end items-center mb-5">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white border-none px-4 py-2 rounded-md text-[13px] font-medium cursor-pointer transition-colors"
        >
          <FaPlus /> Add AddOn
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-x-auto">
        <table className="w-full border-collapse min-w-[400px]">
          <thead className="bg-[#f1f5f9]">
            <tr>
              {["Name", "Type", "Per Person", "Status", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-sm font-semibold text-[#374151]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="text-center py-6">
                <div className="flex items-center justify-center gap-2 text-sm text-[#6b7280]">
                  <div className="w-5 h-5 border-[3px] border-[#e5e7eb] border-t-[#2563eb] rounded-full animate-spin" />
                  Loading add-ons...
                </div>
              </td></tr>
            ) : error ? (
              <tr><td colSpan="5" className="text-center py-6 text-sm text-[#dc2626]">
                ⚠️ Failed to load add-ons. Please try again.
              </td></tr>
            ) : !addons?.length ? (
              <tr><td colSpan="5" className="text-center py-6 text-sm text-[#6b7280]">🧩 No Add-Ons Found</td></tr>
            ) : (
              addons.map((addon) => (
                <tr key={addon.id} className="border-t border-[#eee] hover:bg-[#f9fafb]">
                  <td className="px-4 py-3 text-sm text-[#374151]">{addon.name}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{addon.addon_type}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{addon.is_per_person ? "Yes" : "No"}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{addon.is_active ? "Active" : "Inactive"}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <FaEdit
                        className="text-[#2563eb] cursor-pointer text-base hover:text-[#1d4ed8] transition-colors"
                        onClick={() => handleEdit(addon)}
                      />
                      <FaTrash
                        className="text-[#dc2626] cursor-pointer text-base hover:text-[#b91c1c] transition-colors"
                        onClick={() => dispatch(deleteAddOnAction(addon.id))}
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
              <h3 className="text-[20px] font-semibold">Add Add-On</h3>
              <FaTimes
                className="cursor-pointer text-[18px] text-[#6b7280] hover:text-[#111827] transition-colors"
                onClick={() => setShowModal(false)}
              />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-[#374151]">Name</label>
                <input name="name" value={formData.name} onChange={handleChange} className={inputCls} />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-[#374151]">Type</label>
                <select name="addon_type" value={formData.addon_type} onChange={handleChange} className={inputCls}>
                  <option value="ride">Ride</option>
                  <option value="meal">Meal</option>
                  <option value="locker">Locker</option>
                  <option value="costume">Costume</option>
                </select>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <input type="checkbox" id="is_per_person" name="is_per_person"
                  checked={formData.is_per_person} onChange={handleChange} />
                <label htmlFor="is_per_person" className="cursor-pointer">Per Person</label>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <input type="checkbox" id="is_active" name="is_active"
                  checked={formData.is_active} onChange={handleChange} />
                <label htmlFor="is_active" className="cursor-pointer">Active</label>
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

export default AdminAddOns;

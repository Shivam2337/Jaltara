import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getPackagePricing, createPackagePricing, deletePackagePricing, updatePackagePricing,
} from "../../../redux/actions/AdminPackagePricingAction";
import AdminAPI from "../../../BaseAPI/AdminAPI";
import { FaEdit, FaTrash, FaTimes, FaSearch, FaFilter, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";

const inputCls = "w-full px-[10px] py-[9px] border border-[#d1d5db] rounded-md text-sm outline-none focus:border-[#2563eb] box-border";

const AdminPackagePricing = () => {
  const dispatch = useDispatch();
  const { pricing, loading, error } = useSelector((state) => state.packagePricing);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    dispatch(getPackagePricing());
    const fetchPackages = async () => { const { data } = await AdminAPI.get("catalog/admin/packages/"); setPackages(data); };
    fetchPackages();
  }, [dispatch]);

  const emptyForm = {
    package_name: "", start_date: "", end_date: "", base_price: "",
    included_adults: "", included_children: "", included_seniors: "",
    extra_adult_price: "", extra_child_price: "", extra_senior_price: "",
  };
  const [formData, setFormData] = useState(emptyForm);

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

  const resetForm = () => { setFormData(emptyForm); setEditId(null); };

  const handleEdit = (item) => {
    setShowModal(true); setEditId(item.id);
    setFormData({
      package_name: item.package, start_date: item.start_date, end_date: item.end_date,
      base_price: item.base_price, included_adults: item.included_adults,
      included_children: item.included_children, included_seniors: item.included_seniors,
      extra_adult_price: item.extra_adult_price, extra_child_price: item.extra_child_price,
      extra_senior_price: item.extra_senior_price,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      package: Number(formData.package_name), start_date: formData.start_date, end_date: formData.end_date,
      base_price: Number(formData.base_price), included_adults: Number(formData.included_adults),
      included_children: Number(formData.included_children), included_seniors: Number(formData.included_seniors),
      extra_adult_price: Number(formData.extra_adult_price), extra_child_price: Number(formData.extra_child_price),
      extra_senior_price: Number(formData.extra_senior_price),
    };
    if (editId) { dispatch(updatePackagePricing(editId, payload)); dispatch(getPackagePricing()); }
    else { dispatch(createPackagePricing(payload)); }
    resetForm(); setShowModal(false);
  };

  const filteredPricing = pricing?.filter((item) =>
    item.package_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-5 bg-white min-h-screen font-[Poppins]">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 mb-5">
        <div className="flex items-center gap-2 bg-white border border-[#ddd] px-4 py-[10px] rounded-lg w-full sm:w-[260px]">
          <FaSearch className="text-[#999] shrink-0" />
          <input type="text" placeholder="Search name" value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-none outline-none w-full text-sm bg-transparent" />
        </div>
        <button onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center justify-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-4 py-2 rounded-md text-sm border-none cursor-pointer transition-colors">
          <FaPlus /> Add Pricing
        </button>
        <button className="flex items-center justify-center gap-2 bg-white border border-[#ddd] hover:bg-[#f3f4f6] px-4 py-2 rounded-md text-sm cursor-pointer transition-colors">
          <FaFilter /> Filter
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-x-auto">
        <table className="w-full border-collapse min-w-[800px]">
          <thead className="bg-[#f1f5f9]">
            <tr>
              {["Package","Start","End","Base","Adults","Children","Seniors","Extra Adult","Extra Child","Extra Senior","Action"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-sm font-semibold text-[#374151]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="11" className="text-center py-6 text-sm text-[#6b7280]">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-[3px] border-[#e5e7eb] border-t-[#2563eb] rounded-full animate-spin" />
                  Loading pricing...
                </div>
              </td></tr>
            ) : filteredPricing?.length === 0 ? (
              <tr><td colSpan="11" className="text-center py-6 text-sm text-[#6b7280]">💰 No Pricing Found</td></tr>
            ) : (
              filteredPricing.map((item) => (
                <tr key={item.id} className="border-t border-[#eee] hover:bg-[#f9fafb]">
                  <td className="px-4 py-3 text-sm text-[#374151]">{item.package_name}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{item.start_date}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{item.end_date}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">₹{item.base_price}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{item.included_adults}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{item.included_children}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{item.included_seniors}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">₹{item.extra_adult_price}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">₹{item.extra_child_price}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">₹{item.extra_senior_price}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(item)}
                        className="bg-transparent border-none text-[#f59e0b] hover:text-[#d97706] text-base cursor-pointer transition-colors hover:scale-110">
                        <FaEdit />
                      </button>
                      <button onClick={() => dispatch(deletePackagePricing(item.id))}
                        className="bg-transparent border-none text-[#dc2626] hover:text-[#b91c1c] text-base cursor-pointer transition-colors hover:scale-110">
                        <FaTrash />
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
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[1000] px-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-[520px] max-h-[90vh] overflow-y-auto relative shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
            <span className="absolute top-[10px] right-[14px] text-[20px] cursor-pointer text-[#6b7280] hover:text-black transition-colors"
              onClick={() => setShowModal(false)}><FaTimes /></span>
            <h3 className="text-lg font-semibold mb-4">{editId ? "Edit Pricing" : "Add Pricing"}</h3>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[10px] mt-4">
                <div className="col-span-1 sm:col-span-2 flex flex-col gap-1">
                  <label className="text-sm">Package Name</label>
                  <select name="package_name" value={formData.package_name} onChange={handleChange} required className={inputCls}>
                    <option value="">Select Package</option>
                    {packages.map((pkg) => <option key={pkg.id} value={pkg.id}>{pkg.name}</option>)}
                  </select>
                </div>
                <input type="date" required name="start_date" value={formData.start_date} onChange={handleChange} className={inputCls} />
                <input type="date" required name="end_date" value={formData.end_date} onChange={handleChange} className={inputCls} />
                <input name="base_price" placeholder="Base Price" value={formData.base_price} onChange={handleChange} className={inputCls} />
                <input name="included_adults" placeholder="Included Adults" value={formData.included_adults} onChange={handleChange} className={inputCls} />
                <input name="included_children" placeholder="Included Children" value={formData.included_children} onChange={handleChange} className={inputCls} />
                <input name="included_seniors" placeholder="Included Seniors" value={formData.included_seniors} onChange={handleChange} className={inputCls} />
                <input name="extra_adult_price" placeholder="Extra Adult Price" value={formData.extra_adult_price} onChange={handleChange} className={inputCls} />
                <input name="extra_child_price" placeholder="Extra Child Price" value={formData.extra_child_price} onChange={handleChange} className={inputCls} />
                <input name="extra_senior_price" placeholder="Extra Senior Price" value={formData.extra_senior_price} onChange={handleChange} className={inputCls} />
              </div>

              <div className="flex justify-end gap-3 mt-5">
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
};

export default AdminPackagePricing;

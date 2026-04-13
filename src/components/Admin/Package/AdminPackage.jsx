import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getPackageAction, addPackageAction, editPackageAction, deletePackageAction,
} from "../../../redux/actions/AdminPackageAction";
import AdminAPI from "../../../BaseAPI/AdminAPI";
import { toast } from "react-toastify";
import { FaSearch, FaTimes, FaFilter, FaPlus } from "react-icons/fa";

const inputCls = "w-full px-[10px] py-[9px] border border-[#d1d5db] rounded-md text-sm outline-none focus:border-[#2563eb] box-border";

export default function AdminWaterParkPackage() {
  const dispatch = useDispatch();
  const { packageList, loading, error } = useSelector((state) => state.packages);

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  const emptyForm = {
    id: null, name: "", description: "", package_type: "",
    duration_hours: "", max_adults: "", max_children: "",
    max_seniors: "", is_active: true, image: null, image_id: null, image_preview: "",
  };
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => { dispatch(getPackageAction()); }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0], image_preview: URL.createObjectURL(files[0]) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) { toast.warn("Package Name is required."); return; }
    if (!formData.package_type) { toast.warn("Package Type is required."); return; }
    try {
      const payload = {
        name: formData.name, description: formData.description,
        package_type: formData.package_type, duration_hours: Number(formData.duration_hours),
        max_adults: Number(formData.max_adults), max_children: Number(formData.max_children),
        max_seniors: Number(formData.max_seniors), is_active: formData.is_active,
      };
      let response;
      if (formData.id) { response = await dispatch(editPackageAction(formData.id, payload)); }
      else { response = await dispatch(addPackageAction(payload)); }
      const packageId = response?.id || response?.payload?.id || response?.payload?.data?.id;
      if (formData.image && packageId) {
        const imageData = new FormData();
        imageData.append("package", packageId);
        imageData.append("image", formData.image);
        imageData.append("is_primary", true);
        await AdminAPI.post("catalog/admin/package-images/", imageData, { headers: { "Content-Type": "multipart/form-data" } });
      }
      dispatch(getPackageAction());
      setShowModal(false);
      setFormData(emptyForm);
    } catch (error) { console.error("Save Error:", error); }
  };

  const handleEdit = (item) => {
    const primaryImage = item.images?.[0];
    setFormData({
      id: item.id || null, name: item.name || "", description: item.description || "",
      package_type: item.package_type || "", duration_hours: item.duration_hours || "",
      max_adults: item.max_adults || "", max_children: item.max_children || "",
      max_seniors: item.max_seniors || "", is_active: item.is_active ?? true,
      image: null, image_id: primaryImage?.id || null, image_preview: primaryImage?.image || "",
    });
    setShowModal(true);
  };

  const handleDelete = (id) => { dispatch(deletePackageAction(id)); };

  const filteredPackages = packageList?.filter((item) =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-5 bg-white min-h-screen font-[Poppins]">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 mb-5">
        <div className="flex items-center gap-2 bg-white border border-[#ddd] px-4 py-[10px] rounded-lg w-full sm:w-[260px]">
          <FaSearch className="text-[#999] shrink-0" />
          <input type="text" placeholder="Search Package" value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-none outline-none w-full text-sm bg-transparent" />
        </div>
        <button onClick={() => { setFormData(emptyForm); setShowModal(true); }}
          className="flex items-center justify-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-4 py-2 rounded-md text-sm border-none cursor-pointer transition-colors">
          <FaPlus /> Add Package
        </button>
        <button className="flex items-center justify-center gap-2 bg-white border border-[#ddd] hover:bg-[#f3f4f6] px-4 py-2 rounded-md text-sm cursor-pointer transition-colors">
          <FaFilter /> Filter
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-x-auto">
        <table className="w-full border-collapse min-w-[700px]">
          <thead className="bg-[#f1f5f9]">
            <tr>
              {["Package Name","Image","Type","Duration","Adults","Children","Seniors","Status","Action"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-sm font-semibold text-[#374151]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="9" className="text-center py-6 text-sm text-[#6b7280]">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-[3px] border-[#e5e7eb] border-t-[#2563eb] rounded-full animate-spin" />
                  Loading packages...
                </div>
              </td></tr>
            ) : error ? (
              <tr><td colSpan="9" className="text-center py-6 text-sm text-[#dc2626]">⚠️ Failed to load packages. Please try again.</td></tr>
            ) : filteredPackages?.length === 0 ? (
              <tr><td colSpan="9" className="text-center py-6 text-sm text-[#6b7280]">📦 No Packages Found</td></tr>
            ) : (
              filteredPackages.map((item) => (
                <tr key={item.id} className="border-t border-[#eee] hover:bg-[#f9fafb]">
                  <td className="px-4 py-3 text-sm text-[#374151]">{item.name}</td>
                  <td className="px-4 py-3">
                    {item.images && item.images.length > 0 ? (
                      <img
                        src={item.images[0].image?.startsWith("http") ? item.images[0].image : `https://api.jaltara.techsofast.com${item.images[0].image}`}
                        alt="package"
                        className="w-[70px] h-[50px] rounded-md cursor-pointer object-cover hover:scale-105 transition-transform"
                        onError={(e) => { e.target.style.display = "none"; }}
                        onLoad={() => console.log("✅ Image loaded:", item.images[0].image)}
                        onClick={() => setPreviewImage(item.images[0].image?.startsWith("http") ? item.images[0].image : `https://api.jaltara.techsofast.com${item.images[0].image}`)}
                      />
                    ) : <span className="text-sm text-[#9ca3af]">No Image</span>}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{item.package_type}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{item.duration_hours} hrs</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{item.max_adults}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{item.max_children}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{item.max_seniors}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{item.is_active ? "Active" : "Inactive"}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(item)}
                        className="bg-[#f59e0b] hover:bg-[#d97706] text-white border-none px-[10px] py-[5px] rounded text-[13px] cursor-pointer transition-colors">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(item.id)}
                        className="bg-[#ef4444] hover:bg-[#dc2626] text-white border-none px-[10px] py-[5px] rounded text-[13px] cursor-pointer transition-colors">
                        Delete
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
          <div className="bg-white p-6 rounded-xl w-full max-w-[420px] max-h-[90vh] overflow-y-auto relative shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
            <span className="absolute top-[10px] right-[14px] text-[20px] cursor-pointer text-[#6b7280] hover:text-[#111827] transition-colors"
              onClick={() => setShowModal(false)}><FaTimes /></span>
            <h3 className="text-lg font-semibold mb-4">{formData.id ? "Edit Package" : "Add Package"}</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[10px] mt-4">
              <input type="text" name="name" placeholder="Package Name" value={formData.name} onChange={handleChange} required className={inputCls} />
              <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleChange} className={inputCls} />
              <select name="package_type" value={formData.package_type} onChange={handleChange} required className={inputCls}>
                <option value="">Select Package Type</option>
                <option value="special_offers">Special Offers</option>
                <option value="group_package">Group Package</option>
                <option value="combo">Combo</option>
              </select>
              <input type="number" name="duration_hours" placeholder="Duration Hours" value={formData.duration_hours} onChange={handleChange} className={inputCls} />
              <input type="number" name="max_adults" placeholder="Max Adults" value={formData.max_adults} onChange={handleChange} className={inputCls} />
              <input type="number" name="max_children" placeholder="Max Children" value={formData.max_children} onChange={handleChange} className={inputCls} />
              <input type="number" name="max_seniors" placeholder="Max Senior" value={formData.max_seniors} onChange={handleChange} className={inputCls} />
              <input type="file" name="image" accept="image/*" onChange={handleChange} className="text-sm col-span-1 sm:col-span-2" />
              {formData.image_preview && (
                <img src={formData.image_preview} alt="preview"
                  className="w-20 h-[60px] object-cover rounded-md col-span-1 sm:col-span-2" />
              )}
              <div className="flex items-center gap-2 text-sm col-span-1 sm:col-span-2">
                <input type="checkbox" id="is_active" checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} />
                <label htmlFor="is_active" className="cursor-pointer">Active</label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button onClick={handleSave}
                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white border-none px-4 py-2 rounded-md text-sm cursor-pointer transition-colors">
                Save
              </button>
              <button onClick={() => setShowModal(false)}
                className="bg-[#b5b8bc] hover:bg-[#d8dadc] text-white border-none px-4 py-2 rounded-md text-sm cursor-pointer transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMAGE PREVIEW */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-[9999]" onClick={() => setPreviewImage(null)}>
          <img src={previewImage} alt="preview" className="max-w-[80vw] max-h-[80vh] rounded-xl" />
        </div>
      )}
    </div>
  );
}

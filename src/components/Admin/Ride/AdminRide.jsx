import React, { useState, useEffect } from "react";
import { FaSearch, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  getRidesAction,
  addRideAction,
  editRidesAction,
  deleteRidesAction,
} from "../../../redux/actions/AdminRideAction";
import { toast } from "react-toastify";
import AdminAPI from "../../../BaseAPI/AdminAPI";

export default function RideManagement() {
  const dispatch = useDispatch();
  const { rides, loading, error } = useSelector((state) => state.rides);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const emptyForm = {
    name: "", slug: "", description: "", is_active: true,
    is_adult_only: false, min_age: "", max_age: "",
    image: null, image_preview: "", image_id: null,
  };

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => { dispatch(getRidesAction()); }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === "image" && files) {
      setFormData({ ...formData, image: files[0], image_preview: URL.createObjectURL(files[0]) });
      return;
    }
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleEdit = (ride) => {
    if (!ride) { toast("Ride data is missing."); return; }
    const primaryImage = ride.images?.find((img) => img.is_primary) || ride.images?.[0];
    setFormData({
      name: ride.name || "", slug: ride.slug || "", description: ride.description || "",
      is_active: ride.is_active ?? true, is_adult_only: ride.is_adult_only ?? false,
      min_age: ride.min_age || "", max_age: ride.max_age || "",
      image: null,
      image_preview: primaryImage ? `https://api.jaltara.techsofast.com${primaryImage.image}` : "",
      image_id: primaryImage?.id || null,
    });
    setEditingId(ride.id);
    setShowModal(true);
  };

  const handleDelete = (id) => dispatch(deleteRidesAction(id));

  const handleSubmit = async () => {
    if (!formData.name || !formData.slug || !formData.description || !formData.min_age || !formData.max_age) {
      toast("Please fill in all fields."); return;
    }
    try {
      const payload = {
        name: formData.name, slug: formData.slug, description: formData.description,
        is_active: formData.is_active, is_adult_only: formData.is_adult_only,
        min_age: formData.min_age, max_age: formData.max_age,
      };
      let response;
      if (editingId) {
        response = await dispatch(editRidesAction(editingId, payload));
        toast.success("Ride updated successfully!");
      } else {
        response = await dispatch(addRideAction(payload));
        toast.success("Ride added successfully!");
      }
      const rideId = response?.payload?.id || response?.id;
      if (formData.image && rideId) {
        const imageData = new FormData();
        imageData.append("ride", rideId);
        imageData.append("image", formData.image);
        imageData.append("is_primary", true);
        const res = await AdminAPI.post("catalog/admin/ride-images/", imageData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        dispatch({ type: "RIDE_ADD_IMAGE_LOCAL", payload: { rideId, image: res.data } });
      }
      setShowModal(false);
      setEditingId(null);
      setFormData(emptyForm);
    } catch (err) {
      toast.error(editingId ? "Failed to update ride." : "Failed to add ride.");
    }
  };

  const filteredRides = rides?.filter((ride) =>
    ride.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const inputCls = "px-3 py-2 border border-[#ccc] rounded-md text-sm outline-none focus:border-[#2563eb] w-full";
  const labelCls = "text-sm mb-1";

  return (
    <div className="p-4 sm:p-5 bg-[#f8fafc] min-h-screen font-[Poppins]">

      {/* TITLE + ACTION BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <h2 className="text-xl sm:text-[22px] font-semibold">Water Park Rides</h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-[#ddd] w-full sm:w-[260px]">
            <FaSearch className="text-[#999] shrink-0" />
            <input
              type="text"
              placeholder="Search rides"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-none outline-none w-full text-sm"
            />
          </div>
          {/* Add button */}
          <button
            onClick={() => { setFormData(emptyForm); setEditingId(null); setShowModal(true); }}
            className="flex items-center justify-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-4 py-2 rounded-lg text-sm cursor-pointer transition-colors"
          >
            <FaPlus /> Add Ride
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-x-auto">
        <table className="w-full border-collapse min-w-[700px]">
          <thead className="bg-[#f1f5f9]">
            <tr>
              {["Name", "Slug", "Description", "Active", "Adult Only", "Min Age", "Max Age", "Image", "Action"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-sm font-semibold text-[#444]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="9" className="text-center py-6 text-sm text-[#999]">Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan="9" className="text-center py-6 text-sm text-red-500">Error: {error}</td></tr>
            ) : filteredRides?.length === 0 ? (
              <tr><td colSpan="9" className="text-center py-6 text-sm text-[#999]">No data found</td></tr>
            ) : (
              filteredRides?.map((ride) => {
                const primaryImage = ride.images?.find((img) => img.is_primary) || ride.images?.[0];
                const imgSrc = primaryImage?.image?.startsWith("http")
                  ? primaryImage.image
                  : `https://api.jaltara.techsofast.com${primaryImage?.image}`;
                return (
                  <tr key={ride.id} className="border-t border-[#eee]">
                    <td className="px-4 py-3 text-sm align-middle">{ride.name}</td>
                    <td className="px-4 py-3 text-sm align-middle">{ride.slug}</td>
                    <td className="px-4 py-3 text-sm align-middle max-w-[180px] truncate">{ride.description}</td>
                    <td className="px-4 py-3 text-sm align-middle text-center">{ride.is_active ? "Yes" : "No"}</td>
                    <td className="px-4 py-3 text-sm align-middle text-center">{ride.is_adult_only ? "Yes" : "No"}</td>
                    <td className="px-4 py-3 text-sm align-middle text-center">{ride.min_age}</td>
                    <td className="px-4 py-3 text-sm align-middle text-center">{ride.max_age ?? "-"}</td>
                    <td className="px-4 py-3 align-middle text-center">
                      {primaryImage ? (
                        <img
                          src={imgSrc}
                          alt="ride"
                          onClick={() => setPreviewImage(imgSrc)}
                          onError={(e) => (e.target.src = "/placeholder.png")}
                          className="w-[90px] h-[60px] object-cover rounded-md cursor-pointer mx-auto border border-[#ccc] transition-transform duration-200 hover:scale-110 hover:shadow-lg"
                        />
                      ) : (
                        <span className="text-sm text-[#999]">No Image</span>
                      )}
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <div className="flex items-center justify-center gap-3">
                        <FaEdit
                          onClick={() => handleEdit(ride)}
                          className="text-[#ffa000] hover:text-[#e68900] cursor-pointer text-base transition-colors"
                        />
                        <FaTrash
                          onClick={() => handleDelete(ride.id)}
                          className="text-[#d32f2f] hover:text-[#b71c1c] cursor-pointer text-base transition-colors"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[1000] px-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-[400px] max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">{editingId ? "Edit Ride" : "Add Ride"}</h3>

            {[
              { label: "Name", name: "name", type: "text" },
              { label: "Slug", name: "slug", type: "text" },
              { label: "Min Age", name: "min_age", type: "number" },
              { label: "Max Age", name: "max_age", type: "number" },
            ].map(({ label, name, type }) => (
              <div key={name} className="flex flex-col mb-4">
                <label className={labelCls}>{label}</label>
                <input required type={type} name={name} value={formData[name]} onChange={handleChange} className={inputCls} />
              </div>
            ))}

            <div className="flex flex-col mb-4">
              <label className={labelCls}>Description</label>
              <textarea required name="description" value={formData.description} onChange={handleChange}
                className={`${inputCls} resize-none h-20`} />
            </div>

            <div className="flex items-center gap-2 mb-4">
              <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} id="is_active" />
              <label htmlFor="is_active" className="text-sm cursor-pointer">Active</label>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <input type="checkbox" name="is_adult_only" checked={formData.is_adult_only} onChange={handleChange} id="is_adult_only" />
              <label htmlFor="is_adult_only" className="text-sm cursor-pointer">Adult Only</label>
            </div>

            {editingId && (
              <div className="flex flex-col mb-4">
                <label className={labelCls}>Ride Image</label>
                <input type="file" name="image" accept="image/*" onChange={handleChange} className="text-sm" />
                {formData.image_preview && (
                  <img src={formData.image_preview} alt="preview" className="w-20 mt-2 rounded-md" />
                )}
              </div>
            )}

            <div className="flex gap-3 mt-4">
              <button onClick={handleSubmit}
                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white border-none px-4 py-2 rounded-lg text-sm cursor-pointer flex-1 transition-colors">
                Save
              </button>
              <button onClick={() => setShowModal(false)}
                className="bg-[#e5e7eb] hover:bg-[#b71c1c] hover:text-white border-none px-4 py-2 rounded-lg text-sm cursor-pointer flex-1 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMAGE PREVIEW MODAL */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/75 flex justify-center items-center z-[9999] cursor-pointer"
          onClick={() => setPreviewImage(null)}
        >
          <div className="max-w-[90%] max-h-[90%] cursor-default" onClick={(e) => e.stopPropagation()}>
            <img src={previewImage} alt="preview"
              className="w-full h-auto rounded-lg object-contain shadow-[0_4px_20px_rgba(0,0,0,0.4)]" />
          </div>
        </div>
      )}
    </div>
  );
}

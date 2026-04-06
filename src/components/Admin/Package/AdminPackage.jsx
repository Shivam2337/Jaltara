import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getPackageAction,
  addPackageAction,
  editPackageAction,
  deletePackageAction,
} from "../../../redux/actions/AdminPackageAction";

import AdminAPI from "../../../BaseAPI/AdminAPI";

import "./AdminPackage.css";
import { FaSearch, FaTimes, FaFilter, FaPlus } from "react-icons/fa";

export default function AdminWaterParkPackage() {

  const dispatch = useDispatch();
  const { packageList, loading, error } = useSelector((state) => state.packages);

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    description: "",
    package_type: "",
    duration_hours: "",
    max_adults: "",
    max_children: "",
    max_seniors: "",
    is_active: true,
    image: null,
    image_id: null,
    image_preview: "",
  });

  useEffect(() => {
    dispatch(getPackageAction());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({
        ...formData,
        image: files[0],
        image_preview: URL.createObjectURL(files[0]),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        package_type: formData.package_type,
        duration_hours: Number(formData.duration_hours),
        max_adults: Number(formData.max_adults),
        max_children: Number(formData.max_children),
        max_seniors: Number(formData.max_seniors),
        is_active: formData.is_active,
      };

      let response;
      if (formData.id) {
        response = await dispatch(editPackageAction(formData.id, payload));
      } else {
        response = await dispatch(addPackageAction(payload));
      }

      // ✅ CHANGE 1 — fixed packageId resolution, response is plain data not {payload}
      console.log("📦 response from action:", response);
      const packageId =
        response?.id ||
        response?.payload?.id ||
        response?.payload?.data?.id;
      console.log("📦 packageId:", packageId);

      if (formData.image && packageId) {
        const imageData = new FormData();
        imageData.append("package", packageId);
        imageData.append("image", formData.image);
        imageData.append("is_primary", true);
        await AdminAPI.post("catalog/admin/package-images/", imageData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      dispatch(getPackageAction());
      setShowModal(false);
      setFormData({
        id: null,
        name: "",
        description: "",
        package_type: "",
        duration_hours: "",
        max_adults: "",
        max_children: "",
        max_seniors: "",
        is_active: true,
        image: null,
        image_id: null,
        image_preview: "",
      });

    } catch (error) {
      console.error("Save Error:", error);
    }
  };

  const handleEdit = (item) => {
    const primaryImage = item.images?.[0];

    setFormData({
      id: item.id || null,
      name: item.name || "",
      description: item.description || "",
      package_type: item.package_type || "",
      duration_hours: item.duration_hours || "",
      max_adults: item.max_adults || "",
      max_children: item.max_children || "",
      max_seniors: item.max_seniors || "",
      is_active: item.is_active ?? true,
      image: null,
      image_id: primaryImage?.id || null,
      // ✅ CHANGE 2 — use image URL directly, already full URL
      image_preview: primaryImage?.image || "",
    });

    setShowModal(true);
  };

  const handleDelete = (id) => {
    dispatch(deletePackageAction(id));
  };

  const filteredPackages = packageList?.filter((item) =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pricing-container">
      {/* HEADER */}
      <div className="header-row">
        <div className="header-actions">
          <div className="room-search">
          <FaSearch />
          <input
            type="text"
            placeholder="Search Package"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
          <button
            className="add-btn"
            onClick={() => {
              setFormData({
                id: null,
                name: "",
                description: "",
                package_type: "",
                duration_hours: "",
                max_adults: "",
                max_children: "",
                max_seniors: "",
                is_active: true,
                image: null,
                image_id: null,
                image_preview: "",
              });
              setShowModal(true);
            }}
          >
            <FaPlus className="add-icon" /> Add Package
          </button>
          <button className="filter-btn">
            <FaFilter /> Filter
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="table-wrapper">
        <table className="pricing-table">
          <thead>
            <tr>
              <th>Package Name</th>
              <th>Image</th>
              <th>Type</th>
              <th>Duration</th>
              <th>Adults</th>
              <th>Children</th>
              <th>Seniors</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="no-data">
                  <div className="state-wrapper">
                    <div className="spinner" />
                    <span>Loading packages...</span>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="9" className="no-data error-state">
                  <div className="state-wrapper">⚠️ Failed to load packages. Please try again.</div>
                </td>
              </tr>
            ) : filteredPackages?.length === 0 ? (
              <tr>
                <td colSpan="9" className="no-data">
                  <div className="state-wrapper">📦 No Packages Found</div>
                </td>
              </tr>
            ) : (
              filteredPackages.map((item) => {
                return (
                  <tr key={item.id}>
                    <td>{item.name}</td>

                    {/* ✅ CHANGE 3 — added onError and onLoad for debugging */}
                    <td>
                      {item.images && item.images.length > 0 ? (
                        <img
                          src={
                            item.images[0].image?.startsWith("http")
                              ? item.images[0].image
                              : `https://api.jaltara.techsofast.com${item.images[0].image}`
                          }
                          alt="package"
                          style={{
                            width: "70px",
                            height: "50px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            console.log("❌ Image failed:", e.target.src);
                            e.target.style.display = "none";
                          }}
                          onLoad={() => console.log("✅ Image loaded:", item.images[0].image)}
                          onClick={() =>
                            setPreviewImage(
                              item.images[0].image?.startsWith("http")
                                ? item.images[0].image
                                : `https://api.jaltara.techsofast.com${item.images[0].image}`
                            )
                          }
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>

                    <td>{item.package_type}</td>
                    <td>{item.duration_hours} hrs</td>
                    <td>{item.max_adults}</td>
                    <td>{item.max_children}</td>
                    <td>{item.max_seniors}</td>
                    <td>{item.is_active ? "Active" : "Inactive"}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-edit" onClick={() => handleEdit(item)}>
                          Edit
                        </button>
                        <button className="btn-delete" onClick={() => handleDelete(item.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <span className="modal-close" onClick={() => setShowModal(false)}>
              <FaTimes />
            </span>
            <h3>{formData.id ? "Edit Package" : "Add Package"}</h3>

            <div className="form-grid">
              <input type="text" name="name" placeholder="Package Name" value={formData.name} onChange={handleChange} />
              <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
              <select name="package_type" value={formData.package_type} onChange={handleChange}>
                <option value="">Select Package Type</option>
                <option value="special_offers">Special Offers</option>
                <option value="group_package">Group Package</option>
                <option value="combo">Combo</option>
              </select>
              <input type="number" name="duration_hours" placeholder="Duration Hours" value={formData.duration_hours} onChange={handleChange} />
              <input type="number" name="max_adults" placeholder="Max Adults" value={formData.max_adults} onChange={handleChange} />
              <input type="number" name="max_children" placeholder="Max Children" value={formData.max_children} onChange={handleChange} />
              <input type="number" name="max_seniors" placeholder="Max Senior" value={formData.max_seniors} onChange={handleChange} />

              <input type="file" name="image" accept="image/*" onChange={handleChange} />

              {/* ✅ CHANGE 4 — added image preview in modal */}
              {formData.image_preview && (
                <img
                  src={formData.image_preview}
                  alt="preview"
                  style={{
                    width: "80px",
                    height: "60px",
                    objectFit: "cover",
                    marginTop: "8px",
                    borderRadius: "6px",
                  }}
                />
              )}

              <div className="checkbox">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                />
                Active
              </div>
            </div>

            <div className="modal-buttons">
              <button className="save-btn" onClick={handleSave}>Save</button>
              <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* IMAGE PREVIEW */}
      {previewImage && (
        <div className="modal-overlay" onClick={() => setPreviewImage(null)}>
          <img
            src={previewImage}
            alt="preview"
            style={{ maxWidth: "80vw", maxHeight: "80vh", borderRadius: "10px" }}
          />
        </div>
      )}

    </div>
  );
}
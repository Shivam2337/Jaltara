import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getPackagePricing,
  createPackagePricing,
  deletePackagePricing,
  updatePackagePricing,
} from "../../../redux/actions/AdminPackagePricingAction";


import AdminAPI from "../../../BaseAPI/AdminAPI";

import { FaEdit, FaTrash, FaTimes, FaSearch, FaFilter, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";

import "./AdminPackagePricing.css";

const AdminPackagePricing = () => {

  const dispatch = useDispatch();
  const { pricing, loading } = useSelector((state) => state.packagePricing);
  const { error } = useSelector((state) => state.packagePricing);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [packages, setPackages] = useState([]);

  useEffect(() => {
    dispatch(getPackagePricing());
  
    /* FETCH PACKAGES FOR DROPDOWN */
    const fetchPackages = async () => {
      const { data } = await AdminAPI.get("catalog/admin/packages/");
      setPackages(data);
    };

    fetchPackages();
}, [dispatch]);


  const [formData, setFormData] = useState({
    package_name: "",
    start_date: "",
    end_date: "",
    base_price: "",
    included_adults: "",
    included_children: "",
    included_seniors: "",
    extra_adult_price: "",
    extra_child_price: "",
    extra_senior_price: "",
  });

  useEffect(() => {
    dispatch(getPackagePricing());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      package_name: "",
      start_date: "",
      end_date: "",
      base_price: "",
      included_adults: "",
      included_children: "",
      included_seniors: "",
      extra_adult_price: "",
      extra_child_price: "",
      extra_senior_price: "",
    });

    setEditId(null);
  };

  const handleEdit = (item) => {

    setShowModal(true);
    setEditId(item.id);

    setFormData({
      package_name: item.package,
      start_date: item.start_date,
      end_date: item.end_date,
      base_price: item.base_price,
      included_adults: item.included_adults,
      included_children: item.included_children,
      included_seniors: item.included_seniors,
      extra_adult_price: item.extra_adult_price,
      extra_child_price: item.extra_child_price,
      extra_senior_price: item.extra_senior_price,
    });
  };

  const handleSubmit = (e) => {

    e.preventDefault();

    const payload = {
      package: Number(formData.package_name),
      start_date: formData.start_date,
      end_date: formData.end_date,
      base_price: Number(formData.base_price),
      included_adults: Number(formData.included_adults),
      included_children: Number(formData.included_children),
      included_seniors: Number(formData.included_seniors),
      extra_adult_price: Number(formData.extra_adult_price),
      extra_child_price: Number(formData.extra_child_price),
      extra_senior_price: Number(formData.extra_senior_price),
    };

    if (editId) {
      dispatch(updatePackagePricing(editId, payload));
      dispatch(getPackagePricing());
    } else {
      dispatch(createPackagePricing(payload));
    }

    resetForm();
    setShowModal(false);
  };

  const filteredPricing = pricing?.filter((item) =>
  item.package_name?.toLowerCase().includes(searchTerm.toLowerCase())
);

  return (

    <div className="pricing-container">

      {/* SEARCH BAR */}

      


      {/* HEADER */}

      <div className="PR-header-row">
        <div className="header-actions">
          <div className="room-search">

          <FaSearch />

          <input
            type="text"
            placeholder="Search name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

        </div>
          <button
            className="add-btn"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            <FaPlus className="add-icon" />
            Add Pricing
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
              {/* <th>ID</th> */}
              <th>Package</th>
              <th>Start</th>
              <th>End</th>
              <th>Base</th>
              <th>Adults</th>
              <th>Children</th>
              <th>Seniors</th>
              <th>Extra Adult</th>
              <th>Extra Child</th>
              <th>Extra Senior</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>
                <td colSpan="12" className="no-data">
                  <div className="state-wrapper">
                    <div className="spinner" />
                    <span>Loading pricing...</span>
                  </div>
                </td>
              </tr>

           

            ) : filteredPricing?.length === 0 ? (

              <tr>
                <td colSpan="12" className="no-data">
                  <div className="state-wrapper">💰 No Pricing Found</div>
                </td>
              </tr>

            ) : (

              filteredPricing.map((item) => (

                <tr key={item.id}>
                  {/* <td>{item.id}</td> */}
                  <td>{item.package_name}</td>
                  <td>{item.start_date}</td>
                  <td>{item.end_date}</td>
                  <td>₹{item.base_price}</td>
                  <td>{item.included_adults}</td>
                  <td>{item.included_children}</td>
                  <td>{item.included_seniors}</td>
                  <td>₹{item.extra_adult_price}</td>
                  <td>₹{item.extra_child_price}</td>
                  <td>₹{item.extra_senior_price}</td>

                  <td>

                    <div className="action-buttons">

                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(item)}
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="btn-delete"
                        onClick={() => dispatch(deletePackagePricing(item.id))}
                      >
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

        <div className="modal-overlay">

          <div className="modal-box">

            <span
              className="modal-close"
              onClick={() => setShowModal(false)}
            >
              <FaTimes />
            </span>

            <h3>{editId ? "Edit Pricing" : "Add Pricing"}</h3>

            <form className="form-grid" onSubmit={handleSubmit}>

            <div className="form-group-pack-pricing">
                <label>Package Name</label>
                <select
                  name="package_name"
                  value={formData.package_name}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Package</option>
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name}
                    </option>
                  ))}
                </select>

              </div>
              
              <input type="date"    required name="start_date" value={formData.start_date} onChange={handleChange} />

              <input type="date"    required name="end_date" value={formData.end_date} onChange={handleChange} />

              <input name="base_price" placeholder="Base Price" value={formData.base_price} onChange={handleChange} />

              <input name="included_adults" placeholder="Included Adults" value={formData.included_adults} onChange={handleChange} />

              <input name="included_children" placeholder="Included Children" value={formData.included_children} onChange={handleChange} />

              <input name="included_seniors" placeholder="Included Seniors" value={formData.included_seniors} onChange={handleChange} />

              <input name="extra_adult_price" placeholder="Extra Adult Price" value={formData.extra_adult_price} onChange={handleChange} />

              <input name="extra_child_price" placeholder="Extra Child Price" value={formData.extra_child_price} onChange={handleChange} />

              <input name="extra_senior_price" placeholder="Extra Senior Price" value={formData.extra_senior_price} onChange={handleChange} />

              <div className="modal-buttons">

                <button
                  type="submit"
                  className="save-btn"
                >
                  Save
                </button>

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
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
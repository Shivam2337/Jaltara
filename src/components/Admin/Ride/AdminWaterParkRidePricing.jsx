// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   getPricingAction,
//   addPricingAction,
//   editPricingAction,
//   deletePricingAction,
// } from "../../../redux/actions/AdminWaterParkPricingAction";

// import "./AdminWaterParkRidePricing.css";
// import { FaSearch, FaBell, FaFilter, FaPlus } from "react-icons/fa";

// export default function AdminWaterParkRidePricing() {
//   const dispatch = useDispatch();
//   const { pricingList, loading } = useSelector((state) => state.waterParkPricing);

//   const [showModal, setShowModal] = useState(false);
//   const [formData, setFormData] = useState({ id: null, ride: "", date: "", price_per_person: "" });

//   useEffect(() => {
//     dispatch(getPricingAction());
//   }, [dispatch]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSave = () => {
//     if (formData.id) {
//       dispatch(editPricingAction(formData.id, formData));
//     } else {
//       dispatch(addPricingAction(formData));
//     }
//     setShowModal(false);
//     setFormData({ id: null, ride: "", date: "", price_per_person: "" });
//   };

//   const handleEdit = (item) => {
//     setFormData(item);
//     setShowModal(true);
//   };

//   const handleDelete = (id) => {
//     dispatch(deletePricingAction(id));
//   };

//   return (
//     <div className="guest-container">
//       <div className="top-bar">
//         <div className="search-box">
//           <FaSearch />
//           <input type="text" placeholder="Search for rides" />
//         </div>
//         <FaBell className="bell-icon" />
//       </div>

//       <h2 className="page-title">Water Park Ride Pricing</h2>

//       <div className="action-bar">
//         <button className="checkin-btn" onClick={() => setShowModal(true)}>
//           <FaPlus className="add-icon" /> Add Pricing
//         </button>
//         <div className="right-buttons">
//           <button className="filter-btn">
//             <FaFilter /> Filter
//           </button>
//           <div className="room-search">
//             <FaSearch />
//             <input type="text" placeholder="Search by ride" />
//           </div>
//         </div>
//       </div>

//       <div className="table-wrapper">
//         <table>
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Ride Name</th>
//               <th>Date</th>
//               <th>Price Per Person</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr><td colSpan={5}>Loading...</td></tr>
//             ) : (
//               pricingList.map((item) => (
//                 <tr key={item.id}>
//                   <td>{item.id}</td>
//                   <td>{item.ride}</td>
//                   <td>{item.date}</td>
//                   <td>₹ {item.price_per_person}</td>
//                   <td>
//                     <button onClick={() => handleEdit(item)}>Edit</button>
//                     <button onClick={() => handleDelete(item.id)}>Delete</button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {showModal && (
//         <div className="modal-overlay">
//           <div className="modal-box">
//             <h3>{formData.id ? "Edit" : "Add"} Ride Pricing</h3>

//             <div className="form-group">
//               <label>Ride</label>
//               <input type="text" name="ride" value={formData.ride} onChange={handleChange} />
//             </div>

//             <div className="form-group">
//               <label>Date</label>
//               <input type="date" name="date" value={formData.date} onChange={handleChange} />
//             </div>

//             <div className="form-group">
//               <label>Price Per Person</label>
//               <input type="number" name="price_per_person" value={formData.price_per_person} onChange={handleChange} />
//             </div>

//             <div className="modal-buttons">
//               <button className="save-btn" onClick={handleSave}>Save</button>
//               <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import "./AdminRegister.css";
import { FaSearch, FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

import {
  adminRegister,
  getStaffUsersAction,
} from "../../../redux/actions/AdminRegisterAction";

export default function AdminRegister() {

  const dispatch = useDispatch();
  const { staffUsers = [] } = useSelector(
  (state) => state.staffUsersList || {}
);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    phone: "",
    role: "",
  });

  useEffect(() => {
    dispatch(getStaffUsersAction());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // eslint-disable-next-line no-unused-vars
  const handleEdit = (item) => {
  setFormData({
    username: item.user?.username || "",
    email: item.user?.email || "",
    phone: item.user?.phone || "",
    password: ""
  });

  setEditingId(item.id);
  setShowModal(true);
};

const handleSubmit = async () => {

  let success;

  if (editingId) {
    success = false;
    alert("Update not supported");
  } else {
    success = await dispatch(adminRegister(formData)); 
  }

  if (success) {
    setShowModal(false);
    dispatch(getStaffUsersAction());

    setFormData({
      username: "",
      password: "",
      email: "",
      phone: "",
    });
  }
};
const filteredUsers = staffUsers.filter((user) =>
  user.username?.toLowerCase().includes(searchTerm.toLowerCase())
);
  return (
    <div className="admin-wrapper">

      <h2 className="admin-title">Admin Management</h2>

      <div className="admin-topbar">

        <div className="admin-search">
          <FaSearch />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          className="admin-add-btn"
          onClick={() => {
            setFormData({
              username: "",
              password: "",
              email: "",
              phone: "",
              role: ""
            });
            setEditingId(null);
            setShowModal(true);
          }}
        >
          <FaPlus /> Add Admin
        </button>
      </div>

      <div className="admin-table-box">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Super Admin</th>
              <th>Staff</th>
              <th>Role</th>
              {/* <th>Action</th> */}
            </tr>
          </thead>

          <tbody>
    {filteredUsers.map((item) => (
    <tr key={item.id}>
     <td>{item.username}</td>
      <td>{item.email}</td>
      <td>{item.phone}</td>
      <td>{item.is_superuser ? "Yes" : "No"}</td>
      <td>{item.is_staff_member ? "Yes" : "No"}</td>
      <td>{item.role || "-"}</td>

      {/* <td className="admin-actions">
        <span style={{ fontSize: "12px", color: "#999" }}>
          View Only
        </span>
      </td> */}
    </tr>
  ))}
</tbody>
        </table>
      </div>

      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">

            <h3>{editingId ? "Edit Admin" : "Add Admin"}</h3>

            <div className="admin-form">
              <label>Username</label>
              <input name="username" value={formData.username} onChange={handleChange} />

              {!editingId && (
                <>
                  <label>Password</label>
                  <input type="password" name="password" onChange={handleChange} />
                </>
              )}

              <label>Email</label>
              <input name="email" value={formData.email} onChange={handleChange} />

              <label>Phone</label>
              <input name="phone" value={formData.phone} onChange={handleChange} />
            </div>
            <label>Role</label>
              <select name="role" value={formData.role} onChange={handleChange}  required >
                <option value="">Select Role</option>
                <option value="Manager">Manager</option>
                <option value="Admin">Admin</option>
              </select>

            <div className="admin-modal-actions">
              <button className="save-btn" onClick={handleSubmit}>
                {editingId ? "Update" : "Save"}
              </button>
              <button className="cancel-btn" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
            

          </div>
        </div>
      )}

    </div>
  );
}
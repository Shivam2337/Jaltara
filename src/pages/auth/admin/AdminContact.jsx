import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEye, FaTrash } from "react-icons/fa";
import { AdminContactAction } from "../../../redux/actions/AdminContactAction";
import "./AdminContact.css";

const AdminContact = () => {
  const dispatch = useDispatch();

  const { loading, error, contacts } = useSelector(
    (state) => state.adminContactList
  );

  // ✅ Modal state
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    dispatch(AdminContactAction());
  }, [dispatch]);

  // ✅ Delete (API can be connected later)
  // const handleDelete = (id) => {
  //   if (window.confirm("Are you sure you want to delete?")) {
  //     alert(`Delete API pending for ID: ${id}`);
  //   }
  // };

  return (
    <div className="Admin-contact-page">
      {/* HEADER */}
      <div className="Admin-contact-header">
        <h2>Contact Enquiries</h2>
      </div>

      {/* TABLE */}
      <div className="Admin-contact-table-container">
        {loading ? (
          <p style={{ padding: "20px" }}>Loading...</p>
        ) : error ? (
          <p style={{ padding: "20px", color: "red" }}>{error}</p>
        ) : (
          <table className="Admin-contact-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Message</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {contacts && contacts.length > 0 ? (
                contacts.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.phone}</td>

                    <td className="message-cell">
                      {item.message}
                    </td>

                    <td>
                      {new Date(item.created_at).toLocaleString()}
                    </td>

                    {/* ACTIONS */}
                    <td>
                      <div className="Admin-contact-action-icons">
                        <FaEye
                          className="Admin-contact-view-icon"
                          onClick={() => setSelectedMessage(item.message)}
                        />

                        {/* <FaTrash
                          className="Admin-contact-delete-icon"
                          onClick={() => handleDelete(item.id)}
                        /> */}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No enquiries found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* VIEW MODAL */}
      {selectedMessage && (
        <div className="Admin-contact-modal-overlay">
          <div className="Admin-contact-modal">
            <h3>Full Message</h3>
            <p>{selectedMessage}</p>

            <button onClick={() => setSelectedMessage(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContact;
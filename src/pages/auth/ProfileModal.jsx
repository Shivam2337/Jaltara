import React from "react";
import "./ProfileModal.css";
import { useNavigate } from "react-router-dom";

export default function ProfileModal({ onClose }) {
  const navigate = useNavigate();

  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal-panel">
        <div className="profile-modal-header">
          <h3>Profile</h3>
          <span className="profile-modal-close-btn" onClick={onClose}>
            ×
          </span>
        </div>

        <div className="profile-modal-section">
          <h4>My account</h4>
          <p className="profile-modal-phone">+91 9561354949</p>

          <div
            className="profile-modal-item"
            onClick={() => {
              navigate("/MyAccount?tab=profile");
              onClose();
            }}
          >
            <span>Profile</span>
            <span>›</span>
          </div>
        </div>

        <hr className="profile-modal-divider" />

        <div className="profile-modal-section">
          <h4>My tickets</h4>
          <div
            className="profile-modal-ticket-link"
            onClick={() => {
              navigate("/MyAccount?tab=tickets");
              onClose();
            }}
          >
            My Ticket
          </div>
        </div>

        <hr className="profile-modal-divider" />

        <div className="profile-modal-logout">
          <span>Logout</span>
          <span>⇨</span>
        </div>
      </div>
    </div>
  );
}

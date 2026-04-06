import React, { useEffect, useState } from "react";
import "./MyAccount.css";
import TicketCard from "./TicketCard";
import Profile from "./Profile";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMyBookingsAction } from "../../redux/UserActions";
import { logoutUserAction } from "../../redux/UserAuthActions";


const MyAccount = () => {
  const [activeTab, setActiveTab] = useState("tickets");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const user = {
    name: "Sneha Kamble",
    image: "", // put image URL here if available
  };
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading: bookingsLoading, error: bookingsError, list: bookingsList = [] } =
    useSelector((s) => s.userMyBookings) || {};

  // ✅ CHANGE 1 — Added handleLogout function
  const handleLogout = async () => {
    const res = await dispatch(logoutUserAction());
    if (res?.ok) {
      localStorage.removeItem("booking");
      navigate("/");
      setShowLogoutConfirm(false);
    } 
  };

  // fetch bookings when entering tickets
  useEffect(() => {
    if (activeTab === "tickets") {
      dispatch(getMyBookingsAction());
    }
  }, [activeTab, dispatch]);

  return (
    <div className="my-account-page">
      <style>{`@keyframes maspin { to { transform: rotate(360deg); } }`}</style>
      <div className="my-account-container">
        {/* SIDEBAR */}
        <div className="my-account-sidebar">
          <span className="my-account-breadcrumb">My account</span>

          <h2 className="my-account-page-title">Account Details</h2>

          <div className="my-account-user-info">
            <div className="my-account-avatar">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  onError={(e) => (e.target.style.display = "none")}
                />
              ) : (
                <span className="my-account-avatar-text">
                  {user.name.charAt(0)}
                </span>
              )}
            </div>

            <span className="my-account-username">{user.name}</span>
          </div>

          <ul className="my-account-menu-list">
            <li
              className={
                activeTab === "profile"
                  ? "my-account-menu-item active"
                  : "my-account-menu-item"
              }
              onClick={() => setActiveTab("profile")}
            >
              Profile Information
            </li>

            <li
              className={
                activeTab === "tickets"
                  ? "my-account-menu-item active"
                  : "my-account-menu-item"
              }
              onClick={() => setActiveTab("tickets")}
            >
              My Tickets
            </li>

            {/* ✅ CHANGE 2 — Added Logout button below My Tickets */}
            <li
              className="my-account-menu-item my-account-logout"
              onClick={() => setShowLogoutConfirm(true)}
            >
              Logout
            </li>    

          </ul>
        </div>

        {/* CONTENT */}
        <div className="my-account-content">
          {activeTab === "tickets" && bookingsLoading && (
            <div style={{ display: "flex", justifyContent: "center", padding: 16 }}>
              <div
                aria-label="Loading bookings"
                style={{
                  width: 34,
                  height: 34,
                  border: "3px solid #e5e7eb",
                  borderTopColor: "#339af0",
                  borderRadius: "50%",
                  animation: "maspin 0.8s linear infinite",
                }}
              />
            </div>
          )}

          {activeTab === "tickets" && !bookingsLoading && bookingsError && (
            <div style={{ textAlign: "center", color: "#64748b", padding: 12 }}>
              Failed to load bookings
            </div>
          )}

          {activeTab === "tickets" && !bookingsLoading && !bookingsError && bookingsList.length === 0 && (
            <div style={{ textAlign: "center", color: "#64748b", padding: 12 }}>
              No bookings found
            </div>
          )}

          {activeTab === "tickets" && <TicketCard />}
          {activeTab === "profile" && <Profile />}
        </div>
      </div>

      {/* ✅ CHANGE 3 — Logout confirmation modal */}
      {showLogoutConfirm && (
        <div className="logout-modal-overlay" onClick={() => setShowLogoutConfirm(false)}>
          <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="logout-modal-title">Log out?</h3>
            <p className="logout-modal-text">Are you sure you want to log out of your account?</p>
            <div className="logout-modal-actions">
              <button className="logout-btn-cancel" onClick={() => setShowLogoutConfirm(false)}>
                Cancel
              </button>
              <button className="logout-btn-confirm" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAccount;

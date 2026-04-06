import React, { useState, useEffect, useRef } from "react";
import "./AdminNavbar.css";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  getNotificationsAction,
  markAllNotificationsReadAction,
} from "../../redux/actions/AdminNotificationAction";

const AdminNavbar = () => {

  const dispatch = useDispatch();
  const { notifications, unreadCount } = useSelector(
    (state) => state.notifications
  );

  const isSuperuser = localStorage.getItem("isSuperuser") === "true";
  const username = localStorage.getItem("adminUsername");

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // ✅ Fetch on mount + every 30 seconds
  useEffect(() => {
    dispatch(getNotificationsAction());
    const interval = setInterval(() => {
      dispatch(getNotificationsAction());
    }, 30000);
    return () => clearInterval(interval);
  }, [dispatch]);

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsReadAction());
  };

  const handleBellClick = () => {
    setShowDropdown(!showDropdown);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="admin-navbar">
      <div className="navbar-left"></div>

      <div className="navbar-right">

        {/* NOTIFICATION BELL */}
        <div className="notification-wrapper" ref={dropdownRef}>
          <div className="notification-bell" onClick={handleBellClick}>
            <FaBell />
            {/* ✅ Show badge only when unread count > 0 */}
            {unreadCount > 0 && (
              <span className="notification-badge">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </div>

          {/* DROPDOWN */}
          {showDropdown && (
            <div className="notification-dropdown">

              <div className="notification-dropdown-header">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <button
                    className="mark-all-read-btn"
                    onClick={handleMarkAllRead}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="notification-list">
                {notifications.length === 0 ? (
                  <div className="notification-empty">
                    No notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`notification-item ${!n.is_read ? "unread" : ""}`}
                    >
                      <div className="notification-content">
                        <p className="notification-title">{n.title}</p>
                        <p className="notification-message">{n.message}</p>
                        <span className="notification-time">
                          {formatDate(n.created_at)}
                        </span>
                      </div>
                      {/* ✅ Blue dot for unread */}
                      {!n.is_read && <span className="unread-dot" />}
                    </div>
                  ))
                )}
              </div>

            </div>
          )}
        </div>

        {/* PROFILE */}
        <div className="admin-profile">
          {/* <FaUserCircle className="user-icon" /> */}
          <span>
            Welcome, {isSuperuser ? "Super Admin" : "Admin"}
            {/* {username && ` ${username}`} */}
          </span>
        </div>

      </div>
    </div>
  );
};

export default AdminNavbar;
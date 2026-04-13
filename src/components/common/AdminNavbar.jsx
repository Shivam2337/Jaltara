import React, { useState, useEffect, useRef } from "react";
import { FaBell, FaBars } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  getNotificationsAction,
  markAllNotificationsReadAction,
} from "../../redux/actions/AdminNotificationAction";

const AdminNavbar = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const { notifications, unreadCount } = useSelector((state) => state.notifications);

  const isSuperuser = localStorage.getItem("isSuperuser") === "true";

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    dispatch(getNotificationsAction());
    const interval = setInterval(() => dispatch(getNotificationsAction()), 30000);
    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    <div className="h-[60px] w-full bg-[#1e293b] text-white flex justify-between items-center px-5 sticky top-0 left-0 z-[1000] box-border">

      {/* Left — hamburger on mobile */}
      <div className="flex items-center">
        <button
          className="lg:hidden text-white p-2 rounded-md hover:bg-white/10 transition-colors"
          onClick={onMenuClick}
        >
          <FaBars size={20} />
        </button>
      </div>

      {/* Right — bell + profile */}
      <div className="flex items-center gap-5">

        {/* NOTIFICATION BELL */}
        <div className="relative" ref={dropdownRef}>
          <div
            className="relative cursor-pointer text-[20px] text-white p-2 rounded-full hover:bg-white/10 transition-colors flex items-center justify-center"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <FaBell />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#e03131] text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </div>

          {/* DROPDOWN */}
          {showDropdown && (
            <div className="fixed left-1/2 -translate-x-1/2 top-[70px] w-[90vw] sm:absolute sm:left-auto sm:translate-x-0 sm:top-[calc(100%+10px)] sm:right-0 sm:w-[340px] bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.15)] border border-[#f0f0f0] z-[999] overflow-hidden">

              <div className="flex items-center justify-between px-4 py-[14px] border-b border-[#f0f0f0] font-semibold text-[15px] text-[#333]">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <button
                    className="bg-transparent border-none text-[#339af0] text-[13px] cursor-pointer p-0 hover:underline"
                    onClick={() => dispatch(markAllNotificationsReadAction())}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-[360px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-[30px] text-center text-[#999] text-[14px]">
                    No notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`flex items-start justify-between px-4 py-3 border-b border-[#f9f9f9] gap-[10px] cursor-pointer transition-colors
                        ${!n.is_read ? "bg-[#f0f8ff] hover:bg-[#e3f2fd]" : "hover:bg-[#f9f9f9]"}`}
                    >
                      <div className="flex-1">
                        <p className={`text-[14px] mb-1 m-0 ${!n.is_read ? "font-bold text-[#333]" : "font-medium text-[#444]"}`}>
                          {n.title}
                        </p>
                        <p className="text-[13px] text-[#666] m-0 mb-[6px] leading-[1.4]">
                          {n.message}
                        </p>
                        <span className="text-[11px] text-[#999]">
                          {formatDate(n.created_at)}
                        </span>
                      </div>
                      {!n.is_read && (
                        <span className="w-2 h-2 min-w-[8px] bg-[#339af0] rounded-full mt-1" />
                      )}
                    </div>
                  ))
                )}
              </div>

            </div>
          )}
        </div>

        {/* PROFILE */}
        <div className="flex items-center gap-2 text-[15px] text-white font-medium">
          <span>Welcome, {isSuperuser ? "Super Admin" : "Admin"}</span>
        </div>

      </div>
    </div>
  );
};

export default AdminNavbar;

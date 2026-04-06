import React, { useState } from "react";
import "./AdminRoomManagement.css";

import AdminRoomCategories from "../../pages/auth/admin/AdminRoomCategories";
import AdminRooms from "../../pages/auth/admin/AdminRooms";
import AdminRoomPricing from "../../pages/auth/admin/AdminRoomPricing";

import { FaTh, FaHotel, FaTag } from "react-icons/fa";

const tabs = [
  { id: "categories", label: "Room Categories", icon: <FaTh /> },
  { id: "rooms",      label: "Rooms",           icon: <FaHotel /> },
  { id: "pricing",    label: "Room Pricing",     icon: <FaTag /> },
];

export default function AdminRoomManagement() {
  const [activeTab, setActiveTab] = useState("categories");

  return (
    <div className="room-mgmt-container">

      {/* PAGE TITLE */}
      <h2 className="room-mgmt-title">Room Management</h2>

      {/* TABS */}
      <div className="room-mgmt-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`room-mgmt-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="room-mgmt-content">
        {activeTab === "categories" && <AdminRoomCategories />}
        {activeTab === "rooms"      && <AdminRooms />}
        {activeTab === "pricing"    && <AdminRoomPricing />}
      </div>

    </div>
  );
}
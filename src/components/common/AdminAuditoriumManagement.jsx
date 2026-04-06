import React, { useState } from "react";
import "./AdminRoomManagement.css";

// ✅ Correct import paths
import AdminAuditorium from "../Admin/AdminAuditorium/AdminAuditorium";
import AdminAuditoriumPricing from "../Admin/AdminAuditorium/AdminAuditoriumPricing";

import { FaTheaterMasks, FaDollarSign } from "react-icons/fa";

const tabs = [
  { id: "auditorium",         label: "Auditorium",         icon: <FaTheaterMasks /> },
  { id: "auditorium-pricing", label: "Auditorium Pricing", icon: <FaDollarSign /> },
];

export default function AdminAuditoriumManagement() {
  const [activeTab, setActiveTab] = useState("auditorium");

  return (
    <div className="room-mgmt-container">
      <h2 className="room-mgmt-title">Auditorium Management</h2>

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

      <div className="room-mgmt-content">
        {activeTab === "auditorium"         && <AdminAuditorium />}
        {activeTab === "auditorium-pricing" && <AdminAuditoriumPricing />}
      </div>
    </div>
  );
}
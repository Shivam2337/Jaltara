import React, { useState } from "react";
import "./AdminRoomManagement.css"; // reuse same CSS

import AdminHallPage from "../Admin/AdminHall/AdminHallPage";
import AdminHallGallery from "../Admin/AdminHall/AdminHallGallery";
import AdminHallFeatures from "../Admin/AdminHall/AdminHallFeatures";

import { FaBuilding, FaImages, FaList } from "react-icons/fa";

const tabs = [
  { id: "hall",     label: "Hall Page",    icon: <FaBuilding /> },
  { id: "gallery",  label: "Hall Gallery", icon: <FaImages /> },
  { id: "features", label: "Hall Features",icon: <FaList /> },
];

export default function AdminHallManagement() {
  const [activeTab, setActiveTab] = useState("hall");

  return (
    <div className="room-mgmt-container">

      {/* PAGE TITLE */}
      <h2 className="room-mgmt-title">Hall Management</h2>

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
        {activeTab === "hall" && <AdminHallPage />}
        {activeTab === "gallery" && <AdminHallGallery />}
        {activeTab === "features" && <AdminHallFeatures />}
      </div>

    </div>
  );
}
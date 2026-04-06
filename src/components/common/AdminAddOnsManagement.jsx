import React, { useState } from "react";
import "./AdminRoomManagement.css";

// ✅ Correct import paths
import AdminAddOns from "../Admin/AdminAddOns/AdminAddOns";
import AdminAddOnsPricing from "../Admin/AdminAddOns/AdminAddOnsPricing";

import { FaPuzzlePiece, FaTags } from "react-icons/fa";

const tabs = [
  { id: "addons",        label: "Addons",         icon: <FaPuzzlePiece /> },
  { id: "addons-pricing", label: "Addons Pricing", icon: <FaTags /> },
];

export default function AdminAddOnsManagement() {
  const [activeTab, setActiveTab] = useState("addons");

  return (
    <div className="room-mgmt-container">
      <h2 className="room-mgmt-title">Addons Management</h2>

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
        {activeTab === "addons"         && <AdminAddOns />}
        {activeTab === "addons-pricing" && <AdminAddOnsPricing />}
      </div>
    </div>
  );
}
import React, { useState } from "react";
import "./AdminRoomManagement.css";

// ✅ Correct import paths
import AdminTicketType from "../Admin/TicketType/AdminTicketType";
import AdminTicketPricing from "../Admin/TicketType/AdminTicketPricing";

import { FaTicketAlt, FaDollarSign } from "react-icons/fa";

const tabs = [
  { id: "ticket-type",    label: "Ticket Type",    icon: <FaTicketAlt /> },
  { id: "ticket-pricing", label: "Ticket Pricing", icon: <FaDollarSign /> },
];

export default function AdminTicketManagement() {
  const [activeTab, setActiveTab] = useState("ticket-type");

  return (
    <div className="room-mgmt-container">
      <h2 className="room-mgmt-title">Ticket Management</h2>

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
        {activeTab === "ticket-type"    && <AdminTicketType />}
        {activeTab === "ticket-pricing" && <AdminTicketPricing />}
      </div>
    </div>
  );
}
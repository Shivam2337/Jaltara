import React, { useState } from "react";
import "./AdminRoomManagement.css";

import AdminPackage from "../Admin/Package/AdminPackage";
import AdminPackageItem from "../Admin/Package/AdminPackageItem";
import AdminPackagePricing from "../Admin/Package/AdminPackagePricing";

import { FaBoxOpen, FaCubes, FaMoneyBill } from "react-icons/fa";

const tabs = [
  { id: "packages",        label: "Packages",         icon: <FaBoxOpen /> },
  { id: "package-items",   label: "Package Items",    icon: <FaCubes /> },
  { id: "package-pricing", label: "Package Pricing",  icon: <FaMoneyBill /> },
];

export default function AdminPackageManagement() {
  const [activeTab, setActiveTab] = useState("packages");

  return (
    <div className="room-mgmt-container">

      {/* PAGE TITLE */}
      <h2 className="room-mgmt-title">Package Management</h2>

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
        {activeTab === "packages"        && <AdminPackage />}
        {activeTab === "package-items"   && <AdminPackageItem />}
        {activeTab === "package-pricing" && <AdminPackagePricing />}
      </div>

    </div>
  );
}
import React, { useState } from "react";
import AdminAddOns from "../Admin/AdminAddOns/AdminAddOns";
import AdminAddOnsPricing from "../Admin/AdminAddOns/AdminAddOnsPricing";
import { FaPuzzlePiece, FaTags } from "react-icons/fa";

const tabs = [
  { id: "addons",         label: "Addons",         icon: <FaPuzzlePiece /> },
  { id: "addons-pricing", label: "Addons Pricing",  icon: <FaTags /> },
];

export default function AdminAddOnsManagement() {
  const [activeTab, setActiveTab] = useState("addons");

  return (
    <div className="">
      <h2 className="text-[24px] font-semibold text-[#333] mb-6">Addons Management</h2>

      {/* TABS */}
      <div className="flex gap-3 border-b-2 border-[#f0f0f0] mb-6 overflow-x-auto overflow-y-hidden">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={activeTab === tab.id ? { borderBottom: "4px solid #339af0" } : { borderBottom: "2px solid transparent" }}
            className={`flex items-center gap-2 px-6 py-[10px] border-none text-[15px] cursor-pointer rounded-t-lg transition-all duration-200 whitespace-nowrap mb-[-2px]
              ${activeTab === tab.id ? "text-[#339af0] font-semibold bg-[#f0f8ff]" : "text-[#888] bg-transparent hover:text-[#339af0] hover:bg-[#f0f8ff]"}`}
          >
            <span className="text-sm">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="bg-white rounded-[0_12px_12px_12px] min-h-[400px]">
        {activeTab === "addons"         && <AdminAddOns />}
        {activeTab === "addons-pricing" && <AdminAddOnsPricing />}
      </div>
    </div>
  );
}

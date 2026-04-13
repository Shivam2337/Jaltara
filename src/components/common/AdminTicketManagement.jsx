import React, { useState } from "react";
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
    <div className="">
      <h2 className="text-[24px] font-semibold text-[#333] mb-6">Ticket Management</h2>

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

      <div className="bg-white rounded-[0_12px_12px_12px] min-h-[400px]">
        {activeTab === "ticket-type"    && <AdminTicketType />}
        {activeTab === "ticket-pricing" && <AdminTicketPricing />}
      </div>
    </div>
  );
}

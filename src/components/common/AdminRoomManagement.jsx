import React, { useState } from "react";
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
    <div className="">

      {/* PAGE TITLE */}
      <h2 className="text-[24px] font-semibold text-[#333] mb-6">Room Management</h2>

      {/* TABS */}
      <div className="flex gap-3 border-b-2 border-[#f0f0f0] mb-6 overflow-x-auto overflow-y-hidden">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={activeTab === tab.id ? { borderBottom: "4px solid #339af0" } : { borderBottom: "2px solid transparent" }}
            className={`flex items-center gap-2 px-6 py-[10px] border-none text-[15px] cursor-pointer rounded-t-lg transition-all duration-200 whitespace-nowrap mb-[-2px]
              ${activeTab === tab.id
                ? "text-[#339af0] font-semibold bg-[#f0f8ff]"
                : "text-[#888] bg-transparent hover:text-[#339af0] hover:bg-[#f0f8ff]"
              }`}
          >
            <span className="text-sm">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="bg-white rounded-[0_12px_12px_12px] min-h-[400px]">
        {activeTab === "categories" && <AdminRoomCategories />}
        {activeTab === "rooms"      && <AdminRooms />}
        {activeTab === "pricing"    && <AdminRoomPricing />}
      </div>

    </div>
  );
}

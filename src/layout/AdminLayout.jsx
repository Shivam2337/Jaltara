import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/common/AdminSidebar";
import AdminNavbar from "../components/common/AdminNavbar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1 lg:ml-[240px] w-full lg:w-[calc(100%-240px)]">
        <AdminNavbar onMenuClick={() => setSidebarOpen(true)} />

        <div className="flex-1 p-5 overflow-y-auto bg-[#f1f5f9]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

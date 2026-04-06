import React, { useState } from "react";
import "./AdminRoomManagement.css";


import AdminBookingList from "../Admin/AdminBooking/AdminBookingList";
import AdminPaymentList from "../Admin/AdminBooking/AdminPaymentList";

import { FaClipboardList, FaCreditCard } from "react-icons/fa";

export default function AdminBookPay() {

  const [activeTab, setActiveTab] = useState("bookings");

  return (
    <div className="room-mgmt-container">

      {/* TITLE */}
      <h2 className="room-mgmt-title">Booking & Payment Management</h2>

      {/* TABS */}
      <div className="room-mgmt-tabs">
        <button
          className={`room-mgmt-tab ${activeTab === "bookings" ? "active" : ""}`}
          onClick={() => setActiveTab("bookings")}
        >
          <FaClipboardList /> Bookings
        </button>

        <button
          className={`room-mgmt-tab ${activeTab === "payments" ? "active" : ""}`}
          onClick={() => setActiveTab("payments")}
        >
          <FaCreditCard /> Payments
        </button>
      </div>

      {/* CONTENT */}
      <div className="room-mgmt-content">
        {activeTab === "bookings" && <AdminBookingList />}
        {activeTab === "payments" && <AdminPaymentList />}
      </div>

    </div>
  );
}
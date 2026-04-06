import React, { useEffect, useState } from "react";
import "./AdminBookingList.css";
import AdminAPI from "../../../BaseAPI/AdminAPI";
import { FaSearch, FaFilter } from "react-icons/fa";

const STATUS_COLORS = {
  pending: "status-pending",
  confirmed: "status-confirmed",
  cancelled: "status-cancelled",
  refunded: "status-refunded",
};

export default function AdminBookingList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await AdminAPI.get("bookings/history/");
      console.log("📦 Bookings:", data);
      const list = data.results || data;
      setBookings(list);
    } catch (err) {
      console.error("❌ Bookings fetch error:", JSON.stringify(err.response?.data));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const filteredBookings = bookings.filter((b) => {
    const matchSearch =
      b.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id?.toString().includes(searchTerm);
    const matchStatus = filterStatus ? b.status === filterStatus : true;
    const matchType = filterType ? b.booking_type === filterType : true;
    return matchSearch && matchStatus && matchType;
  });

  return (
    <div className="booking-list-container">

      {/* SEARCH ROW */}
      <div className="search-row">
        <div className="room-search">
          <FaSearch />
          <input
            type="text"
            placeholder="Search by name or ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* HEADER */}
      <div className="header-row">
        <h2 className="page-title">Booking Management</h2>

        {/* FILTERS */}
        <div className="header-actions">

          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>

          <select
            className="filter-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="room">Room</option>
            <option value="water_park">Water Park</option>
            <option value="combo">Combo</option>
          </select>

          <button className="filter-btn" onClick={fetchBookings}>
            <FaFilter /> Refresh
          </button>

        </div>
      </div>

      {/* TABLE */}
      <div className="table-wrapper">
        <table className="booking-table">
          <thead>
            <tr>
              {/* <th>#ID</th> */}
              <th>Guest Name</th>
              <th>Booking Type</th>
              <th>Duration</th>
              <th>Visit / Check In</th>
              <th>Check Out</th>
              <th>Adults</th>
              <th>Children</th>
              <th>Total</th>
              <th>Discount</th>
              <th>Payable</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="13" className="no-data">Loading...</td>
              </tr>
            ) : filteredBookings.length === 0 ? (
              <tr>
                <td colSpan="13" className="no-data">No Bookings Found</td>
              </tr>
            ) : (
              filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  {/* <td>#{booking.id}</td> */}
                  <td>{booking.user_name || "—"}</td>
                  <td>
                    <span className={`type-badge type-${booking.booking_type}`}>
                      {booking.booking_type?.replace("_", " ")}
                    </span>
                  </td>
                  <td>{booking.duration_type || "—"}</td>
                  <td>{formatDate(booking.visit_date || booking.check_in)}</td>
                  <td>{formatDate(booking.check_out)}</td>
                  <td>{booking.adults}</td>
                  <td>{booking.children}</td>
                  <td>₹{booking.total_amount}</td>
                  <td>₹{booking.discount_amount}</td>
                  <td>₹{booking.payable_amount}</td>
                  <td>
                    <span className={`status-badge ${STATUS_COLORS[booking.status]}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td>{formatDate(booking.created_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
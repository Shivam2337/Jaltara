import React, { useEffect, useState } from "react";
import AdminAPI from "../../../BaseAPI/AdminAPI";
import { FaSearch, FaFilter } from "react-icons/fa";

const TYPE_CLS = {
  room:       "bg-[#e3f2fd] text-[#1565c0]",
  water_park: "bg-[#e0f7fa] text-[#00695c]",
  combo:      "bg-[#f3e5f5] text-[#6a1b9a]",
};

const STATUS_CLS = {
  pending:   "bg-[#fff3e0] text-[#e65100]",
  confirmed: "bg-[#e8f5e9] text-[#2e7d32]",
  cancelled: "bg-[#ffebee] text-[#c62828]",
  refunded:  "bg-[#e8eaf6] text-[#283593]",
};

const filterCls = "px-3 py-2 border border-[#e0e0e0] rounded-lg text-sm bg-white cursor-pointer outline-none focus:border-[#339af0]";

export default function AdminBookingList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await AdminAPI.get("bookings/history/");
      setBookings(data.results || data);
    } catch (err) {
      console.error("Bookings fetch error:", JSON.stringify(err.response?.data));
    } finally { setLoading(false); }
  };

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const filteredBookings = bookings.filter((b) => {
    const matchSearch = b.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) || b.id?.toString().includes(searchTerm);
    const matchStatus = filterStatus ? b.status === filterStatus : true;
    const matchType   = filterType   ? b.booking_type === filterType : true;
    return matchSearch && matchStatus && matchType;
  });

  return (
    <div className="p-5">

      {/* SEARCH + FILTERS */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div className="flex items-center gap-2 bg-white border border-[#e5e7eb] px-3 py-2 rounded-lg w-full sm:w-[260px]">
          <FaSearch className="text-[#999] shrink-0" />
          <input type="text" placeholder="Search by name or ID" value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-none outline-none w-full text-sm bg-transparent" />
        </div>
        <div className="flex flex-wrap gap-2">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={filterCls}>
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className={filterCls}>
            <option value="">All Types</option>
            <option value="room">Room</option>
            <option value="water_park">Water Park</option>
            <option value="combo">Combo</option>
          </select>
          <button onClick={fetchBookings}
            className="flex items-center gap-2 px-4 py-2 border border-[#ddd] bg-white hover:bg-[#f3f4f6] rounded-lg text-sm cursor-pointer transition-colors">
            <FaFilter /> Refresh
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-x-auto">
        <table className="w-full border-collapse min-w-[900px]">
          <thead className="bg-[#f1f5f9]">
            <tr>
              {["Guest Name","Booking Type","Duration","Visit / Check In","Check Out","Adults","Children","Total","Discount","Payable","Status","Created"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-sm font-semibold text-[#374151]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="12" className="text-center py-8 text-sm text-[#9ca3af]">Loading...</td></tr>
            ) : filteredBookings.length === 0 ? (
              <tr><td colSpan="12" className="text-center py-8 text-sm text-[#9ca3af]">No Bookings Found</td></tr>
            ) : (
              filteredBookings.map((booking) => (
                <tr key={booking.id} className="border-t border-[#f0f0f0] hover:bg-[#fafafa]">
                  <td className="px-4 py-3 text-sm text-[#374151]">{booking.user_name || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`px-[10px] py-1 rounded-full text-[12px] font-medium capitalize ${TYPE_CLS[booking.booking_type] || ""}`}>
                      {booking.booking_type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{booking.duration_type || "—"}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{formatDate(booking.visit_date || booking.check_in)}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{formatDate(booking.check_out)}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{booking.adults}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{booking.children}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">₹{booking.total_amount}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">₹{booking.discount_amount}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">₹{booking.payable_amount}</td>
                  <td className="px-4 py-3">
                    <span className={`px-[10px] py-1 rounded-full text-[12px] font-medium capitalize ${STATUS_CLS[booking.status] || ""}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{formatDate(booking.created_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

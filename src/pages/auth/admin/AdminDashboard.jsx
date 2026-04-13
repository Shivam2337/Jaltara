import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardStats } from "../../../redux/actions/AdminDashboardAction";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie,
  Cell, Legend
} from "recharts";
import AdminAPI from "../../../BaseAPI/AdminAPI";

const PIE_COLORS = ["#339af0", "#51cf66", "#ffd43b"];

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [recentBookings, setRecentBookings] = useState([]);
  const { loading, summary, lineChart, pieChart } = useSelector((state) => state.dashboard);
  const [today, setToday] = useState("");

  useEffect(() => {
    const date = new Date();
    setToday(date.toLocaleDateString("en-US", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    }));

    dispatch(getDashboardStats());

    const fetchRecentBookings = async () => {
      try {
        const { data } = await AdminAPI.get("bookings/history/");
        const list = data.results || data;
        setRecentBookings(list.slice(0, 4));
      } catch (err) {
        console.error("Recent bookings fetch error:", err);
      }
    };

    fetchRecentBookings();
  }, [dispatch]);

  const formattedLineChart = (() => {
    const monthMap = {};
    lineChart?.forEach((entry) => {
      const month = entry.month?.slice(0, 7);
      if (!monthMap[month]) monthMap[month] = { month };
      monthMap[month][entry.booking_type] = entry.count;
    });
    return Object.values(monthMap);
  })();

  const statusClass = (status) => {
    if (status === "confirmed") return "bg-[#d4edda] text-[#28a745]";
    if (status === "pending") return "bg-[#ffeeba] text-[#856404]";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="p-4 sm:p-6 bg-[#f6f7fb] min-h-screen">

      {/* HEADER */}
      <div className="flex justify-end items-center mb-6">
        <p className="text-[#777] text-sm">{today}</p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        <div className="bg-[#f6e58d] p-5 rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.08)] text-[#333]">
          <p className="text-sm">Total Booking</p>
          <h2 className="text-[28px] font-semibold mt-2">{loading ? "..." : summary?.total_bookings ?? 0}</h2>
        </div>
        <div className="bg-[#b8e994] p-5 rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.08)] text-[#333]">
          <p className="text-sm">Total Rooms Booking</p>
          <h2 className="text-[28px] font-semibold mt-2">{loading ? "..." : summary?.room_bookings ?? 0}</h2>
        </div>
        <div className="bg-[#c7d5f2] p-5 rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.08)] text-[#333]">
          <p className="text-sm">Total Water Park Packages</p>
          <h2 className="text-[28px] font-semibold mt-2">{loading ? "..." : summary?.water_park_bookings ?? 0}</h2>
          <span className="text-[12px] text-[#666]">Confirmed bookings</span>
        </div>
        <div className="bg-[#d7e3f8] p-5 rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.08)] text-[#333]">
          <p className="text-sm">Packages</p>
          <h3 className="font-semibold mt-2">Premium Experiences</h3>
          <span className="text-[12px] text-[#666]">
            Combo bookings: {loading ? "..." : summary?.package_bookings ?? 0}
          </span>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5 mb-6">
        <div className="bg-white p-5 rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
          <h3 className="font-semibold mb-3">Overall Resort Bookings (Monthly)</h3>
          {loading ? (
            <div className="h-[220px] bg-[#f2f3f7] rounded-lg flex items-center justify-center text-[#999] text-sm">Loading...</div>
          ) : formattedLineChart.length === 0 ? (
            <div className="h-[220px] bg-[#f2f3f7] rounded-lg flex items-center justify-center text-[#999] text-sm">No Data</div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={formattedLineChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="room" stroke="#339af0" name="Room" />
                <Line type="monotone" dataKey="water_park" stroke="#51cf66" name="Water Park" />
                <Line type="monotone" dataKey="combo" stroke="#ffd43b" name="Package" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white p-5 rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
          <h3 className="font-semibold mb-3">Guest Demographics</h3>
          {loading ? (
            <div className="h-[220px] bg-[#f2f3f7] rounded-lg flex items-center justify-center text-[#999] text-sm">Loading...</div>
          ) : pieChart?.length === 0 ? (
            <div className="h-[220px] bg-[#f2f3f7] rounded-lg flex items-center justify-center text-[#999] text-sm">No Data</div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieChart} dataKey="count" nameKey="type" cx="50%" cy="50%" outerRadius={80} label>
                  {pieChart?.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* RECENT BOOKINGS */}
      <div className="bg-white p-5 rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-base m-0">Recent Bookings</h3>
          <button
            onClick={() => navigate("/AdminBookingList")}
            className="border border-[#339af0] text-[#339af0] px-4 py-1.5 rounded-full text-sm cursor-pointer bg-transparent hover:bg-[#339af0] hover:text-white transition-all duration-200"
          >
            View All →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse mt-2 min-w-[500px]">
            <thead>
              <tr>
                {["Guest Name", "Booking Type", "Date", "Amount", "Status"].map((h) => (
                  <th key={h} className="text-left px-[10px] py-[10px] text-sm text-[#666] border-b border-[#eee]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center px-[10px] py-[10px] text-sm border-b border-[#eee]">
                    No Recent Bookings
                  </td>
                </tr>
              ) : (
                recentBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-[10px] py-[10px] text-sm border-b border-[#eee]">{booking.user_name || booking.user || "—"}</td>
                    <td className="px-[10px] py-[10px] text-sm border-b border-[#eee]">{booking.booking_type || "—"}</td>
                    <td className="px-[10px] py-[10px] text-sm border-b border-[#eee]">
                      {booking.created_at
                        ? new Date(booking.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                        : "—"}
                    </td>
                    <td className="px-[10px] py-[10px] text-sm border-b border-[#eee]">₹{booking.total_amount || booking.amount || "—"}</td>
                    <td className="px-[10px] py-[10px] text-sm border-b border-[#eee]">
                      <span className={`px-[10px] py-1 rounded-full text-[12px] ${statusClass(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;

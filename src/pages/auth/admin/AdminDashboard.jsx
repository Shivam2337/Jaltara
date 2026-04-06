import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";

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
  const { loading, summary, lineChart, pieChart } = useSelector(
    (state) => state.dashboard
  );
  const [today, setToday] = useState("");

  // ✅ CHANGE 1 — Single useEffect, removed duplicate
  useEffect(() => {
    const date = new Date();
    setToday(
      date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );

    dispatch(getDashboardStats());

    const fetchRecentBookings = async () => {
      try {
        const { data } = await AdminAPI.get("bookings/history/");
        console.log("Recent bookings:", data);
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

  return (
    <div className="dashboard-container">

      {/* HEADER */}
      <div className="dashboard-header">
        {/* <div>
          <p className="welcome-text">Welcome back,</p>
          <h2 className="manager-title">Resort Manager</h2>
        </div> */}
        <div className="dashboard-date">
          <p>{today}</p>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="stats-grid">
        <div className="stat-card yellow">
          <p>Total Booking</p>
          <h2>{loading ? "..." : summary?.total_bookings ?? 0}</h2>
        </div>
        <div className="stat-card green">
          <p>Total Rooms Booking</p>
          <h2>{loading ? "..." : summary?.room_bookings ?? 0}</h2>
        </div>
        <div className="stat-card blue">
          <p>Total Water Park Packages</p>
          <h2>{loading ? "..." : summary?.water_park_bookings ?? 0}</h2>
          <span>Confirmed bookings</span>
        </div>
        <div className="stat-card lightblue">
          <p>Packages</p>
          <h3>Premium Experiences</h3>
          <span>
            Combo bookings: {loading ? "..." : summary?.package_bookings ?? 0}
          </span>
        </div>
      </div>

      {/* CHARTS */}
      <div className="chart-section">
        <div className="chart-box">
          <h3>Overall Resort Bookings (Monthly)</h3>
          {loading ? (
            <div className="chart-placeholder">Loading...</div>
          ) : formattedLineChart.length === 0 ? (
            <div className="chart-placeholder">No Data</div>
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

        <div className="chart-box small">
          <h3>Guest Demographics</h3>
          {loading ? (
            <div className="chart-placeholder">Loading...</div>
          ) : pieChart?.length === 0 ? (
            <div className="chart-placeholder">No Data</div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieChart}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
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
      <div className="recent-bookings">

        {/* ✅ CHANGE 2 — Added header row with View All button */}
        <div className="recent-bookings-header">
          <h3>Recent Bookings</h3>
          <button
            className="view-all-btn"
            onClick={() => navigate("/AdminBookingList")}
          >
            View All →
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Guest Name</th>
              <th>Booking Type</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentBookings.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No Recent Bookings
                </td>
              </tr>
            ) : (
              recentBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.user_name || booking.user || "—"}</td>
                  <td>{booking.booking_type || "—"}</td>
                  <td>
                    {booking.created_at
                      ? new Date(booking.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—"}
                  </td>
                  <td>₹{booking.total_amount || booking.amount || "—"}</td>
                  <td>
                    <span className={`status ${booking.status}`}>
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
  );
};

export default AdminDashboard;
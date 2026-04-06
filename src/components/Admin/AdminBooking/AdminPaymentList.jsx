import React, { useEffect, useState } from "react";
import "./AdminPaymentList.css";
import { useDispatch, useSelector } from "react-redux";
import { getPaymentsAction } from "../../../redux/actions/AdminPaymentAction";
import { FaSearch, FaFilter } from "react-icons/fa";

const STATUS_COLORS = {
  pending: "status-pending",
  success: "status-confirmed",
  failed: "status-cancelled",
  refunded: "status-refunded",
};

export default function AdminPaymentList() {

  const dispatch = useDispatch();
  const { payments, loading } = useSelector((state) => state.payments);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    dispatch(getPaymentsAction(filterStatus));
  }, [dispatch, filterStatus]);

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const filteredPayments = payments?.filter((p) => {
    const matchSearch =
      p.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.razorpay_payment_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.booking_id?.toString().includes(searchTerm) ||
      p.id?.toString().includes(searchTerm);
    return matchSearch;
  });

  return (
    <div className="payment-list-container">

      {/* SEARCH ROW */}
      <div className="search-row">
        <div className="room-search">
          <FaSearch />
          <input
            type="text"
            placeholder="Search by ID, transaction ID, payment ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* HEADER */}
      <div className="header-row">
        <h2 className="page-title">Payment Management</h2>
        <div className="header-actions">

          {/* FILTER BY STATUS */}
          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>

          <button
            className="filter-btn"
            onClick={() => dispatch(getPaymentsAction(filterStatus))}
          >
            <FaFilter /> Refresh
          </button>

        </div>
      </div>

      {/* TABLE */}
      <div className="table-wrapper">
        <table className="payment-table">
          <thead>
            <tr>
              {/* <th>#ID</th> */}
              <th>Booking ID</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Gateway</th>
              <th>Razorpay ID</th>
              <th>Transaction ID</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="no-data">Loading...</td>
              </tr>
            ) : filteredPayments?.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">No Payments Found</td>
              </tr>
            ) : (
              filteredPayments?.map((payment) => (
                <tr key={payment.id}>
                  {/* <td>#{payment.id}</td> */}
                  <td>#{payment.booking_id || "—"}</td>
                  <td>₹{payment.amount}</td>
                  <td>
                    <span className={`status-badge ${STATUS_COLORS[payment.status] || "status-pending"}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td>{payment.gateway || "—"}</td>
                  <td>
                    <span className="transaction-id">
                      {payment.razorpay_payment_id || "—"}
                    </span>
                  </td>
                  <td>
                    <span className="transaction-id">
                      {payment.transaction_id || "—"}
                    </span>
                  </td>
                  <td>{formatDate(payment.created_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
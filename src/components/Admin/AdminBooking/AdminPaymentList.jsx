import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPaymentsAction } from "../../../redux/actions/AdminPaymentAction";
import { FaSearch, FaFilter } from "react-icons/fa";

const STATUS_CLS = {
  pending:  "bg-[#fff3e0] text-[#e65100]",
  success:  "bg-[#e8f5e9] text-[#2e7d32]",
  failed:   "bg-[#ffebee] text-[#c62828]",
  refunded: "bg-[#e8eaf6] text-[#283593]",
};

const filterCls = "px-3 py-2 border border-[#e0e0e0] rounded-lg text-sm bg-white cursor-pointer outline-none focus:border-[#339af0]";

export default function AdminPaymentList() {
  const dispatch = useDispatch();
  const { payments, loading } = useSelector((state) => state.payments);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => { dispatch(getPaymentsAction(filterStatus)); }, [dispatch, filterStatus]);

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const filteredPayments = payments?.filter((p) => {
    return (
      p.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.razorpay_payment_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.booking_id?.toString().includes(searchTerm) ||
      p.id?.toString().includes(searchTerm)
    );
  });

  return (
    <div className="p-5">

      {/* SEARCH + FILTERS */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div className="flex items-center gap-2 bg-white border border-[#e5e7eb] px-3 py-2 rounded-lg w-full sm:w-[300px]">
          <FaSearch className="text-[#999] shrink-0" />
          <input type="text" placeholder="Search by ID, transaction ID, payment ID" value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-none outline-none w-full text-sm bg-transparent" />
        </div>
        <div className="flex flex-wrap gap-2">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={filterCls}>
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
          <button onClick={() => dispatch(getPaymentsAction(filterStatus))}
            className="flex items-center gap-2 px-4 py-2 border border-[#ddd] bg-white hover:bg-[#f3f4f6] rounded-lg text-sm cursor-pointer transition-colors">
            <FaFilter /> Refresh
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-x-auto">
        <table className="w-full border-collapse min-w-[700px]">
          <thead className="bg-[#f9f9f9]">
            <tr>
              {["Booking ID","Amount","Status","Gateway","Razorpay ID","Transaction ID","Date"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-sm font-semibold text-[#555] border-b border-[#f0f0f0]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="text-center py-10 text-sm text-[#999]">Loading...</td></tr>
            ) : filteredPayments?.length === 0 ? (
              <tr><td colSpan="7" className="text-center py-10 text-sm text-[#999]">No Payments Found</td></tr>
            ) : (
              filteredPayments?.map((payment) => (
                <tr key={payment.id} className="border-b border-[#f0f0f0] hover:bg-[#fafafa]">
                  <td className="px-4 py-3 text-sm text-[#374151]">#{payment.booking_id || "—"}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">₹{payment.amount}</td>
                  <td className="px-4 py-3">
                    <span className={`px-[10px] py-1 rounded-full text-[12px] font-medium capitalize ${STATUS_CLS[payment.status] || STATUS_CLS.pending}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{payment.gateway || "—"}</td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-[12px] text-[#555] break-all">{payment.razorpay_payment_id || "—"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-[12px] text-[#555] break-all">{payment.transaction_id || "—"}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{formatDate(payment.created_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

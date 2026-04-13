import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTestimonials } from "../../../redux/actions/AdminTestimonialAction";
import AdminAPI from "../../../BaseAPI/AdminAPI";

const AdminTestimonial = () => {
  const dispatch = useDispatch();
  const { loading, error, testimonials = [] } = useSelector((state) => state.testimonials) || {};
  const [updating, setUpdating] = useState({});

  useEffect(() => { dispatch(getTestimonials()); }, [dispatch]);

  const renderStars = (rating) => "⭐".repeat(rating);

  const handleApprove = async (id) => {
    try {
      setUpdating((prev) => ({ ...prev, [id]: true }));
      await AdminAPI.patch(`cms/admin/testimonials/${id}/`, { is_approved: true });
      dispatch(getTestimonials());
    } catch (err) {
      console.error("Error approving testimonial:", err);
      alert("Failed to approve testimonial.");
    } finally {
      setUpdating((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="p-[30px] bg-[#f5f7fb] min-h-screen">

      <div className="mb-5">
        <h2 className="text-[26px] font-semibold">Testimonials</h2>
      </div>

      {loading && <p className="text-sm text-[#6b7280] mb-3">Loading...</p>}
      {error   && <p className="text-sm text-red-500 mb-3">{error}</p>}

      <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-x-auto">
        <table className="w-full border-collapse min-w-[500px]">
          <thead className="bg-[#f1f5f9]">
            <tr>
              {["Name","Category","Rating","Comment","Date","Action"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-sm font-semibold text-[#374151]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {testimonials.length > 0 ? (
              testimonials.map((item) => (
                <tr key={item.id} className="border-t border-[#eee] hover:bg-[#f9fafb]">
                  <td className="px-4 py-3 text-sm text-[#374151]">{item.name}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{item.category}</td>
                  <td className="px-4 py-3 text-sm">{renderStars(item.rating)}</td>
                  <td className="px-4 py-3 text-sm text-[#374151] max-w-[200px] truncate">{item.comment}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{new Date(item.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    {item.is_approved ? (
                      <span className="text-green-600 font-semibold text-sm">Approved</span>
                    ) : (
                      <button
                        onClick={() => handleApprove(item.id)}
                        disabled={updating[item.id]}
                        className="bg-[#2563eb] hover:bg-[#1e40af] disabled:bg-[#93c5fd] disabled:cursor-not-allowed text-white border-none px-[10px] py-[5px] rounded text-sm cursor-pointer transition-colors"
                      >
                        {updating[item.id] ? "Approving..." : "Approve"}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" className="text-center py-6 text-sm text-[#6b7280]">No Testimonials Found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTestimonial;

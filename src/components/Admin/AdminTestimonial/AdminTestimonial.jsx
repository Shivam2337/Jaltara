import React, { useEffect, useState } from "react";
import "./AdminTestimonial.css";
import { useDispatch, useSelector } from "react-redux";
import { getTestimonials } from "../../../redux/actions/AdminTestimonialAction";
import axios from "axios";
import AdminAPI from "../../../BaseAPI/AdminAPI";
const AdminTestimonial = () => {
  const dispatch = useDispatch();
  const { loading, error, testimonials = [] } =
    useSelector((state) => state.testimonials) || {};

  const [updating, setUpdating] = useState({}); // track which testimonial is being approved

  useEffect(() => {
    dispatch(getTestimonials());
  }, [dispatch]);

  const renderStars = (rating) => {
    return "⭐".repeat(rating);
  };

  const handleApprove = async (id) => {
    try {
      setUpdating((prev) => ({ ...prev, [id]: true }));

      await AdminAPI.patch(`cms/admin/testimonials/${id}/`, {
        is_approved: true,
      });

      // Refresh testimonials after approving
      dispatch(getTestimonials());
    } catch (err) {
      console.error("Error approving testimonial:", err);
      alert("Failed to approve testimonial.");
    } finally {
      setUpdating((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="AdminTestimonial-page">
      <div className="AdminTestimonial-header">
        <h2>Testimonials</h2>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="AdminTestimonial-table-container">
        <table className="AdminTestimonial-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {testimonials.length > 0 ? (
              testimonials.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{renderStars(item.rating)}</td>
                  <td>{item.comment}</td>
                  <td>{new Date(item.created_at).toLocaleDateString()}</td>
                  <td>
                    {item.is_approved ? (
                      <span style={{ color: "green", fontWeight: "bold" }}>
                        Approved
                      </span>
                    ) : (
                      <button
                        onClick={() => handleApprove(item.id)}
                        disabled={updating[item.id]}
                        className="AdminTestimonial-approve-btn"
                      >
                        {updating[item.id] ? "Approving..." : "Approve"}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No Testimonials Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTestimonial;
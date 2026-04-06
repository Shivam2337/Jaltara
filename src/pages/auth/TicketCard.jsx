import React, { useState } from "react";
import "./TicketCard.css";
import { useDispatch, useSelector } from "react-redux";
import { createTestimonialAction, getMyBookingsAction, updateTestimonialAction } from "../../redux/UserActions";
import { toast } from "react-toastify";

const TicketCard = ({ bookings }) => {
  const storeBookings = useSelector((s) => s.userMyBookings?.list || []);
  const loading = useSelector((s) => s.userMyBookings?.loading || false);
  const error = useSelector((s) => s.userMyBookings?.error || null);

  const spinnerStyle = {
    width: 34,
    height: 34,
    border: "3px solid #e5e7eb",
    borderTopColor: "#339af0",
    borderRadius: "50%",
    animation: "tkspin 0.8s linear infinite",
  };

  const data =
    (bookings && bookings.length && bookings) ||
    (storeBookings && storeBookings.length && storeBookings.map((b) => ({
      id: b.id,
      booking_type: (b.booking_type || "").replace(/_/g, " "),
      category: b.booking_type || "water_park",
      status: (b.status || "").toUpperCase(),
      check_in: b.check_in || null,
      check_out: b.check_out || null,
      visit_date: b.visit_date || null,
      start_time: b.start_time || null,
      adults: b.adults || null,
      children: b.children || null,
      payable_amount: b.amount || 0,
      testimonial: b.testimonial || null,
    }))) ||
    [];

  const dispatch = useDispatch();
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenFeedback = (booking) => {
    setSelectedBooking(booking);
    if (booking.testimonial) {
      setRating(booking.testimonial.rating || 0);
      setComment(booking.testimonial.comment || "");
    } else {
      setRating(0);
      setComment("");
    }
    setShowFeedbackModal(true);
  };

  const handleSubmitFeedback = async () => {
    if (!selectedBooking || rating === 0) return;
    setIsSubmitting(true);

    const payload = {
      booking: selectedBooking.id,
      category: selectedBooking.category,
      rating,
      comment,
    };

    let res;
    if (selectedBooking.testimonial) {
      res = await dispatch(updateTestimonialAction(selectedBooking.testimonial.rating_id, payload));
    } else {
      res = await dispatch(createTestimonialAction(payload));
    }

    if (res?.ok) {
      toast.success(selectedBooking.testimonial ? "Review updated!" : "Review submitted!");
      dispatch(getMyBookingsAction());
      setShowFeedbackModal(false);
    } else {
      const err = res?.error;
      if (Array.isArray(err)) {
        toast.error(err[0]);
      } else if (typeof err === "object") {
        const firstKey = Object.keys(err)[0];
        const msg = Array.isArray(err[firstKey]) ? err[firstKey][0] : err[firstKey];
        toast.error(msg || "Failed to save review");
      } else {
        toast.error(err || "Failed to save review");
      }
    }
    setIsSubmitting(false);
  };

  const formatDate = (date) => new Date(date).toLocaleDateString("en-IN");

  const formatTime = (time) => {
    if (!time) return null;
    if (typeof time !== "string") return null;
    // Handle both string times "10:00" and full ISO strings
    if (time.includes("T") || time.includes("-")) {
      const d = new Date(time);
      if (isNaN(d.getTime())) return time;
      return d.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return time;
  };

  const todayStr = new Date().toISOString().split("T")[0];

  const getTargetDate = (b) => b.visit_date || b.check_in || null;

  const upcoming = data.filter((b) => {
    const d = getTargetDate(b);
    if (!d) return false;
    return d >= todayStr;
  });

  const past = data.filter((b) => {
    const d = getTargetDate(b);
    if (!d) return false;
    return d < todayStr;
  });

  return (
    <div className="myacc-ticket-main-container">
      <style>{`@keyframes tkspin { to { transform: rotate(360deg); } }`}</style>

      {loading && (
        <div style={{ display: "flex", justifyContent: "center", padding: 16 }}>
          <div style={spinnerStyle} aria-label="Loading bookings" />
        </div>
      )}

      {!loading && error && (
        <div className="myacc-ticket-empty" style={{ textAlign: "center", color: "#64748b", padding: 16 }}>
          Failed to load bookings
        </div>
      )}

      {!loading && !error && data.length === 0 && (
        <div className="myacc-ticket-empty" style={{ textAlign: "center", color: "#64748b", padding: 16 }}>
          No bookings found
        </div>
      )}

      {!loading && !error && data.length > 0 && (
        <>
          {/* SUMMARY */}
          <div className="myacc-ticket-summary">
            <div className="myacc-ticket-summary-box">
              <span className="myacc-ticket-summary-number">{data.length}</span>
              <span className="myacc-ticket-summary-label">Total</span>
            </div>

            <div className="myacc-ticket-summary-box">
              <span className="myacc-ticket-summary-number">{upcoming.length}</span>
              <span className="myacc-ticket-summary-label">Upcoming</span>
            </div>

            <div className="myacc-ticket-summary-box">
              <span className="myacc-ticket-summary-number">{past.length}</span>
              <span className="myacc-ticket-summary-label">Past</span>
            </div>
          </div>

          {/* UPCOMING */}
          <div className="myacc-ticket-section">
            <h3 className="myacc-ticket-section-title">Upcoming Tickets</h3>

            <div className="myacc-ticket-grid">
              {upcoming.map((b) => (
                <div className="myacc-ticket-card" key={b.id}>
                  <div className="myacc-ticket-card-header">
                    <h4 className="myacc-ticket-card-title">
                      {b.booking_type.replace(/_/g, " ")}
                    </h4>
                    <span className="myacc-ticket-card-status upcoming">
                      {b.status}
                    </span>
                  </div>

                  {b.category === "room" ? (
                    <>
                      {b.check_in && (
                        <div className="myacc-ticket-card-info">
                          <span className="myacc-ticket-label">Check In</span>
                          <span className="myacc-ticket-value">
                            {formatDate(b.check_in)}
                          </span>
                        </div>
                      )}
                      {b.check_out && (
                        <div className="myacc-ticket-card-info">
                          <span className="myacc-ticket-label">Check Out</span>
                          <span className="myacc-ticket-value">
                            {formatDate(b.check_out)}
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {b.visit_date && (
                        <div className="myacc-ticket-card-info">
                          <span className="myacc-ticket-label">Visit Date</span>
                          <span className="myacc-ticket-value">
                            {formatDate(b.visit_date)}
                          </span>
                        </div>
                      )}
                      {b.check_in && (
                        <div className="myacc-ticket-card-info">
                          <span className="myacc-ticket-label">Entry Time</span>
                          <span className="myacc-ticket-value">
                            {formatTime(b.check_in)}
                          </span>
                        </div>
                      )}
                    </>
                  )}

                  {(b.adults != null || b.children != null) && (<div className="myacc-ticket-card-info">
                    <span className="myacc-ticket-label">Guests</span>
                    <span className="myacc-ticket-value">
                      {b.adults}A • {b.children}C
                    </span>
                  </div>)}

                  <div className="myacc-ticket-card-info">
                    <span className="myacc-ticket-label">Amount</span>
                    <span className="myacc-ticket-value">₹{b.payable_amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PAST */}
          <div className="myacc-ticket-section">
            <h3 className="myacc-ticket-section-title">Past Tickets</h3>

            <div className="myacc-ticket-grid">
              {past.map((b) => (
                <div className="myacc-ticket-card" key={b.id}>
                  <div className="myacc-ticket-card-header">
                    <h4 className="myacc-ticket-card-title">
                      {b.booking_type.replace(/_/g, " ")}
                    </h4>
                    <span className="myacc-ticket-card-status past">
                      {b.status}
                    </span>
                  </div>

                  {b.category === "room" ? (
                    <>
                      {b.check_in && (
                        <div className="myacc-ticket-card-info">
                          <span className="myacc-ticket-label">Check In</span>
                          <span className="myacc-ticket-value">
                            {formatDate(b.check_in)}
                          </span>
                        </div>
                      )}
                      {b.check_out && (
                        <div className="myacc-ticket-card-info">
                          <span className="myacc-ticket-label">Check Out</span>
                          <span className="myacc-ticket-value">
                            {formatDate(b.check_out)}
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {b.visit_date && (
                        <div className="myacc-ticket-card-info">
                          <span className="myacc-ticket-label">Visit Date</span>
                          <span className="myacc-ticket-value">
                            {formatDate(b.visit_date)}
                          </span>
                        </div>
                      )}
                    </>
                  )}

                  {(b.adults != null || b.children != null) && (<div className="myacc-ticket-card-info">
                    <span className="myacc-ticket-label">Guests</span>
                    <span className="myacc-ticket-value">
                      {b.adults}A • {b.children}C
                    </span>
                  </div>)}

                  <div className="myacc-ticket-card-info">
                    <span className="myacc-ticket-label">Paid</span>
                    <span className="myacc-ticket-value">₹{b.payable_amount}</span>
                  </div>

                  {/* TESTIMONIAL / RATING */}
                  <div className="myacc-ticket-stars" onClick={() => handleOpenFeedback(b)}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span
                        key={s}
                        className={`myacc-ticket-star ${
                          (b.testimonial?.rating || 0) >= s ? "filled" : ""
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* FEEDBACK MODAL */}
      {showFeedbackModal && (
        <div className="feedback-modal-overlay" onClick={() => setShowFeedbackModal(false)}>
          <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="feedback-modal-title">
              {selectedBooking?.testimonial ? "Update Feedback" : "Share Your Experience"}
            </h3>
            <p className="feedback-modal-subtitle">
              How was your experience with {selectedBooking?.booking_type}?
            </p>

            <div className="feedback-modal-stars-row">
              {[1, 2, 3, 4, 5].map((s) => (
                <span
                  key={s}
                  className={`feedback-modal-star ${rating >= s ? "active" : ""}`}
                  onClick={() => setRating(s)}
                >
                  ★
                </span>
              ))}
            </div>

            <textarea
              className="feedback-modal-textarea"
              placeholder="Tell us more about your visit..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <div className="feedback-modal-actions">
              <button
                className="feedback-modal-btn feedback-modal-btn-cancel"
                onClick={() => setShowFeedbackModal(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                className="feedback-modal-btn feedback-modal-btn-submit"
                onClick={handleSubmitFeedback}
                disabled={isSubmitting || rating === 0}
              >
                {isSubmitting ? "Saving..." : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketCard;

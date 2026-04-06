import React, { useState } from "react";
import Input from "../../components/common/Input";
import "./AuditoriumBooking.css";

export default function AuditoriumBooking() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [eventType, setEventType] = useState("Wedding");
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const prices = {
    Wedding: 50000,
    Conference: 35000,
    "Corporate Event": 40000,
    Other: 30000,
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      setError("Please select both dates");
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      setError("End date must be after start date");
      return;
    }

    setError("");
    setShowSuccess(true);
    e.target.reset();
  };

  return (
    <div className="auditorium-booking-page">
      <div className="auditorium-booking-title-card">
        <h1>Auditorium Hall Booking</h1>
        <p className="auditorium-booking-subheading">
          5000 sq. ft. | Fully AC | Ideal for Events & Functions
        </p>
      </div>

      <div className="auditorium-booking-layout">
        {/* LEFT */}
        <div className="auditorium-booking-left">
          <h2>Hall Features</h2>
          <ul className="auditorium-booking-features">
            <li>✔ 5000 sq. ft. fully AC auditorium</li>
            <li>✔ Suitable for weddings & conferences</li>
            <li>✔ Separate changing rooms</li>
            <li>✔ CCTV surveillance</li>
          </ul>
        </div>

        {/* RIGHT */}
        <form className="auditorium-booking-form-card" onSubmit={handleSubmit}>
          <h3>Book Auditorium</h3>

          <Input type="text" placeholder="Full Name" required />
          <Input type="email" placeholder="Email Address" required />
          <Input type="text" placeholder="Mobile Number" required />

          <label className="auditorium-booking-input-label">Start Date</label>
          <Input type="date" onChange={(e) => setStartDate(e.target.value)} />

          <label className="auditorium-booking-input-label">End Date</label>
          <Input type="date" onChange={(e) => setEndDate(e.target.value)} />

          <select
            className="auditorium-booking-input-field"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
          >
            <option>Wedding</option>
            <option>Conference</option>
            <option>Corporate Event</option>
            <option>Other</option>
          </select>

          <div className="auditorium-booking-price-box">
            Price: ₹{prices[eventType]}
          </div>

          {error && <p className="auditorium-booking-error-text">{error}</p>}

          <button className="auditorium-booking-btn auditorium-booking-red-btn">
            Submit Booking Request
          </button>
        </form>
      </div>

      {showSuccess && (
        <div className="auditorium-booking-success-overlay">
          <div className="auditorium-booking-success-modal">
            <h3>🎉 Request Submitted</h3>
            <p>Your booking request has been noted.</p>
            <button onClick={() => setShowSuccess(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

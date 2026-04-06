import React from "react";
import "./ComboBooking.css";

const ComboBookingUI = () => {
  return (
    <div className="combo-ui">
      <h2>Combo Booking</h2>

      {/* Booking Details */}
      <div className="section">
        <h3>Booking Details</h3>

        <div className="grid">
          <input type="date" placeholder="Check In" />
          <input type="date" placeholder="Check Out" />
          <input type="date" placeholder="Visit Date" />

          <select>
            <option>2 Hours</option>
            <option>6 Hours</option>
            <option>24 Hours</option>
            <option>Days</option>
          </select>

          <input type="number" min="1" placeholder="Adults" />
          <input type="number" min="0" placeholder="Children" />
          <input type="text" placeholder="Coupon Code (Optional)" />
        </div>
      </div>

      {/* Package Selection */}
      <div className="section">
        <h3>Combo Package</h3>
        <div className="card">
          <span>Room + Water Park Combo</span>
          <input type="number" min="1" defaultValue="1" />
        </div>
      </div>

      {/* Water Park Tickets */}
      <div className="section">
        <h3>Water Park Tickets</h3>

        <div className="ticket">
          <span>Adult Ticket</span>
          <input type="number" min="0" defaultValue="2" />
        </div>

        <div className="ticket">
          <span>Child Ticket</span>
          <input type="number" min="0" defaultValue="1" />
        </div>
      </div>

      {/* Submit */}
      <button className="confirm-btn">Confirm Booking</button>
    </div>
  );
};

export default ComboBookingUI;

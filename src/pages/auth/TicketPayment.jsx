import React from "react";
import "./TicketPayment.css";

const TicketPayment = () => {
  return (
    <div className="ticket-payment-page">
      <div className="ticket-payment-header">
        <h2 className="ticket-payment-title">Ticket & Payment</h2>
      </div>

      <div className="ticket-payment-main">
        {/* LEFT – PAYMENT CARD */}
        <div className="ticket-payment-card">
          <h3 className="ticket-payment-subtitle">Confirm and Pay</h3>

          <div className="ticket-payment-methods">
            <label className="ticket-payment-option">
              <input type="radio" name="payment" defaultChecked />
              <span>New Card</span>
            </label>

            <div className="ticket-payment-card-inputs">
              <input type="text" placeholder="Card number" />

              <div className="ticket-payment-small-inputs">
                <input type="text" placeholder="Expiry date" />
                <input type="text" placeholder="CVC" />
              </div>
            </div>

            <label className="ticket-payment-option">
              <input type="radio" name="payment" />
              <span>UPI Payment and cards</span>
            </label>
          </div>

          <div className="ticket-payment-secure-info">
            🔒 Your payment info is stored securely
          </div>

          <div className="ticket-payment-voucher">
            <label>Voucher or Gift Card</label>
            <input type="text" placeholder="Enter code" />
          </div>

          <button className="ticket-payment-pay-btn">Pay</button>
        </div>

        {/* RIGHT – BOOKING DETAILS */}
        <div className="ticket-payment-booking-card">
          <div className="ticket-payment-row">
            <div className="ticket-payment-form-group">
              <label>Booking ID</label>
              <input type="text" value="101" disabled />
            </div>

            <div className="ticket-payment-form-group">
              <label>Booking Type</label>
              <input type="text" value="DAY_PASS" disabled />
            </div>
          </div>

          <div className="ticket-payment-row">
            <div className="ticket-payment-form-group">
              <label>Duration Type</label>
              <input type="text" value="FULL_DAY" disabled />
            </div>
          </div>

          <div className="ticket-payment-row">
            <div className="ticket-payment-form-group">
              <label>Visit Date</label>
              <input type="text" value="2026-02-10" disabled />
            </div>
          </div>

          <div className="ticket-payment-row">
            <div className="ticket-payment-form-group">
              <label>Start Time</label>
              <input type="text" value="10:00 AM" disabled />
            </div>
          </div>

          <div className="ticket-payment-row">
            <div className="ticket-payment-form-group">
              <label>Check In</label>
              <input type="text" value="2026-02-10 10:15 AM" disabled />
            </div>

            <div className="ticket-payment-form-group">
              <label>Check Out</label>
              <input type="text" value="2026-02-10 06:30 PM" disabled />
            </div>
          </div>

          <div className="ticket-payment-row">
            <div className="ticket-payment-form-group">
              <label>Adults</label>
              <input type="text" value="2" disabled />
            </div>

            <div className="ticket-payment-form-group">
              <label>Children</label>
              <input type="text" value="1" disabled />
            </div>
          </div>

          <div className="ticket-payment-footer">
            <button className="ticket-payment-back-btn">Back</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketPayment;

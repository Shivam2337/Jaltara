import React from "react";
import "./BookingCreate.css";

export default function BookingDetail() {
  const booking = {
    park_name: "Jaltara Parks: The Best Water & Adventure Park in Pune",
    location: "Jaltara Water Parks",
    image:
      "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=600",
    visit_date: "Thu 12 Feb",
    ticket_name: "Full Day Pass | Splash & Thrill - Adult",
    original_price: 1299,
    discounted_price: 999,
    adults: 2,
    children: 1,
    addons: [
      { id: 1, name: "Locker", quantity: 2, price: 200 },
      { id: 2, name: "Lunch Buffet", quantity: 1, price: 450 },
    ],
  };

  const subtotal = booking.discounted_price;

  const addonsTotal = booking.addons.reduce(
    (sum, a) => sum + a.price * a.quantity,
    0
  );

  const total = subtotal + addonsTotal;

  // ===== BUTTON FUNCTIONS =====
  const handlePay = () => {
    alert("Redirecting to payment...");
    // integrate payment gateway here
  };

  const handleCancel = () => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel booking?"
    );
    if (confirmCancel) {
      alert("Booking cancelled");
    }
  };

  return (
    <div className="page">
      <div className="summary-card">
        <div className="card-header">
          <img src={booking.image} alt="park" />
          <div className="header-info">
            <h3>{booking.park_name}</h3>
            <p className="location">📍 {booking.location}</p>
          </div>
        </div>

        <div className="divider" />

        <div className="section">
          <h4>Date</h4>
          <p>{booking.visit_date}</p>
        </div>

        <div className="divider" />

        <div className="section">
          <h4>Tickets and extras</h4>
          <div className="ticket-row">
            <span>1 x {booking.ticket_name}</span>
            <div className="price-block">
              <span className="old-price">₹{booking.original_price}</span>
              <span className="new-price">₹{booking.discounted_price}</span>
            </div>
          </div>
        </div>

        {booking.addons.length > 0 && (
          <>
            <div className="divider" />
            <div className="section">
              <h4>Addons</h4>
              {booking.addons.map((addon) => (
                <div key={addon.id} className="addon-row">
                  <span>
                    {addon.quantity} x {addon.name}
                  </span>
                  <span>₹{addon.price * addon.quantity}</span>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="divider" />

        <div className="section">
          <h4>Price details</h4>
          <div className="price-row">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="price-row">
            <span>Addons</span>
            <span>₹{addonsTotal}</span>
          </div>
          <div className="price-row total">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        

      {/* ===== BUTTON SECTION ===== */}
      <div className="action-buttons">
        <button className="pay-btn" onClick={handlePay}>
          Pay Now
        </button>

        <button className="cancel-btn" onClick={handleCancel}>
          Cancel Booking
        </button>
       </div>
      </div> 
      </div>
    </div>
  );
}

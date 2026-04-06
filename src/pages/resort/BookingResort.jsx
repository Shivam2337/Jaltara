import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BookingResort.css";

import Resort1 from "../../assets/images/Deluxe 1.jpg";
import Resort2 from "../../assets/images/Deluxe 2.jpg";
import Waterpark1 from "../../assets/images/Premium 1.jpg";
import Waterpark2 from "../../assets/images/Premium 2.jpg";
import Package1 from "../../assets/images/Cottage 1.jpg";
import Package2 from "../../assets/images/Cottage 2.jpg";

const imageMap = {
  resort: {
    "Deluxe Room": [Resort1, Resort2],
    "Premium Room": [Waterpark1, Waterpark2],
    Cottage: [Package1, Package2],
  },
  waterpark: {
    "Family / Kids": [Waterpark1, Waterpark2],
    "High Thrill": [Resort1, Waterpark1],
  },
  package: {
    "Waterpark + Stay": [Resort1, Waterpark1],
    "Special Offers (Seasonal / Festival / Corporate)": [Package1, Resort2],
    "Honeymoon / Family / Group Package": [Package1, Package2],
  },
};

const subOptions = {
  resort: ["Deluxe Room", "Premium Room", "Cottage"],
  waterpark: ["Family / Kids", "High Thrill"],
  package: [
    "Waterpark + Stay",
    "Special Offers (Seasonal / Festival / Corporate)",
    "Honeymoon / Family / Group Package",
  ],
};

const addOnsList = [
  { name: "Train for Small Children (2 Bogies)", price: 800 },
  { name: "Changing Room", price: 1000 },
  { name: "Lockers (Gents & Ladies Separate)", price: 500 },
  { name: "Accelerator (15 ft & 30 ft)", price: 1500 },
];

export default function BookingResort() {
  const location = useLocation();
  const selectedRoom = location.state || {};

  const [bookingType, setBookingType] = useState(
    selectedRoom?.category?.toLowerCase() || "resort"
  );

  const [subType, setSubType] = useState(
    selectedRoom?.roomType || subOptions.resort[0]
  );

  const [selectedAddOn, setSelectedAddOn] = useState("");

  const [items, setItems] = useState(
    selectedRoom?.roomType
      ? [
          {
            item_type: selectedRoom.roomType,
            quantity: 1,
            price: selectedRoom.priceValue || selectedRoom.price || 0,
          },
        ]
      : []
  );

  /* DEFAULT DESCRIPTIONS */
  const bookingData = {
    resort: {
      desc: "Relax in our luxurious resort rooms with modern amenities and peaceful surroundings.",
    },
    waterpark: {
      desc: "Enjoy thrilling water rides, wave pools, and fun activities for all age groups.",
    },
    package: {
      desc: "Best value packages combining stay, waterpark access, meals, and activities.",
    },
  };

  /* DISPLAY DATA (FIXED IMAGE FALLBACK LOGIC) */
  const data = selectedRoom?.roomType
    ? {
        title: selectedRoom.roomType,
        desc:
          selectedRoom.description ||
          bookingData[selectedRoom.category || "resort"]?.desc,
        images:
          selectedRoom.images ||
          imageMap["resort"][selectedRoom.roomType] ||
          [],
      }
    : {
        title: subType,
        desc: bookingData[bookingType].desc,
        images:
          imageMap[bookingType]?.[subType] ||
          imageMap[bookingType][subOptions[bookingType][0]],
      };

  /* HANDLE BOOKING TYPE CHANGE */
  const handleBookingTypeChange = (e) => {
    const type = e.target.value;
    setBookingType(type);
    setSubType(subOptions[type][0]);
    setItems([]);
  };

  /* HANDLE SUB TYPE CHANGE */
  const handleSubTypeChange = (value) => {
    setSubType(value);

    if (selectedRoom?.roomType) return;

    setItems([
      {
        item_type: value,
        quantity: 1,
        price: 0,
      },
    ]);
  };

  /* ADD ADDON */
  const addItem = () => {
    if (!selectedAddOn) return;
    const selected = addOnsList.find((item) => item.name === selectedAddOn);
    if (!selected) return;
    setItems([
      ...items,
      {
        item_type: selected.name,
        quantity: 1,
        price: selected.price,
      },
    ]);
    setSelectedAddOn("");
  };

  /* TOTAL CALCULATION */
  const totalAmount = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const navigate = useNavigate();
  
  return (
    <div className="booking-page">
      {/* TOP TITLE CARD */}
      <div className="booking-title-card">
        <h1>{data.title}</h1>

        <p>
          {selectedRoom?.category
            ? selectedRoom.category
            : bookingType.charAt(0).toUpperCase() +
              bookingType.slice(1)}
        </p>
      </div>

      <div className="booking-layout">
        {/* LEFT SIDE */}
        <div className="booking-left">
          <p className="booking-desc">{data.desc}</p>

          <h2>Highlights</h2>
          <div className="booking-resort-amenities-grid">
            <span>🏨 Comfortable Stay</span>
            <span>💦 Waterpark Access</span>
            <span>🍽 Dining Facilities</span>
            <span>🎉 Family Friendly</span>
          </div>

          <div className="booking-images">
            {data.images?.length > 0 &&
              data.images.map((img, i) => (
                <img key={i} src={img} alt={data.title} />
              ))}
          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="booking-form-card">
          <h3>Booking Details</h3>

          <label>Booking Type</label>
          <select
            className="booking-resort-input-field"
            value={bookingType}
            onChange={handleBookingTypeChange}
            disabled={!!selectedRoom?.roomType}
          >
            <option value="resort">Resort</option>
            <option value="waterpark">Waterpark</option>
            <option value="package">Package</option>
          </select>

          <label>
            {bookingType === "resort"
              ? "Room Type"
              : bookingType === "waterpark"
              ? "Waterpark Category"
              : "Package Type"}
          </label>

          <select
            className="booking-resort-input-field"
            value={subType}
            onChange={(e) => handleSubTypeChange(e.target.value)}
          >
            {subOptions[bookingType].map((opt, i) => (
              <option key={i} value={opt}>
                {opt}
              </option>
            ))}
          </select>

          <label>Check In</label>
          <input type="date" className="booking-resort-input-field" />

          <label>Check Out</label>
          <input type="date" className="booking-resort-input-field" />

          <h4>Booking Items</h4>

          <label>Add On Services</label>
          <select
            className="booking-resort-input-field"
            value={selectedAddOn}
            onChange={(e) => setSelectedAddOn(e.target.value)}
          >
            <option value="">Select Add-On Items</option>
            {addOnsList.map((addon, i) => (
              <option key={i} value={addon.name}>
                {addon.name} - ₹{addon.price}
              </option>
            ))}
          </select>

          <button onClick={addItem} className="booking-resort-add-item-btn">
            + Add AddOn
          </button>

          {items.map((item, i) => (
            <div className="item-row" key={i}>
              <input className="input-field small" value={item.item_type} readOnly />
              <input className="input-field small" value={item.quantity} readOnly />
              <input className="input-field small" value={item.price} readOnly />
            </div>
          ))}

          <div className="booking-resort-price-summary">
            <div>Total Amount: ₹{totalAmount}</div>
            <div className="booking-resort-payable">
              Payable: ₹{totalAmount}
            </div>
          </div>

          <button
            className="booking-resort-book-btn booking-resort-red-btn"
            onClick={() => navigate(`/BookingCreate`)}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
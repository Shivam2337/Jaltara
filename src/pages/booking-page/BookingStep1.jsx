import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import "./BookingStep1.css";
import { setDates } from "../../features/booking/bookingSlice";

export default function BookingStep1() {
  const booking = useSelector((state) => state.booking);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isWaterpark, setIsWaterpark] = useState(
    booking.checkOut === null && booking.checkIn
      ? true
      : booking.checkOut
      ? false
      : true
  );

  const [checkIn, setCheckIn] = useState(booking.checkIn || "");
  const [checkOut, setCheckOut] = useState(booking.checkOut || "");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const totalPeople = adults + children;

  const today = new Date().toISOString().split("T")[0];

  const calculateNights = (start, end) => {
    if (!start || !end) return 0;

    const startDate = new Date(start);
    const endDate = new Date(end);

    const diff = endDate - startDate;

    const nights = diff / (1000 * 60 * 60 * 24);

    return nights >= 0 ? nights : 0;
  };

  const nights = calculateNights(checkIn, checkOut);

  const handleContinue = () => {
    dispatch(
      setDates({
        checkIn,
        checkOut: isWaterpark ? null : checkOut,
      })
    );

    // guests are no longer stored globally; counts will be attached to selected items

    navigate("/book/packages");
  };

  

  const continueDisabled =
    isWaterpark === null || (isWaterpark ? !checkIn : !checkIn || !checkOut);

  return (
    <div className="booking-s1-container">
      <div className="booking-s1-card">
        <h2 className="booking-s1-title">Booking Details</h2>

        {/* WATERPARK OPTION */}

        <div className="booking-s1-waterpark">
          <p className="booking-s1-label">Waterpark Visit?</p>

          <label className="booking-s1-radio">
            <input
              type="radio"
              name="waterpark"
              value="yes"
              checked={isWaterpark === true}
              onChange={() => {
                setIsWaterpark(true);
                setCheckOut("");
              }}
            />
            Yes
          </label>

          <label className="booking-s1-radio">
            <input
              type="radio"
              name="waterpark"
              value="no"
              checked={isWaterpark === false}
              onChange={() => setIsWaterpark(false)}
            />
            No
          </label>
        </div>

        {/* DATE FIELDS */}

        <div className="booking-s1-fields">
          <div className="booking-s1-field">
            <label className="booking-s1-label">Check-in Date</label>

            <input
              className="booking-s1-input"
              type="date"
              value={checkIn}
              min={today}
              onChange={(e) => {
                const newCheckIn = e.target.value;

                setCheckIn(newCheckIn);

                if (checkOut && new Date(checkOut) < new Date(newCheckIn)) {
                  setCheckOut(newCheckIn);
                }
              }}
            />
          </div>

          {!isWaterpark && (
            <div className="booking-s1-field">
              <label className="booking-s1-label">Check-out Date</label>

              <input
                className="booking-s1-input"
                type="date"
                value={checkOut}
                min={checkIn}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>
          )}
        </div>

       
        {/* BUTTONS */}

        <div className="booking-s1-buttons">
          <button
            className="booking-s1-btn booking-s1-btn-back"
            onClick={() => navigate(-1)}
          >
            Back
          </button>

          <button
            className="booking-s1-btn booking-s1-btn-continue"
            disabled={continueDisabled}
            onClick={handleContinue}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

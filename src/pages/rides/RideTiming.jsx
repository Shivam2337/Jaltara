import React from "react";
// import { useNavigate } from "react-router-dom";
import "./RideTiming.css";

const RideTimings = () => {

//  const navigate = useNavigate();

  return (
    <div className="ride-timing-page">
      <div className="ride-timing-wrapper">
        <div className="ride-timing-card">
          <h1>Park Timings</h1>

          <div className="ride-timing-box">
            <p>
              <strong>Monday to Sunday</strong>
            </p>
            <span>10:00 AM – 06:00 PM</span>
          </div>

          <div className="ride-timing-box">
            <p>
              <strong>Rides & Attractions</strong>
            </p>
            <span>10:30 AM – 05:30 PM</span>
          </div>
        </div>

        <div className="ride-timing-notes">
          <h2>Important Notes</h2>
          <ul>
            <li>Height and weight restrictions apply on select rides.</li>
            <li>Safety harness must be properly fastened at all times.</li>
            <li>Only Nylon / Lycra costumes are allowed in water rides.</li>
            <li>All rides will be on hold during Wave Pool operations.</li>
            <li>Schedule may change due to safety or maintenance.</li>
            <li>Re-entry is not permitted.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RideTimings;

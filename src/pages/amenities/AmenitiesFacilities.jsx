import React from "react";
import { Link } from "react-router-dom";
import "./AmenitiesFacilities.css";

export default function AmenitiesFacilities() {
  return (
    <section className="amenities-page">
      <h2 className="section-title">Amenities & Facilities</h2>

      <div className="amenities-grid">
        <div className="amenity-card">
          <h3>🏨 Stay & Comfort</h3>
          <ul>
            <li>13 Full AC Rooms</li>
            <li>7 Single AC Rooms</li>
            <li>6 AC Rooms</li>
          </ul>
        </div>

        <div className="amenity-card">
          <h3>🏢 Infrastructure</h3>
          <ul>
            <li>5000 sq. ft. Auditorium Hall</li>
            <li>
              Changing rooms with 1000 lockers
              <br />
              <small>(Separate for gents & ladies)</small>
            </li>
          </ul>

          <Link to="/auditorium-booking" className="amenity-book-link">
            Book Auditorium →
          </Link>
        </div>

        <div className="amenity-card">
          <h3>🎠 Kids & Fun</h3>
          <ul>
            <li>Train for small children</li>
            <li>Two bogies</li>
          </ul>
        </div>

        <div className="amenity-card">
          <h3>⚙️ Safety & Operations</h3>
          <ul>
            <li>Accelerator 3 (15 ft & 30 ft)</li>
            <li>100 CCTV Cameras</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

import React, { useState, useEffect } from "react";
import "./LocationPage.css";

import { useDispatch, useSelector } from "react-redux";
import { getUserContactAction } from "../../redux/UserActions";

const LocationPage = () => {
  const dispatch = useDispatch();

  const { list } = useSelector((state) => state.userContact);

  useEffect(() => {
    dispatch(getUserContactAction());
  }, [dispatch]);

  const data = list || {};

  const [from, setFrom] = useState("Kolhapur Airport");

  const destination = "Jaltara Water Park Morale Palus";

  const handleGetDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
      from
    )}&destination=${encodeURIComponent(destination)}`;

    window.open(url, "_blank");
  };

  return (
    <div className="location-page-container">
      <h1 className="location-page-heading">Find Us</h1>

      <div className="location-page-map-section">
        <iframe
          title="Jaltara Parks Location"
          src={`https://www.google.com/maps?q=${encodeURIComponent(
            destination
          )}&output=embed`}
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>

      <div className="location-page-direction-bar">
        <div className="location-page-input-group">
          <label>From</label>
          <select value={from} onChange={(e) => setFrom(e.target.value)}>
            <option>Palus Bus stand</option>
            <option>Sangli Bus Stand</option>
            <option>Kolhapur Airport</option>
          </select>
        </div>

        <div className="location-page-input-group">
          <label>To</label>
          <select value="Jaltara Parks" disabled>
            <option>Jaltara Parks</option>
          </select>
        </div>

        <button
          className="location-page-get-dir-btn"
          onClick={handleGetDirections}
        >
          Get Directions
        </button>
      </div>
    </div>
  );
};

export default LocationPage;

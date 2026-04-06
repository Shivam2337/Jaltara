import React, { useEffect, useState } from "react";
import ridesImg from "../../assets/images/rides.png";
import { useNavigate } from "react-router-dom";
import "./WaterRides.css";
import { useDispatch, useSelector } from "react-redux";
import { getUserRidesAction } from "../../redux/UserActions";
import { toast } from "react-toastify";
import waterParkImg from "../../assets/waterpark.jpg";
const WaterparkRides = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list: publicRides = [], loading = false, error = null } =
    useSelector((s) => s.userRides || {});
  const isLoggedIn =
    useSelector((s) => !!s.userAuth?.token) ||
    !!localStorage.getItem("userAccessToken");
  const [active, setActive] = useState("family");
  useEffect(() => {
    dispatch(getUserRidesAction(active === "thrill"));
  }, [dispatch, active]);
  const sanitize = (u) => (typeof u === "string" ? u.replace(/`/g, "").trim() : u);
  const rides = publicRides;
  const handleBook = () => {
    if (isLoggedIn) {
      navigate("/book");
    } else {
      toast.info("Please login to continue booking");
      navigate("/login");
    }
  };

  const spinnerStyle = {
    width: 34,
    height: 34,
    border: "3px solid #e5e7eb",
    borderTopColor: "#339af0",
    borderRadius: "50%",
    animation: "wrspin 0.8s linear infinite",
  };

  return (
    <div className="water-rides-page-wrapper">
      <style>{`@keyframes wrspin { to { transform: rotate(360deg); } }`}</style>
      <h1>Waterpark Rides</h1>

      <div className="water-rides-page-toggle">
        <div
          className={`water-rides-page-toggle-card ${
            active === "family" ? "active" : ""
          }`}
          onClick={() => setActive("family")}
        >
          Family / Kids
        </div>

        <div
          className={`water-rides-page-toggle-card ${
            active === "thrill" ? "active" : ""
          }`}
          onClick={() => setActive("thrill")}
        >
          High Thrill
        </div>
      </div>

      <h2>
        {active === "family" ? "Family / Kids Rides" : "High Thrill Rides"}
      </h2>
      <br />

      {loading && (
        <div className="water-rides-page-empty" style={{ display: "flex", justifyContent: "center", padding: 24 }}>
          <div style={spinnerStyle} aria-label="Loading rides" />
        </div>
      )}

      {!loading && error && (
        <div className="water-rides-page-empty">
          <img src={waterParkImg} alt="Error" style={{ maxWidth: 280 }} />
          <p>Failed to load rides</p>
        </div>
      )}

      {!loading && !error && (
        <div className="water-rides-page-grid">
          {rides.map((ride, index) => (
            <div className="water-rides-page-card" key={index}>
              <img
                src={sanitize(ride.img) || ridesImg}
                alt={ride.title}
                className="water-rides-page-img"
              />

              <div className="water-rides-page-info">
                <span className="water-rides-page-tag">{ride.tag}</span>
                <h3>{ride.title}</h3>

                <p className="water-rides-page-desc">{ride.description}</p>

                <ul className="water-rides-page-features">
                  {ride.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
          {rides.length === 0 && (
            <div className="water-rides-page-empty">
              <img src={waterParkImg} alt="Empty" style={{ maxWidth: 280 }} />
              <p>No rides available.</p>
            </div>
          )}
        </div>
      )}

      {!loading && !error && rides.length > 0 && (
        <button className="water-rides-page-book-btn" onClick={handleBook}>
          Book Now
        </button>
      )}
    </div>
  );
};

export default WaterparkRides;

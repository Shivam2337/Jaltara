import { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import "./Navbar.css";
import ProfileModal from "../../pages/auth/ProfileModal";

export default function Navbar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="top-navbar">
        {/* LEFT MENU */}
        <ul className="top-navbar-menu top-navbar-menu-left">
          <li className="top-navbar-item dropdown">
            <span className="top-navbar-link dropdown-label-P">
              Packages{" "}
              <span className="top-navbar-arrow dropdown-arrow">▼</span>
            </span>
            <ul className="top-navbar-dropdown dropdown-menu">
              <li className="top-navbar-dropdown-item">
                <Link to="/WaterparkStay" className="top-navbar-link">
                  Waterpark + Stay
                </Link>
              </li>
              <li className="top-navbar-dropdown-item">
                <Link to="/SpecialOffers" className="top-navbar-link">
                  Special offers (Seasonal / Festival / Corporate)
                </Link>
              </li>
              <li className="top-navbar-dropdown-item">
                <Link to="/GroupPackage" className="top-navbar-link">
                  Honeymoon / Family / Group Package
                </Link>
              </li>
            </ul>
          </li>

          <li className="top-navbar-item dropdown">
            <span className="top-navbar-link dropdown-label-K">
              WaterPark{" "}
              <span className="top-navbar-arrow dropdown-arrow">▼</span>
            </span>
            <ul className="top-navbar-dropdown dropdown-menu">
              <li className="top-navbar-dropdown-item">
                <Link to="/WaterRides" className="top-navbar-link">
                  Family / Kids
                </Link>
              </li>
              <li className="top-navbar-dropdown-item">
                <Link to="/RideTiming" className="top-navbar-link">
                  Ride Timing
                </Link>
              </li>
            </ul>
          </li>

          <li className="top-navbar-item">
            <Link to="/resort" className="top-navbar-link">
              Resort
            </Link>
          </li>

          <li className="top-navbar-item">
            <Link to="/gallery" className="top-navbar-link">
              Gallery
            </Link>
          </li>
        </ul>

        {/* CENTER LOGO */}
        <div className="top-navbar-logo">JALTARA</div>

        {/* RIGHT MENU */}
        <ul className="top-navbar-menu top-navbar-menu-right">
          <li className="top-navbar-item">
            <span className="top-navbar-link">Testimonials</span>
          </li>

          <li className="top-navbar-item">
            <Link to="/LocationPage" className="top-navbar-link">
              Location
            </Link>
          </li>

          <li className="top-navbar-item">
            <Link to="/about" className="top-navbar-link">
              About Us
            </Link>
          </li>

          <li className="top-navbar-item">
            <Link to="/contact" className="top-navbar-link">
              Contact Us
            </Link>
          </li>

          {/* <li className="top-navbar-item">
            <Link to="/amenities" className="top-navbar-link">
              Amenities & Facilities
            </Link>
          </li> */}
        </ul>

        {/* PROFILE */}
        {/* 
        <div
          className="top-navbar-profile profile-wrapper"
          onClick={() => setProfileOpen(!profileOpen)}
        >
          <FaUserCircle className="top-navbar-profile-icon profile-icon" />

          <ul
            className="top-navbar-profile-dropdown profile-dropdown"
            style={{ display: profileOpen ? "block" : "none" }}
          >
            <li className="top-navbar-profile-item">
              <span
                className="top-navbar-profile-link dropdown-link"
                onClick={() => {
                  setShowModal(true);
                  setProfileOpen(false);
                }}
              >
                Profile
              </span>
            </li>
            <li className="top-navbar-profile-item">
              <Link to="/login" className="top-navbar-profile-link dropdown-link">
                Login / Register
              </Link>
            </li>
          </ul>
        </div>
        */}
      </div>

      {showModal && <ProfileModal onClose={() => setShowModal(false)} />}
    </>
  );
}

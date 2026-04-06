import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./NavbarSection.css";
import { useState, useEffect } from "react";

import logo from "./../../assets/jaltara-logo.webp";

import { motion } from "framer-motion";
import { nrmlDown, nrmlVisible } from "../../animations/global";

export default function NavbarSection() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);
  const [menuReady, setMenuReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("userAccessToken")
  );

  const toggleOverlay = () => {
    setIsOverlayOpen(!isOverlayOpen);
    setOpenMobileDropdown(null);
  };

  const handleOverlayNav = (callback) => {
    setIsOverlayOpen(false);
    setOpenMobileDropdown(null);
    if (callback) callback();
  };

  const isPackagesActive = location.pathname.startsWith("/packages");

  const isHome = location.pathname === "/";
  const isTestimonialActive =
    location.pathname === "/" && location.hash === "#testimonial";
  useEffect(() => {
    if (isOverlayOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";
    } else {
      document.body.style.overflow = "";
      document.body.style.height = "";
    }
  }, [isOverlayOpen]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("userAccessToken"));
  }, [location.pathname]);

  return (
    <div>
      <nav
        className={`navbar-section-k ${
          scrolled ? "navbar-section-k-scrolled" : ""
        } ${isHome ? "" : "navbar-section-k-bg-white"}`}
      >
        <motion.div
          // {...nrmlVisible(0.5, 0.5)}
          {...nrmlDown(0.5, 10, 0.3)}
          className="navbar-section-k-left"
        >
          {/* <span
            className={`navbar-section-k-logo  ${
              scrolled ? "navbar-section-k-scrolled" : ""
            } ${isHome ? "" : "navbar-section-k-bg-white-logo"} `}
          >
            JALTARA
          </span> */}

          <img className="navbar-section-k-img-logo" src={logo} alt="" />
        </motion.div>

        <ul
          className={`navbar-section-k-center ${
            isHome ? "" : "navbar-section-k-center-gray-bg"
          }`}
        >
          <li className="navbar-section-k-li">
            <NavLink
              to="/"
              className={() =>
                `navbar-section-k-link ${
                  location.pathname === "/" ? "active" : ""
                }`
              }
            >
              Home
            </NavLink>
          </li>

          <motion.div
            className="navbar-section-k-center-rest"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
            onAnimationComplete={() => setMenuReady(true)}
            style={{ overflow: menuReady ? "visible" : "hidden" }}
          >
            {/* rest of your li items */}

            <li className="navbar-section-k-li">
              <div
                className={`navbar-section-k-link ${
                  isPackagesActive ? "active" : ""
                }`}
              >
                Water Park
              </div>

              <ul className="navbar-section-k-dropdown-menu">
                <li
                  className="navbar-section-k-dropdown-menu-link"
                  onClick={() => navigate("/WaterRides")}
                >
                  Family / Kids
                </li>
                <li
                  className="navbar-section-k-dropdown-menu-link"
                  onClick={() => navigate("/RideTiming")}
                >
                  Ride Timing
                </li>
              </ul>
            </li>

            <li className="navbar-section-k-li">
              <NavLink
                to="/resort"
                className={({ isActive }) =>
                  `navbar-section-k-link ${isActive ? "active" : ""}`
                }
              >
                Resort
              </NavLink>
            </li>

            <li className="navbar-section-k-li">
              <div
                className={`navbar-section-k-link ${
                  isPackagesActive ? "active" : ""
                }`}
              >
                Packages
              </div>

              <ul className="navbar-section-k-dropdown-menu">
                <li
                  className="navbar-section-k-dropdown-menu-link"
                  onClick={() => navigate("/WaterparkStay")}
                >
                  Water Park & Stay
                </li>
                <li
                  className="navbar-section-k-dropdown-menu-link"
                  onClick={() => navigate("/SpecialOffers")}
                >
                  Special Offers
                </li>
                <li
                  className="navbar-section-k-dropdown-menu-link"
                  onClick={() => navigate("/GroupPackage")}
                >
                  Group Package
                </li>
              </ul>
            </li>

            <li className="navbar-section-k-li">
              <NavLink
                to="/gallery"
                className={({ isActive }) =>
                  `navbar-section-k-link ${isActive ? "active" : ""}`
                }
              >
                Gallery
              </NavLink>
            </li>

            <li className="navbar-section-k-li">
              <NavLink
                to="/hall"
                className={({ isActive }) =>
                  `navbar-section-k-link ${isActive ? "active" : ""}`
                }
              >
                Hall
              </NavLink>
            </li>

            <li className="navbar-section-k-li">
              <a
                href="#testimonial"
                className={`navbar-section-k-link ${
                  isTestimonialActive ? "active" : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();

                  if (location.pathname !== "/") {
                    navigate("/");
                    setTimeout(() => {
                      document
                        .getElementById("testimonial")
                        ?.scrollIntoView({ behavior: "smooth" });
                      window.history.replaceState(null, "", "#testimonial");
                    }, 100);
                  } else {
                    document
                      .getElementById("testimonial")
                      ?.scrollIntoView({ behavior: "smooth" });
                    window.history.replaceState(null, "", "#testimonial");
                  }
                }}
              >
                Testimonial
              </a>
            </li>

            <li className="navbar-section-k-li">
              <NavLink
                to="/locationPage"
                className={({ isActive }) =>
                  `navbar-section-k-link ${isActive ? "active" : ""}`
                }
              >
                Location
              </NavLink>
            </li>
          </motion.div>
        </ul>

        <div className="navbar-section-k-right">

          {isLoggedIn ? (
            <>
              {/* ✅ CHANGE — added dynamic scroll/page classes to profile icon
                  same pattern as navbar-overlay-menu-btn so color switches
                  white → dark when scrolled or not on homepage             */}
              <motion.span
                {...nrmlDown(0.5, 10, 0.3)}
                className={`material-symbols-rounded navbar-profile-icon ${
                  scrolled ? "navbar-section-k-scrolled" : ""
                } ${isHome ? "" : "navbar-section-k-scrolled"}`}
                onClick={() => navigate("/MyAccount")}
              >
                account_circle
              </motion.span>

              {/* Book Button */}
              <motion.button
                {...nrmlDown(0.5, 10, 0.3)}
                className={`navbar-section-k-login-btn ${
                  isHome ? "" : "navbar-section-k-login-btn-blue"
                }`}
                onClick={() => navigate("/book")}
              >
                Book
              </motion.button>
            </>
          ) : (
            /* Login Button */
            <motion.button
              {...nrmlDown(0.5, 10, 0.3)}
              className={`navbar-section-k-login-btn ${
                isHome ? "" : "navbar-section-k-login-btn-blue"
              }`}
              onClick={() => navigate("/Login")}
            >
              Login
            </motion.button>
          )}

          {/* Menu Icon — always visible */}
          <motion.span
            {...nrmlDown(0.5, 10, 0.3)}
            className={`material-symbols-rounded navbar-overlay-menu-btn ${
              scrolled ? "navbar-section-k-scrolled" : ""
            } ${isHome ? "" : "navbar-section-k-scrolled"}`}
            onClick={toggleOverlay}
          >
            menu
          </motion.span>

        </div>
 
      </nav>

      {isOverlayOpen && (
        <div className="nav-overlay-k">
          <span
            className="material-symbols-rounded nav-overlay-k-close"
            onClick={toggleOverlay}
          >
            close
          </span>

          <ul className="nav-overlay-k-menu">
            {/* HOME */}
            <li>
              <NavLink
                to="/"
                className="nav-overlay-k-link"
                onClick={() => handleOverlayNav()}
              >
                Home
              </NavLink>
            </li>

            {/* WATER PARK TITLE */}
            <div className="nav-overlay-k-sub-ul">
              <li className="nav-overlay-k-heading">Water Park</li>

              <li>
                <div
                  className="nav-overlay-k-sublink"
                  onClick={() =>
                    handleOverlayNav(() => navigate("/WaterRides"))
                  }
                >
                  Family / Kids
                </div>
              </li>

              <li>
                <div
                  className="nav-overlay-k-sublink"
                  onClick={() =>
                    handleOverlayNav(() => navigate("/RideTiming"))
                  }
                >
                  Ride Timing
                </div>
              </li>
            </div>

            {/* RESORT */}
            <li>
              <NavLink
                to="/resort"
                className="nav-overlay-k-link"
                onClick={() => handleOverlayNav()}
              >
                Resort
              </NavLink>
            </li>

            {/* PACKAGES TITLE */}
            <div className="nav-overlay-k-sub-ul">
              <li className="nav-overlay-k-heading">Packages</li>

              <li>
                <div
                  className="nav-overlay-k-sublink"
                  onClick={() =>
                    handleOverlayNav(() => navigate("/WaterparkStay"))
                  }
                >
                  Water Park & Stay
                </div>
              </li>

              <li>
                <div
                  className="nav-overlay-k-sublink"
                  onClick={() =>
                    handleOverlayNav(() => navigate("/SpecialOffers"))
                  }
                >
                  Special Offers
                </div>
              </li>

              <li>
                <div
                  className="nav-overlay-k-sublink"
                  onClick={() =>
                    handleOverlayNav(() => navigate("/GroupPackage"))
                  }
                >
                  Group Package
                </div>
              </li>
            </div>
            {/* GALLERY */}
            <li>
              <NavLink
                to="/gallery"
                className="nav-overlay-k-link"
                onClick={() => handleOverlayNav()}
              >
                Gallery
              </NavLink>
            </li>

            {/* HALL */}
            <li>
              <NavLink
                to="/hall"
                className="nav-overlay-k-link"
                onClick={() => handleOverlayNav()}
              >
                Hall
              </NavLink>
            </li>

            {/* LOCATION */}
            <li>
              <NavLink
                to="/locationPage"
                className="nav-overlay-k-link"
                onClick={() => handleOverlayNav()}
              >
                Location
              </NavLink>
            </li>
            {isLoggedIn ? (
              <li>
                <button
                  className="nav-overlay-k-btn nav-overlay-k-btn-primary"
                  onClick={() => handleOverlayNav(() => navigate("/book"))}
                >
                  Book
                </button>
              </li>
            ) : (
              <li>
                <button
                  className="nav-overlay-k-btn nav-overlay-k-btn-primary"
                  onClick={() => handleOverlayNav(() => navigate("/Login"))}
                >
                  Login
                </button>
              </li>
            )}

            {/* PROFILE — only shown when logged in */}
            {/* {isLoggedIn && (
              <li className="navbar-section-k-li">
                <NavLink
                  to="/MyAccount"
                  className={({ isActive }) =>
                    `navbar-section-k-link ${isActive ? "active" : ""}`
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ display: "block" }}
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                  </svg>
                </NavLink>
              </li>
            )} */}
          </ul>
        </div>
      )}
    </div>
  );
}

import "./FooterSection.css";
import { motion } from "framer-motion";
import { nrmlUp, nrmlVisible } from "../../animations/global";

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUserContactAction } from "../../redux/UserActions";

import logo from "./../../assets/jaltara-logo.webp";
import { Link } from "react-router-dom";

export default function FooterSection() {
  const dispatch = useDispatch();

  const { loading, error, list } = useSelector((state) => state.userContact);

  useEffect(() => {
    dispatch(getUserContactAction());
  }, [dispatch]);

  const data = list || {};
  return (
    <motion.footer
      // {...nrmlVisible(0.1)}

      className="footer-section-k"
    >
      <div className="footer-section-k-container">
        <div className="footer-section-k-brand">
          {/* <h2 className="footer-section-k-logo">JALTARA</h2> */}

          <img src={logo} alt="" className="footer-section-k-img-logo" />
          {/* <p className="footer-section-k-tagline">Splash into joy. Relax in luxury.</p> */}
          <p className="footer-section-k-tagline">
            Experience Fun, Adventure & Relaxation with world-class water rides,
            luxury stays and unforgattable memories.
          </p>
        </div>

        <div className="footer-section-k-links">
          <h3 className="footer-section-k-heading">Quick Links</h3>
          <ul className="footer-section-k-ul">
            <li className="footer-section-k-ul-li">
              <Link className="footer-section-k-a" to="/">
                Home
              </Link>
            </li>

            <li className="footer-section-k-ul-li">
              <Link className="footer-section-k-a" to="/gallery">
                Gallery
              </Link>
            </li>

            <li className="footer-section-k-ul-li">
              <Link className="footer-section-k-a" to="/about">
                About Us
              </Link>
            </li>

            <li className="footer-section-k-ul-li">
              <Link className="footer-section-k-a" to="/contact">
                Contact Us
              </Link>
            </li>

            <li className="footer-section-k-ul-li">
              <Link className="footer-section-k-a" to="/FAQ">
                FAQ
              </Link>
            </li>

            <li className="footer-section-k-ul-li">
              <Link className="footer-section-k-a" to="/termscondition">
                Terms & Conditions
              </Link>
            </li>

            <li className="footer-section-k-ul-li">
              <Link className="footer-section-k-a" to="/privacy">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* <div className="footer-section-k-links">
          <h3 className="footer-section-k-heading">Help & Support</h3>
          <ul className="footer-section-k-ul">
            <li className="footer-section-k-ul-li">
              <a className="footer-section-k-a" href="/about-us">
                About us
              </a>
            </li>
            <li className="footer-section-k-ul-li">
              <a className="footer-section-k-a" href="/contact-us">
                Contact us
              </a>
            </li>

            <li className="footer-section-k-ul-li">
              <a className="footer-section-k-a" href="/events">
                Events
              </a>
            </li>
            <li className="footer-section-k-ul-li">
              <a className="footer-section-k-a" href="/policy">
                Terms and conditions
              </a>
            </li>
          </ul>
        </div> */}

        <div className="footer-section-k-contact">
          <h3 className="footer-section-k-heading">Contact</h3>

          {data && (
            <>
              {data.phone && (
                <a href={`tel:${data.phone}`} className="footer-section-k-contact-p footer-section-k-contact-link">
                  <span className="material-symbols-rounded">call</span>
                  {data.phone}
                </a>
              )}

              {data.email && (
                <a href={`mailto:${data.email}`} className="footer-section-k-contact-p footer-section-k-contact-link">
                  <span className="material-symbols-rounded">mail</span>
                  {data.email}
                </a>
              )}

              {data.address && (
                <p className="footer-section-k-contact-p">
                  <span className="material-symbols-rounded">location_on</span>
                  {data.address}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      <div className="footer-section-k-bottom">
        &copy; {new Date().getFullYear()} JALTARA Water Park & Resort. All
        rights reserved.
      </div>
    </motion.footer>
  );
}

import React from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="bottom-footer">
      <div className="bottom-footer-container">
        {/* Brand */}
        <div className="bottom-footer-col">
          <h3 className="bottom-footer-heading-primary">WaterPark & Resort</h3>
          <p className="bottom-footer-text">
            Experience fun, adventure & relaxation with world-class water rides,
            luxury stays and unforgettable memories.
          </p>
        </div>

        {/* Quick Links */}
        <div className="bottom-footer-col">
          <h4 className="bottom-footer-heading-secondary">Quick Links</h4>
          <ul className="bottom-footer-list">
            <li className="bottom-footer-list-item">
              <a href="/" className="bottom-footer-link">
                Home
              </a>
            </li>
            <li className="bottom-footer-list-item">
              <a href="/gallery" className="bottom-footer-link">
                Gallery
              </a>
            </li>
            <li className="bottom-footer-list-item">
              <a href="/about" className="bottom-footer-link">
                About Us
              </a>
            </li>
            <li className="bottom-footer-list-item">
              <a href="/contact" className="bottom-footer-link">
                Contact Us
              </a>
            </li>
            <li className="bottom-footer-list-item">
              <a href="/faq" className="bottom-footer-link">
                FAQ
              </a>
            </li>
            <li className="bottom-footer-list-item">
              <a href="/TermsCondition" className="bottom-footer-link">
                Terms & Conditions
              </a>
            </li>
            <li className="bottom-footer-list-item">
              <a href="/PrivacyPolicy" className="bottom-footer-link">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="bottom-footer-col">
          <h4 className="bottom-footer-heading-secondary">Contact</h4>

          <p className="bottom-footer-contact">
            <FaPhoneAlt className="bottom-footer-icon" />
            <span className="bottom-footer-contact-text">+91 9767171111</span>
          </p>

          <p className="bottom-footer-contact">
            <FaEnvelope className="bottom-footer-icon" />
            <span className="bottom-footer-contact-text">
              kedarentertainmentpvtltd@gmail.com
            </span>
          </p>

          <p className="bottom-footer-contact">
            <FaMapMarkerAlt className="bottom-footer-icon" />
            <span className="bottom-footer-contact-text">
              GAT NO.273A, AT. Morale, TAL: Palus, Sangli
            </span>
          </p>
        </div>
      </div>

      <div className="bottom-footer-bottom">
        © 2026 WaterPark Resort. All rights reserved.
      </div>
    </footer>
  );
}

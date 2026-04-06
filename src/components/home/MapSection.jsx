import "./MapSection.css";
import { nrmlVisible } from "../../animations/global";
import { motion } from "framer-motion";

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUserContactAction } from "../../redux/UserActions";

export default function MapSection() {
  const dispatch = useDispatch();

  const { loading, error, list } = useSelector((state) => state.userContact);

  useEffect(() => {
    dispatch(getUserContactAction());
  }, [dispatch]);

  const data = list || {};

  console.log("data", data);

  const googleMapsLink = data?.google_map_link;

  return (
    <motion.section {...nrmlVisible(0.1)} className="map-section">
      <div className="map-section-container">
        <div className="map-section-content">
          <span className="material-symbols-rounded map-section-icon">
            location_on
          </span>
          <div>
            <h2 className="map-section-heading">Visit Us</h2>
            <p className="map-section-text">
              We are located near city Kolhapur, Maharashtra. Click below to get
              directions.
            </p>

            {googleMapsLink && (
              <a
                href={googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="map-section-btn"
              >
                Open in Google Maps
              </a>
            )}
          </div>
        </div>

        <div className="map-section-frame-wrapper">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7626.4050453023465!2d74.49087878712072!3d17.111617703347672!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc16b11a8c8386b%3A0xc596c0ea31ef606b!2sJaltara%20Water%20Park%20Morale%20%2CPalus!5e0!3m2!1sen!2sin!4v1773317650540!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            title="Google Map Location"
            className="map-section-iframe"
          ></iframe>
        </div>
      </div>
    </motion.section>
  );
}

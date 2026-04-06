import "./SeasonalOffersSection.css";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { nrmlVisible, nrmlUp } from "../../animations/global";
import holiImg from "../../assets/home/SeasonalOffers/holi-splash-festival.webp";
import resortImg from "../../assets/resort.jpg";
import { getUserPackagesAction } from "../../redux/UserActions";
import { useNavigate } from "react-router-dom";

export default function SeasonalOffersSection() {
  const dispatch = useDispatch();
  const { list: packages = [], loading, error } =
    useSelector((s) => s.userPackages) || {};
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getUserPackagesAction());
  }, [dispatch]);

  const sanitize = (u) => (typeof u === "string" ? u.replace(/`/g, "").trim() : u);

  const goToDetails = (pkg) => {
    const t = pkg?.package_type;
    let path = "/SpecialOffers";
    if (t === "combo") path = "/WaterparkStay";
    else if (t === "group_package") path = "/GroupPackage";
    else if (t === "special_offers") path = "/SpecialOffers";
    navigate(path, { state: { package: pkg } });
  };

  return (
    <section className="s-offers-section">
      <style>{`@keyframes sospin { to { transform: rotate(360deg); } }`}</style>
      <div className="s-offers-section-heading-box">
        <motion.h4 {...nrmlUp(0.2)} className="s-offers-section-sub-heading">
          Exclusive Deals
        </motion.h4>
        <motion.h2 {...nrmlUp(0.3)} className="s-offers-section-heading">
          Limited Time Experiences
        </motion.h2>
      </div>

      {loading && (
        <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
          <div
            aria-label="Loading packages"
            style={{
              width: 34,
              height: 34,
              border: "3px solid #e5e7eb",
              borderTopColor: "#339af0",
              borderRadius: "50%",
              animation: "sospin 0.8s linear infinite",
            }}
          />
        </div>
      )}

      {!loading && error && (
        <div style={{ textAlign: "center", padding: 24 }}>
          <img
            src={resortImg}
            alt="Error"
            style={{ maxWidth: 320, width: "90%", borderRadius: 8 }}
          />
          <p style={{ marginTop: 12, color: "#64748b" }}>Failed to load offers</p>
        </div>
      )}

      {!loading && !error && packages.length === 0 && (
        <div style={{ textAlign: "center", padding: 24 }}>
          <img
            src={resortImg}
            alt="No offers"
            style={{ maxWidth: 320, width: "90%", borderRadius: 8 }}
          />
          <p style={{ marginTop: 12, color: "#64748b" }}>No offers available</p>
        </div>
      )}

      {!loading && !error && packages.length > 0 && (
      <div className="s-offers-section-grid">
        {packages.map((pkg, i) => {
          const pricing = pkg.pricings?.[0];

          return (
            <motion.div
              {...nrmlVisible(0.1 * i)}
              // {...nrmlVisible((i % 3) * 0.1 + 0.2)}
              className={`s-offers-section-card ${
                pkg.package_type === "special_offers"
                  ? "s-offers-card-special"
                  : ""
              }`}
              key={pkg.id}
            >
              <div className="s-offers-card-img-box">
                <img
                  className="s-offers-card-img"
                  src={
                    sanitize((pkg.images || []).find((im) => im?.is_primary)?.image) ||
                    sanitize(pkg.image) ||
                    holiImg
                  }
                  alt={pkg.name}
                />
                {/* <span className="s-offers-card-badge">{pkg.badge}</span> */}
                {pkg.package_type === "special_offers" && (
                  <span className="s-offers-card-badge">Special Offers</span>
                )}
              </div>

              <div className="s-offers-card-content">
                <h3 className="s-offers-card-heading">{pkg.name}</h3>

                <p className="s-offers-card-sub-heading">{pkg.description}</p>

                <div className="s-offers-card-meta">
                  <span>⏳ {pkg.duration_hours} Hours</span>
                  <span>
                    👨‍👩‍👧 {pkg.included_adults ?? 0} Adults +{" "}
                    {pkg.included_children ?? 0} Kids
                  </span>
                </div>

                <div className="s-offers-card-btn-price-box">
                  <div className="s-offers-card-price-box">
                    <span className="s-offers-card-price">
                      ₹{pricing?.base_price || 0}
                    </span>
                    {/* <span className="s-offers-card-price-old">
                      ₹{pricing?.extra_adult_price || 0}
                    </span> */}
                  </div>

                  <button
                    className="s-offers-card-btn"
                    onClick={() => goToDetails(pkg)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      )}
    </section>
  );
}

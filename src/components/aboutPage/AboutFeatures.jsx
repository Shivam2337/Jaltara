import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserAboutAction } from "../../redux/UserActions";
import "./AboutFeatures.css";

export default function AboutFeatures() {
  const dispatch = useDispatch();
  const { data: aboutData, loading, error } = useSelector((state) => state.userAbout);

  useEffect(() => {
    dispatch(getUserAboutAction());
  }, [dispatch]);

  if (loading) {
    return (
      <section className="about-page-features">
        <h2 className="about-page-features-heading">Why Visit Jaltara Parks ?</h2>
        <div className="about-page-features-grid">
          <p style={{ textAlign: "center", width: "100%" }}>Loading features...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="about-page-features">
        <h2 className="about-page-features-heading">Why Visit Jaltara Parks ?</h2>
        <div className="about-page-features-grid">
          <p style={{ textAlign: "center", width: "100%" }}>Failed to load features</p>
        </div>
      </section>
    );
  }

  const cards = aboutData?.cards || [];

  if (!cards || cards.length === 0) {
    return (
      <section className="about-page-features">
        <h2 className="about-page-features-heading">Why Visit Jaltara Parks ?</h2>
        <div className="about-page-features-grid">
          <p style={{ textAlign: "center", width: "100%" }}>No features available</p>
        </div>
      </section>
    );
  }

  return (
    <section className="about-page-features">
      <h2 className="about-page-features-heading">Why Visit Jaltara Parks ?</h2>

      <div className="about-page-features-grid">
        {cards.map((card, index) => (
          <div key={card.id || index} className="about-page-feature-card">
            <div className="about-page-feature-card-img-wrapper">
              <img
                className="about-page-feature-card-img"
                src={card.image}
                alt={card.title}
              />
            </div>

            {/* {card.title === "Delicious Food" && (
              <div className="about-page-feature-card-tags">
                <span className="about-page-food-tag veg">Pure-Veg</span>
                <span className="about-page-food-tag nonveg">Non-Veg</span>
              </div>
            )} */}

            <div className="about-page-feature-card-content">
              <h3 className="about-page-feature-card-heading">{card.title}</h3>
              <p className="about-page-feature-card-text">{card.header}</p>

              <ul className="about-page-feature-card-list">
                {card.features &&
                  card.features.map((feature, idx) => (
                    <li key={feature.id || idx} className="about-page-feature-card-list-li">
                      <span className="material-symbols-rounded about-page-feature-card-list-li-icon">
                        {feature.icon || "check_circle"}
                      </span>
                      {feature.title}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

import React from "react";
import "./AboutHero.css";
export default function AboutHero({ title, description }) {
  return (
    <section className="about-page-heading-box">
      <h1 className="about-page-heading">{title || "About Jaltara Parks and Resorts"}</h1>

      <p className="about-page-sub-heading">
        {description || "A destination where fun, adventure and relaxation come together."}
      </p>
    </section>
  );
}

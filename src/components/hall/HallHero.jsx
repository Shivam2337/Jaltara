import React from "react";
import "./HallHero.css";

export default function HallHero({ title, tagline, loading, error }) {
  if (loading) {
    return (
      <section className="hall-hero">
        <h1 className="hall-hero-title">Royal Auditorium Hall</h1>
        <p className="hall-hero-tagline">Loading hall information…</p>
      </section>
    );
  }
  if (error) {
    return (
      <section className="hall-hero">
        <h1 className="hall-hero-title">Royal Auditorium Hall</h1>
        <p className="hall-hero-tagline">Failed to load hall information</p>
      </section>
    );
  }

  return (
    <section className="hall-hero">
      <h1 className="hall-hero-title">
        {title || "Royal Auditorium Hall"}
      </h1>
      <p className="hall-hero-tagline">
        {tagline || "Perfect venue for weddings and events"}
      </p>
    </section>
  );
}

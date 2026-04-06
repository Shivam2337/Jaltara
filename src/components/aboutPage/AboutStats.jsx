import React, { useEffect, useRef, useState } from "react";

import "./AboutStats.css";

export default function AboutStats({ aboutData }) {
  const sectionRef = useRef(null);
  const [start, setStart] = useState(false);

  const [rides, setRides] = useState(0);
  const [visitors, setVisitors] = useState(0);
  const [rooms, setRooms] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStart(true);
      },
      { threshold: 0.4 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!start) return;

    const ridesTarget = aboutData?.rides_count || 20;
    const visitorsTarget = aboutData?.users_count || 13;
    const roomsTarget = aboutData?.rooms_count || 26;

    let r = 0;
    let v = 0;
    let rm = 0;

    const interval = setInterval(() => {
      if (r < ridesTarget) setRides(++r);
      if (v < visitorsTarget) setVisitors(++v);
      if (rm < roomsTarget) setRooms(++rm);

      if (r === ridesTarget && v === visitorsTarget && rm === roomsTarget)
        clearInterval(interval);
    }, 80);

    return () => clearInterval(interval);
  }, [start, aboutData]);

  const avgRating = aboutData?.avg_rating || 4.8;

  return (
    <>
      <section className="about-page-stats" ref={sectionRef}>
        <div className="about-page-stat">
          <h3 className="about-page-stat-heading">{rides}+</h3>
          <p className="about-page-stat-text">Water Attractions</p>
        </div>

        <div className="about-page-stat">
          <h3 className="about-page-stat-heading">{visitors}+</h3>
          <p className="about-page-stat-text">Happy Visitors</p>
        </div>

        <div className="about-page-stat">
          <h3 className="about-page-stat-heading">{rooms}+</h3>
          <p className="about-page-stat-text">Luxury Rooms</p>
        </div>

        <div className="about-page-stat">
          <h3 className="about-page-stat-heading">{avgRating}★</h3>
          <p className="about-page-stat-text">Customer Experience</p>
        </div>
      </section>
    </>
  );
}

import herobg from "./../../assets/home/heroSection/bg-15.webp";
import { useState } from "react";

import "./HeroSection.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function HeroSection() {
  const navigate = useNavigate();
  const handleBook = () => {
    const logged = !!localStorage.getItem("userAccessToken");
    if (logged) {
      navigate("/book");
    } else {
      toast.info("Please login to continue booking");
      navigate("/Login");
    }
  };
  return (
    <section className="hero-section">
      <img src={herobg} alt="Water Park" className="hero-section-bg" />

      <h1 className="hero-section-heading">Jaltara</h1>

      <div className="hero-section-book-div">
        <p className="hero-section-book-text">
          Book Water park, Resort, Holiday Packages Now!
        </p>
        <button
          className="hero-section-book-btn"
         onClick={handleBook}
          >
            
      
       Book
        </button>
      </div>
    </section>
  );
}

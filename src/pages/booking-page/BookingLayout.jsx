import { Outlet } from "react-router-dom";
import "./BookingLayout.css";
import { useEffect } from "react";

export default function BookingLayout() {
  useEffect(() => {
    document.body.classList.add("home-gradient-bg");

    return () => {
      document.body.classList.remove("home-gradient-bg");
    };
  }, []);

  return (
    <div className="booking-page-layout">
      <div className="booking-content">
        <Outlet />
      </div>
    </div>
  );
}

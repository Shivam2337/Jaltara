import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
// import Navbar from "../components/layout/Navbar";
import Register from "../pages/auth/Register";
import TicketPayment from "../pages/auth/TicketPayment";
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import AboutUs from "../pages/about/AboutUs";
import TermsCondition from "../pages/about/TermsCondition";
import ContactUs from "../pages/contact/ContactUs";
import Gallery from "../pages/gallery/Gallery";
import HallInfo from "../pages/hall/HallInfo";
import Footer from "../components/layout/Footer";
import RideTiming from "../pages/rides/RideTiming";
import WaterRides from "../pages/rides/WaterRides";
import LocationPage from "../pages/auth/LocationPage";
import Resort from "../pages/resort/Resort";

import WaterparkStay from "../pages/Packages/Offers/WaterparkStay";
import SpecialOffers from "../pages/Packages/Offers/SpecialOffers";
import GroupPackage from "../pages/Packages/Offers/GroupPackage";

// import TicketCard from "../pages/auth/TicketCard";
import MyAccount from "../pages/auth/MyAccount";
import Faq from "../pages/faq/Faq";
import AmenitiesFacilities from "../pages/amenities/AmenitiesFacilities";
import AuditoriumBooking from "../pages/resort/AuditoriumBooking";
import BookingResort from "../pages/resort/BookingResort";
import AdminRoutes from "./AdminRoutes";

import HomePage from "./../pages/home/HomePage";
import NavbarSection from "./../components/layout/NavbarSection";
import FooterSection from "./../components/layout/FooterSection";

import BookingCreate from "../pages/booking/BookingCreate";
import ScrollToTop from "../utils/ScrollToTop";

import BookingLayout from "../pages/booking-page/BookingLayout";
import BookingStep1 from "../pages/booking-page/BookingStep1";
import BookingStep2 from "../pages/booking-page/BookingStep2";
import BookingStep3 from "../pages/booking-page/BookingStep3";
import PrivacyPolicy from "../pages/about/PrivacyPage";
import Hallbookingcreate from "../pages/hall/Hallbookingcreate";

export default function AppRoutes() {
  const location = useLocation();

  // Check if admin route
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {/* NAVBAR ALWAYS VISIBLE */}
      {/* <Navbar /> */}
      <ScrollToTop />
      <NavbarSection />

      <Routes>
        <Route path="/book" element={<BookingLayout />}>
          <Route index element={<BookingStep1 />} />
          <Route path="packages" element={<BookingStep2 />} />
          <Route path="summary" element={<BookingStep3 />} />
        </Route>

        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/TicketPayment" element={<TicketPayment />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/hall" element={<HallInfo />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/termscondition" element={<TermsCondition />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/locationpage" element={<LocationPage />} />
        <Route path="/ridetiming" element={<RideTiming />} />
        <Route path="/waterrides" element={<WaterRides />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/resort" element={<Resort />} />
        <Route path="/WaterparkStay" element={<WaterparkStay />} />
        <Route path="/SpecialOffers" element={<SpecialOffers />} />
        <Route path="/GroupPackage" element={<GroupPackage />} />
        {/* <Route path="/TicketCard" element={<TicketCard />} /> */}
        <Route path="/MyAccount" element={<MyAccount />} />
        <Route path="/FAQ" element={<Faq />} />
        <Route path="/amenities" element={<AmenitiesFacilities />} />
        <Route path="/auditorium-booking" element={<AuditoriumBooking />} />
        <Route path="/BookingResort" element={<BookingResort />} />
        <Route path="/BookingCreate" element={<BookingCreate />} />
        <Route path="/Hallbookingcreate" element={<Hallbookingcreate />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>

      {/* SHOW NAVBAR ONLY FOR USER */}
      {!isAdminRoute && <FooterSection />}
    </>
  );
}

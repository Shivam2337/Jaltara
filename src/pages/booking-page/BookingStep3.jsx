import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BookingSummaryCard from "../../components/book-page/step-3/BookingSummaryCard";
import "../booking-page/BookingStep2.css";

export default function BookingStep3() {
  const navigate = useNavigate();
  const booking = useSelector((s) => s.booking);
  const hasTickets =
    Array.isArray(booking?.selectedTickets) &&
    booking.selectedTickets.some(
      (t) => (t?.counts?.adult || 0) + (t?.counts?.child || 0) + (t?.counts?.senior || 0) > 0
    );
  const hasResortOrVip = ["resort", "vip"].includes(booking?.package?.category);
  const isResort = booking?.package?.category === "resort";
  const hasProduct = hasTickets || hasResortOrVip;
  const hasAddons = (booking?.addons || []).some((a) => (a.count || 0) > 0);
  return (
    <div className="booking-s2-container">
      <div className="s2-header">
        <div className="s2-stepper">
          <div className={`s2-step ${hasProduct ? "done" : ""}`} onClick={() => navigate("/book/packages?tab=tickets")}>
            <span className="material-symbols-rounded s2-step-ico">confirmation_number</span>
            Tickets
          </div>
          {!isResort && (
            <div className={`s2-step ${hasAddons ? "done" : ""}`} onClick={() => navigate("/book/packages?tab=addons")}>
              <span className="material-symbols-rounded s2-step-ico">add_circle</span>
              Add-ons
            </div>
          )}
          <div className="s2-step active">
            <span className="material-symbols-rounded s2-step-ico">receipt_long</span>
            Summary
          </div>
        </div>
      </div>
      <div className="s2-tabs-divider" />
      <div className="booking-s3-center">
        <BookingSummaryCard />
      </div>
    </div>
  );
}

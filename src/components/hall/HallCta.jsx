import { Link } from "react-router-dom";
import "./HallCta.css";

export default function HallCta({ hallData }) {
  const sanitize = (u) =>
    typeof u === "string" ? u.replace(/`/g, "").trim() : u;
  const tel = sanitize(hallData?.phone_number) || "";
  const mail = sanitize(hallData?.email) || "";
  return (
    <section className="hall-cta">
      <h2 className="hall-cta-heading">Ready to Book?</h2>
      <p className="hall-cta-text">
        Contact us today to reserve the Perfect venue for your event.
      </p>

      <div className="hall-cta-buttons">
        <a
          href={tel ? `tel:${tel}` : undefined}
          className="hall-cta-btn hall-cta-btn-primary"
        >
          Call Now
        </a>
<a href={mail ? `mailto:${mail}` : undefined} className="hall-cta-btn hall-cta-btn-secondary">
          Email Us
        </a>

        {/* <Link to="/book" className="hall-cta-btn hall-cta-btn-secondary">
          Book Now
        </Link> */}
      </div>
    </section>
  );
}

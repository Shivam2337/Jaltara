import { Link } from "react-router-dom";
import "./AboutCta.css";

export default function AboutCta() {
  return (
    <section className="about-page-cta">
      <h2 className="about-page-cta-heading">Ready for the Adventure?</h2>
      <p className="about-page-cta-text">
        Book your waterpark and resort experience today.
      </p>

      <Link to="/book" className="about-page-cta-btn">
        Book Now
      </Link>
    </section>
  );
}

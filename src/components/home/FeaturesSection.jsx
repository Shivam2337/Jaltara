import "./FeaturesSection.css";

import wpBG from "./../../assets/home/features/wp-bg-2.png";
import resortBG from "./../../assets/home/features/resort-bg-1.png";

export default function FeaturesSection() {
  return (
    <section className="features-section">
      <h2 className="features-section-heading">
        Experience the Best of JALTARA
      </h2>

      <div className="features-section-container">
        <div className="features-section-wp-div">
          <img className="features-section-wp-img" src={wpBG} alt="" />
          <h2 className="features-section-wp-heading">Water Park</h2>

          <div className="features-section-wp-points">
            <h3 className="features-section-wp-points-heading">
              Enjoy with family
            </h3>

            <ul className="features-section-wp-points-ul">
              <li className="features-section-wp-points-li">
                <span className="material-symbols-rounded features-section-li-icon">
                  check
                </span>
                <span className="features-section-point">
                  Playstation 7 ride combo
                </span>
              </li>
              <li className="features-section-wp-points-li">
                <span className="material-symbols-rounded features-section-li-icon">
                  check
                </span>
                <span className="features-section-point">
                  Free fall sofa landing 45 feet
                </span>
              </li>
              <li className="features-section-wp-points-li">
                <span className="material-symbols-rounded features-section-li-icon">
                  check
                </span>
                <span className="features-section-point">
                  Pendulum slide 30 feet
                </span>
              </li>
              <li className="features-section-wp-points-li">
                <span className="material-symbols-rounded features-section-li-icon">
                  check
                </span>
                <span className="features-section-point">
                  Lazy river of 1000 feet
                </span>
              </li>
              <li className="features-section-wp-points-li">
                <span className="material-symbols-rounded features-section-li-icon">
                  check
                </span>
                <span className="features-section-point">
                  Umbrella rain dance
                </span>
              </li>
              <li className="features-section-wp-points-li">
                <span className="material-symbols-rounded features-section-li-icon">
                  check
                </span>
                <span className="features-section-point">
                  Crazy river of 15 feet height flow
                </span>
              </li>
            </ul>

            <div className="features-section-wp-buttons">
              <button className="features-section-btn features-section-btn-outline">
                Explore More
              </button>
              <button className="features-section-btn features-section-btn-solid">
                Buy Tickets
              </button>
            </div>
          </div>
        </div>

        <div className="features-section-resort-div">
          <img className="features-section-resort-img" src={resortBG} alt="" />
          <h2 className="features-section-resort-heading">Resort</h2>

          <div className="features-section-resort-points">
            <h3 className="features-section-resort-points-heading">
              Luxury & Relaxation
            </h3>

            <ul className="features-section-resort-points-ul">
              <li className="features-section-resort-points-li">
                <span className="material-symbols-rounded features-section-li-icon">
                  check
                </span>
                <span className="features-section-point">Premium AC Rooms</span>
              </li>
              <li className="features-section-resort-points-li">
                <span className="material-symbols-rounded features-section-li-icon">
                  check
                </span>
                <span className="features-section-point">
                  Private Pool Access
                </span>
              </li>
              <li className="features-section-resort-points-li">
                <span className="material-symbols-rounded features-section-li-icon">
                  check
                </span>
                <span className="features-section-point">
                  Multi Cuisine Restaurant
                </span>
              </li>
              <li className="features-section-resort-points-li">
                <span className="material-symbols-rounded features-section-li-icon">
                  check
                </span>
                <span className="features-section-point">
                  Evening Live Music Lounge
                </span>
              </li>
              <li className="features-section-resort-points-li">
                <span className="material-symbols-rounded features-section-li-icon">
                  check
                </span>
                <span className="features-section-point">Infinity Pool</span>
              </li>
              <li className="features-section-resort-points-li">
                <span className="material-symbols-rounded features-section-li-icon">
                  check
                </span>
                <span className="features-section-point">
                  Spa & Wellness Center
                </span>
              </li>
            </ul>

            <div className="features-section-resort-buttons">
              <button className="features-section-btn features-section-btn-outline">
                Explore More
              </button>
              <button className="features-section-btn features-section-btn-solid">
                Buy Tickets
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

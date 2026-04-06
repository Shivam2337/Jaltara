import { useEffect, useRef, useState } from "react";
import "./AmenitiesSlider.css";

import { useDispatch, useSelector } from "react-redux";
import { getUserAmenitiesAction } from "../../redux/UserActions";

export default function AmenitiesSlider() {

  const dispatch = useDispatch();

  const { list: amenitiesData, loading, error } = useSelector((state) => state.userAmenities || { list: [] });

  /* ---------------- MAP API DATA ---------------- */

  const sanitize = (u) => (typeof u === "string" ? u.replace(/`/g, "").trim() : u);
  const amenities =
    Array.isArray(amenitiesData)
      ? amenitiesData.map((a) => ({
          img: sanitize(a.image),
          title: a.name,
          desc: a.description || "",
        }))
      : [];

  const thumbsRef = useRef([]);

  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(false);

  const intervalRef = useRef(null);

  /* ---------------- AUTO SLIDER ---------------- */

  const startSlider = () => {
    intervalRef.current = setInterval(() => {
      setFade(true);

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % amenities.length);
        setFade(false);
      }, 200);
    }, 6000);
  };

  useEffect(() => {
    if (!amenities || amenities.length === 0) return;
    startSlider();
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amenities.length]);

  /* ---------------- API CALL ---------------- */

  useEffect(() => {
    dispatch(getUserAmenitiesAction());
  }, [dispatch]);

  const handleThumbClick = (i) => {
    clearInterval(intervalRef.current);

    setFade(true);

    setTimeout(() => {
      setIndex(i);
      setFade(false);
    }, 200);

    startSlider();
  };

  /* ---------------- THUMB SCROLL ---------------- */

  useEffect(() => {
    const el = thumbsRef.current[index];
    if (!el) return;

    const container = el.parentElement;

    const elLeft = el.offsetLeft;
    const elWidth = el.offsetWidth;

    const containerWidth = container.offsetWidth;

    container.scrollTo({
      left: elLeft - containerWidth / 2 + elWidth / 2,
      behavior: "smooth",
    });
  }, [index]);

  if (loading) {
    return (
      <section className="amenities-slider-section">
        <div className="amenities-slider-section-heading-box">
          <h4 className="amenities-slider-section-sub-heading">
            Amenities & Facilities
          </h4>
          <h2 className="amenities-slider-section-heading">
            Everything You Need for <span className="amenities-slider-section-heading-break">a</span> Perfect Day
          </h2>
        </div>
        <div className="amenities-slider-empty">Loading amenities...</div>
      </section>
    );
  }

  if (!loading && error) {
    return (
      <section className="amenities-slider-section">
        <div className="amenities-slider-section-heading-box">
          <h4 className="amenities-slider-section-sub-heading">
            Amenities & Facilities
          </h4>
          <h2 className="amenities-slider-section-heading">
            Everything You Need for <span className="amenities-slider-section-heading-break">a</span> Perfect Day
          </h2>
        </div>
        <div className="amenities-slider-empty">No amenities available</div>
      </section>
    );
  }

  if (!amenities.length)
    return (
      <section className="amenities-slider-section">
        <div className="amenities-slider-section-heading-box">
          <h4 className="amenities-slider-section-sub-heading">
            Amenities & Facilities
          </h4>
          <h2 className="amenities-slider-section-heading">
            Everything You Need for{" "}
            <span className="amenities-slider-section-heading-break">a</span>{" "}
            Perfect Day
          </h2>
        </div>
        <div className="amenities-slider-empty">No amenities available</div>
      </section>
    );

  return (
    <section className="amenities-slider-section">
      <div className="amenities-slider-section-heading-box">
        <h4 className="amenities-slider-section-sub-heading">
          Amenities & Facilities
        </h4>

        <h2 className="amenities-slider-section-heading">
          Everything You Need for{" "}
          <span className="amenities-slider-section-heading-break">a</span>{" "}
          Perfect Day
        </h2>
      </div>

      <div className="amenities-slider-main">
        <img
          src={amenities[index].img}
          alt={amenities[index].title}
          className={`amenities-slider-image ${
            fade ? "fade-out" : "fade-in"
          }`}
        />

        <div className="amenities-slider-overlay">
          <h3 className="amenities-slider-overlay-heading">
            {amenities[index].title}
          </h3>

          <p className="amenities-slider-overlay-desc">
            {amenities[index].desc}
          </p>
        </div>
      </div>

      <div className="amenities-slider-dots">
        {amenities.map((_, i) => (
          <span
            key={i}
            className={`amenities-slider-dot ${
              i === index ? "active" : ""
            }`}
            onClick={() => handleThumbClick(i)}
          ></span>
        ))}
      </div>
    </section>
  );
}

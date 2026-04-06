import "./AmenitiesSection.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { nrmlVisible, nrmlUp } from "./../../animations/global";
import { getUserAmenitiesAction } from "../../redux/UserActions";
import { useNavigate } from "react-router-dom";
export default function AmenitiesSection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list = [], loading, error } = useSelector((s) => s.userAmenities || {});
  useEffect(() => {
    dispatch(getUserAmenitiesAction());
  }, [dispatch]);
  const sanitize = (u) => (typeof u === "string" ? u.replace(/`/g, "").trim() : u);
  return (
    <section className="amenities-section">
      <div className="amenities-section-container">
        <div className="amenities-section-grid">
          <div className="amenities-section-heading-box">
            <motion.h2 {...nrmlVisible(0.1)} className="amenities-section-heading">
              Our Amenities for your convenience and comfort
            </motion.h2>



            <motion.button {...nrmlUp(0.2)} className="amenities-section-btn amenities-section-secondary-btn"
              onClick={() => (navigate("/hall"))}>

              Explore
            </motion.button>

          </div>

          {loading && (
            <div className="amenities-section-empty">
              Loading amenities...
            </div>
          )}

          {!loading && error && (
            <div className="amenities-section-empty">No amenities available</div>
          )}

          {(!Array.isArray(list) || list.length === 0) && (
            <div className="amenities-section-empty">No amenities available</div>
          )}

          {list.map((item, idx) => (
            <motion.div
              key={item.id ?? idx}
              {...nrmlVisible(0.2 + idx * 0.1)}
              className={`amenities-section-card amenities-section-card-${(idx % 4) + 1}`}
            >
              <div className="amenities-section-img-wrapper">
                <img src={sanitize(item.image)} alt={item.name || "Amenity"} className="amenities-section-img" />
              </div>
              <h3 className="amenities-section-title">{item.name || "Amenity"}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

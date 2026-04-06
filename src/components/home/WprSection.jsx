import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import wp_1 from "./../../assets/home/wpr/wp/wp-home-15.webp";
import wp_2 from "./../../assets/home/wpr/wp/wp-home-8.webp";

import r_1 from "./../../assets/home/wpr/r/r-home-7.webp";
import r_2 from "./../../assets/home/wpr/r/r-home-2.webp";

import waterpark from "../../assets/waterpark.jpg";
import "./WprSection.css";
import waterParkImg from "../../assets/waterpark.jpg";
import resortImg from "../../assets/resort.jpg";
import { motion, useScroll, useTransform } from "framer-motion";

import { nrmlVisible, nrmlUp } from "./../../animations/global";
import { getWprSectionsAction } from "../../redux/UserActions";
import { Link } from "react-router-dom";

export default function WprSection() {
  const [activeSection, setActiveSection] = useState("waterpark");
  const dispatch = useDispatch();
  const { data: wpr, loading, error } =
    useSelector((s) => s.userWprSections) || {};

  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [300, -300]);
  useEffect(() => {
    dispatch(getWprSectionsAction());
  }, [dispatch]);
  const wpSec = wpr?.water_park || null;
  const rSec = wpr?.resort || null;
  const wpHeading = wpSec?.section_heading || "";
  const wpText =
    wpSec?.section_text ||
    "";
  const wpContact = wpSec?.contact_no || "";
  const wpImg1 = wpSec?.background_image || wp_1;
  const wpImg2 = wpSec?.front_image || wp_2;
  const rHeading = rSec?.section_heading || "";
  const rText =
    rSec?.section_text ||
    "";
  const rContact = rSec?.contact_no || "";
  const rImg1 = rSec?.background_image || r_1;
  const rImg2 = rSec?.front_image || r_2;

  if (loading) {
    return (
      <section id="wpr" className="wpr-section" ref={ref}>
        <style>{`@keyframes wpspin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
          <div
            aria-label="Loading content"
            style={{
              width: 34,
              height: 34,
              border: "3px solid #e5e7eb",
              borderTopColor: "#339af0",
              borderRadius: "50%",
              animation: "wpspin 0.8s linear infinite",
            }}
          />
        </div>
      </section>
    );
  }

  if (!loading && error) {
    return (
      <section id="wpr" className="wpr-section" ref={ref}>
        <div style={{ textAlign: "center", padding: 24 }}>
          <img
            src={waterParkImg}
            alt="Error"
            style={{ maxWidth: 320, width: "90%", borderRadius: 8 }}
          />
          <p style={{ marginTop: 12, color: "#64748b" }}>No content available</p>
        </div>
      </section>
    );
  }

  if (!loading && !error && !wpr) {
    return (
      <section id="wpr" className="wpr-section" ref={ref}>
        <div style={{ textAlign: "center", padding: 24 }}>
          <img
            src={waterParkImg}
            alt="Empty"
            style={{ maxWidth: 320, width: "90%", borderRadius: 8 }}
          />
          <p style={{ marginTop: 12, color: "#64748b" }}>No content available</p>
        </div>
      </section>
    );
  }

  return (
    <section id="wpr" className="wpr-section" ref={ref}>
      {/* change 1 */}

      <motion.div {...nrmlUp(0.1)} className="wpr-toggle-pill">
        <div
          className={`wpr-toggle-slider ${activeSection === "resort" ? "right" : ""
            }`}
        ></div>

        <a
          href="#wpr"
          className={`wpr-toggle-item ${activeSection === "waterpark" ? "active" : ""
            }`}
          onClick={() => setActiveSection("waterpark")}
        >
          Water Park
        </a>

        <a
          href="#wpr"
          className={`wpr-toggle-item ${activeSection === "resort" ? "active" : ""
            }`}
          onClick={() => setActiveSection("resort")}
        >
          Resort
        </a>
      </motion.div>

      {/* //////////////////// */}
      {activeSection === "waterpark" && (
        <div className="wpr-wp-div">
          <div className="wpr-wp-data-div">
            <motion.h4 {...nrmlUp(0.1)} className="wpr-wp-data-sub-heading">
              About Water Park
            </motion.h4>
            <motion.h2 {...nrmlUp(0.2)} className="wpr-wp-data-heading">
              {wpHeading}
            </motion.h2>

            <motion.p {...nrmlUp(0.3)} className="wpr-wp-data-text">
              {wpText}
            </motion.p>
            <div className="wpr-wp-data-btn-div">
              <motion.div {...nrmlUp(0.4)}>
                <Link to="/about" className="wpr-wp-data-btn wpr-wp-data-btn-about ">
                  About Water Park
                </Link>
              </motion.div>
              <motion.a
                {...nrmlUp(0.7)}
                className="wpr-wp-data-btn wpr-wp-data-btn-call "
              >
                <span className="material-icons-round wpr-wp-data-btn-icon">
                  call
                </span>
                <span className="wpr-wp-data-btn-text">{wpContact}</span>
              </motion.a>
            </div>
          </div>
          <div className="wpr-wp-img-div">
            <motion.div
              className="wpr-wp-img-inner-div-1"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              viewport={{ once: true, amount: 0.3 }}
              style={{ originX: 1 }}
            >
              <img src={wpImg1} alt="" className="wpr-wp-img-inner-img-1" />

              <motion.div
                className="wpr-overlay-blue"
                initial={{ x: "0%" }}
                whileInView={{ x: "100%" }}
                transition={{ duration: 0.8, delay: 0.8, ease: "easeInOut" }}
                viewport={{ once: true }}
              />
            </motion.div>

            <motion.div
              className="wpr-wp-img-inner-div-2"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              viewport={{ once: true, amount: 0.3 }}
              style={{ originX: 0 }}
            >
              <img src={wpImg2} alt="" className="wpr-wp-img-inner-img-2" />

              <motion.div
                className="wpr-overlay-white"
                initial={{ x: "0%" }}
                whileInView={{ x: "-100%" }}
                transition={{ duration: 0.8, delay: 0.8, ease: "easeInOut" }}
                viewport={{ once: true }}
              />
            </motion.div>

            <div className="wpr-wp-img-div-text-box" style={{ y }}>
              <span className="wpr-wp-img-div-text-started">STARTED IN</span>

              <span className="wpr-wp-img-div-text-date">2026</span>
            </div>
          </div>
        </div>
      )}

      {activeSection === "resort" && (
        <div className="wpr-r-div">
          <div className="wpr-r-img-div">
            <motion.div
              className="wpr-r-img-inner-div-1"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              viewport={{ once: true, amount: 0.3 }}
              style={{ originX: 1 }}
            >
              <img src={r_1} alt="" className="wpr-r-img-inner-img-1" />

              <motion.div
                className="wpr-overlay-blue"
                initial={{ x: "0%" }}
                whileInView={{ x: "100%" }}
                transition={{ duration: 0.8, delay: 0.8, ease: "easeInOut" }}
                viewport={{ once: true }}
              />
            </motion.div>

            <motion.div
              className="wpr-r-img-inner-div-2"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              viewport={{ once: true, amount: 0.3 }}
              style={{ originX: 0 }}
            >
              <img src={r_2} alt="" className="wpr-r-img-inner-img-2" />

              <motion.div
                className="wpr-overlay-white"
                initial={{ x: "0%" }}
                whileInView={{ x: "-100%" }}
                transition={{ duration: 0.8, delay: 0.8, ease: "easeInOut" }}
                viewport={{ once: true }}
              />
            </motion.div>

            <div className="wpr-r-img-div-text-box" style={{ y }}>
              <span className="wpr-r-img-div-text-started">STARTED IN</span>
              <span className="wpr-r-img-div-text-date">2026</span>
            </div>
          </div>
          <div className="wpr-r-data-div">
            <motion.h4 {...nrmlUp(0.1)} className="wpr-r-data-sub-heading">
              About Resort
            </motion.h4>
            <motion.h2 {...nrmlUp(0.2)} className="wpr-r-data-heading">
              {rHeading}
            </motion.h2>

            <motion.p {...nrmlUp(0.3)} className="wpr-r-data-text">
              {rText}
            </motion.p>

            <div className="wpr-r-data-btn-div">
              <motion.div {...nrmlUp(0.4)}>
                <Link to="/about" className="wpr-r-data-btn wpr-r-data-btn-about">
                  About Resort
                </Link>
              </motion.div>
              <motion.a
                {...nrmlUp(0.5)}
                className="wpr-r-data-btn wpr-r-data-btn-call"
              >
                <span className="material-icons-round wpr-r-data-btn-icon">
                  call
                </span>
                <span className="wpr-r-data-btn-text">{rContact}</span>
              </motion.a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

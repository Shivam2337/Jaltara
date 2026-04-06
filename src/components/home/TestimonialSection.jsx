import "./TestimonialSection.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import testImg from "./../../assets/home/testimonial/testimonial-3.webp";
import { motion, useScroll, useTransform } from "framer-motion";
import { nrmlVisible, nrmlUp } from "./../../animations/global";
import { getUserTestimonialsAction } from "../../redux/UserActions";
import img1 from "../../assets/home/testimonial/people/person-2.webp";
export default function TestimonialSection() {
  const dispatch = useDispatch();
  const { list: source = [], loading, error } =
    useSelector((s) => s.userTestimonials) || {};
  const leftColumn = source.filter((_, i) => i % 2 === 0);
  const rightColumn = source.filter((_, i) => i % 2 !== 0);

  useEffect(() => {
    dispatch(getUserTestimonialsAction());
  }, [dispatch]);
  return (
    <div className="testimonial-section" id="testimonial">
      {loading && (
        <div style={{ textAlign: "center", padding: 16, color: "#64748b" }}>
          Loading testimonials...
        </div>
      )}
      {!loading && error && (
        <div style={{ textAlign: "center", padding: 16, color: "#64748b" }}>
                    No testimonials available
        </div>
      )}
      {!loading && !error && source.length === 0 && (
        <div style={{ textAlign: "center", padding: 16, color: "#64748b" }}>
          No testimonials available
        </div>
      )}
      {!loading && !error && source.length > 0 && (
      <div className="testimonial-section-grid">
        <div className="testimonial-section-cards-grid">
          <div className="testimonial-section-grid-column">
            {leftColumn.map((item, i) => (
              <motion.div
                {...nrmlVisible(0.1 * i)}
                key={item.id}
                className="testimonial-section-card"
              >
                <div className="testimonial-section-card-user">
                  <img
                    src={item.profilePhoto || img1}
                    alt={item.name}
                    className="testimonial-section-card-user-img"
                  />
                  <div>
                    <h4 className="testimonial-section-card-user-name">
                      {item.name}
                    </h4>
                    <span className="testimonial-section-card-review-for">
                      {item.reviewFor}
                    </span>
                  </div>
                </div>

                <div className="testimonial-section-card-rating-div">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const fillPercentage =
                      Math.min(Math.max(item.rating - (star - 1), 0), 1) * 100;

                    return (
                      <span
                        key={star}
                        className="testimonial-section-card-star-wrapper-div"
                      >
                        <span className="material-icons-round testimonial-section-card-star-empty-div">
                          star
                        </span>

                        <span
                          className="material-icons-round testimonial-section-card-star-filled-div"
                          style={{ width: `${fillPercentage}%` }}
                        >
                          star
                        </span>
                      </span>
                    );
                  })}

                  <span className="testimonial-section-card-rating-number">
                    {Number.isInteger(item.rating)
                      ? item.rating
                      : item.rating.toFixed(1)}{" "}
                    / 5
                  </span>
                </div>

                <blockquote className="testimonial-section-card-review">
                  “{item.review}”
                </blockquote>
              </motion.div>
            ))}
          </div>

          <div className="testimonial-section-grid-column">
            {rightColumn.map((item, i) => (
              <motion.div
                {...nrmlVisible(0.2 * i)}
                key={item.id}
                className="testimonial-section-card"
              >
                <div className="testimonial-section-card-user">
                  <img
                    src={item.profilePhoto || img1}
                    alt={item.name}
                    className="testimonial-section-card-user-img"
                  />
                  <div>
                    <h4 className="testimonial-section-card-user-name">
                      {item.name}
                    </h4>
                    <span className="testimonial-section-card-review-for">
                      {item.reviewFor}
                    </span>
                  </div>
                </div>

                <div className="testimonial-section-card-rating-div">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const fillPercentage =
                      Math.min(Math.max(item.rating - (star - 1), 0), 1) * 100;

                    return (
                      <span
                        key={star}
                        className="testimonial-section-card-star-wrapper-div"
                      >
                        <span className="material-icons-round testimonial-section-card-star-empty-div">
                          star
                        </span>

                        <span
                          className="material-icons-round testimonial-section-card-star-filled-div"
                          style={{ width: `${fillPercentage}%` }}
                        >
                          star
                        </span>
                      </span>
                    );
                  })}

                  <span className="testimonial-section-card-rating-number">
                    {item.rating} / 5
                  </span>
                </div>

                <blockquote className="testimonial-section-card-review">
                  “{item.review}”
                </blockquote>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="testimonial-section-heading-text-box">
          <motion.h4
            {...nrmlUp(0.1)}
            className="testimonial-section-sub-heading-top"
          >
            Testimonial
          </motion.h4>

          <motion.h2 {...nrmlUp(0.2)} className="testimonial-section-heading">
            Fun They’ll Never Forget!
          </motion.h2>

          <motion.p
            {...nrmlUp(0.3)}
            className="testimonial-section-sub-heading"
          >
            Thousands of smiles. One reason — JALTARA.
          </motion.p>

          {/* <div className="testimonial-section-image-box"> */}
          <motion.blockquote
            {...nrmlUp(0.4)}
            className="testimonial-section-image-box-review"
          >
            “Thrilling rides, clean surroundings, and very friendly staff. The
            lazy river was our favorite!”
            <br />
            <motion.span
              {...nrmlUp(0.5)}
              className="testimonial-section-image-box-review-name"
            >
              - Mrunal Patil
            </motion.span>
          </motion.blockquote>
          <motion.div
            {...nrmlVisible(0.4)}
            className="testimonial-section-image-wrapper"
          >
            <img className="testimonial-section-image" src={testImg} />
          </motion.div>
          {/* </div> */}
        </div>
      </div>
      )}
    </div>
  );
}

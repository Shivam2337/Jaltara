import React, { useEffect, useState } from "react";
import "./SpecialOffers.css";
import stayImg from "../../../assets/images/rides.png";
import room1 from "../../../assets/images/Cottage 1.jpg";
import room2 from "../../../assets/images/Cottage 2.jpg";
import room3 from "../../../assets/images/Cottage 3.jpg";
import { useNavigate } from "react-router-dom";
// import { packages } from "../../../data/Packages";
import { useDispatch, useSelector } from "react-redux";
import { getUserPackagesAction } from "../../../redux/UserActions";
import { toast } from "react-toastify";
import waterParkImg from "../../../assets/waterpark.jpg";
const SpecialOffers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list: userPackages = [], loading, error } =
    useSelector((s) => s.userPackages) || {};
  const isLoggedIn =
    useSelector((s) => !!s.userAuth?.token) ||
    !!localStorage.getItem("userAccessToken");

  const specialPackages = userPackages.filter(
    (p) => p.package_type === "special_offers"
  );

  const [showSlider, setShowSlider] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImages, setSelectedImages] = useState([]);

  const openSlider = (imgs, index) => {
    setSelectedImages(imgs);
    setCurrentIndex(index);
    setShowSlider(true);
  };

  const closeSlider = () => setShowSlider(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % selectedImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + selectedImages.length) % selectedImages.length);
  };

  useEffect(() => {
    dispatch(getUserPackagesAction({ package_type: "special_offers" }));
  }, [dispatch]);

  const handleBook = () => {
    if (isLoggedIn) {
      navigate("/book");
    } else {
      toast.info("Please login to continue booking");
      navigate("/login");
    }
  };

  return (
    <div className="special-offers-page">
      <style>{`@keyframes pkgspin { to { transform: rotate(360deg); } }`}</style>
      {loading && (
        <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
          <div
            aria-label="Loading packages"
            style={{
              width: 36,
              height: 36,
              border: "3px solid #e5e7eb",
              borderTopColor: "#339af0",
              borderRadius: "50%",
              animation: "pkgspin 0.8s linear infinite",
            }}
          />
        </div>
      )}

      {!loading && error && (
        <div style={{ textAlign: "center", padding: 24 }}>
          <img
            src={waterParkImg}
            alt="Error"
            style={{ maxWidth: 320, width: "90%", borderRadius: 8 }}
          />
          <p style={{ marginTop: 12, color: "#64748b" }}>
             No packages available
          </p>
        </div>
      )}

      {!loading && !error && specialPackages.length === 0 && (
        <div style={{ textAlign: "center", padding: 24 }}>
          <img
            src={waterParkImg}
            alt="No packages"
            style={{ maxWidth: 320, width: "90%", borderRadius: 8 }}
          />
          <p style={{ marginTop: 12, color: "#64748b" }}>
            No packages available
          </p>
        </div>
      )}

      {!loading && !error && specialPackages.map((pkg) => {
        const pricing = pkg.pricings?.[0] || null;
        const images = (pkg.images || []).map((img) => img.image);
        const firstImg = images[0] || stayImg;
        return (
          <div className="special-offers-card" key={pkg.id}>
            <div className="special-offers-content">
              <h2>{pkg.name}</h2>
              <span className="special-offers-badge">
                🎉 10% OFF – Limited Time
              </span>

              <p className="special-offers-desc">{pkg.description}</p>
              <div style={{ margin: "10px 0", color: "#334155", fontSize: 14 }}>
                {pkg.duration_hours != null && (
                  <p><strong>Duration:</strong> {pkg.duration_hours} Hours</p>
                )}
                <p><strong>Included Adults:</strong> {pkg.included_adults ?? 0}</p>
                <p><strong>Included Children:</strong> {pkg.included_children ?? 0}</p>
                <p><strong>Included Seniors:</strong> {pkg.included_seniors ?? 0}</p>
              </div>
              <div className="special-offers-price">
                <strong>Price:</strong> ₹{pricing?.base_price || 0}
              </div>

              <button className="special-offers-btn" onClick={handleBook}>
                Book Now
              </button>
            </div>

            <div className="special-offers-image">
              <div className="special-offers-image-wrapper">
                <img
                  src={firstImg}
                  alt="Special Offer"
                  onClick={() => openSlider(images, 0)}
                />

                <div className="special-offers-main-dots">
                  {images.map((_, index) => (
                    <span
                      key={index}
                      className="special-offers-main-dot"
                      onClick={() => openSlider(images, index)}
                    ></span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {showSlider && (
        <div className="special-offers-modal">
          <span className="special-offers-close" onClick={closeSlider}>
            ✖
          </span>

          <button className="special-offers-nav left" onClick={prevImage}>
            ❮
          </button>

          <img
            src={selectedImages[currentIndex]}
            className="special-offers-slider-img"
            alt="slider"
          />

          <button className="special-offers-nav right" onClick={nextImage}>
            ❯
          </button>

          <div className="special-offers-dots">
            {selectedImages.map((_, index) => (
              <span
                key={index}
                className={`special-offers-dot ${
                  index === currentIndex ? "active" : ""
                } `}
                onClick={() => setCurrentIndex(index)}
              ></span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecialOffers;

import React, { useEffect, useState } from "react";
import "./WaterparkStay.css";
import stayImg from "../../../assets/images/room.png";
import room1 from "../../../assets/images/Deluxe 1.jpg";
import room2 from "../../../assets/images/Deluxe 2.jpg";
import room3 from "../../../assets/images/Deluxe 3.jpg";
import { useNavigate } from "react-router-dom";
// import { packages } from "./../../../data/Packages";
import { useDispatch, useSelector } from "react-redux";
import { getUserPackagesAction } from "../../../redux/UserActions";
import { toast } from "react-toastify";
import waterParkImg from "../../../assets/waterpark.jpg";
const WaterparkStay = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list: userPackages = [], loading, error } =
    useSelector((s) => s.userPackages) || {};
  const isLoggedIn =
    useSelector((s) => !!s.userAuth?.token) ||
    !!localStorage.getItem("userAccessToken");

  const [showSlider, setShowSlider] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImages, setSelectedImages] = useState([]);

  const waterparkStays = userPackages.filter((p) => p.package_type === "combo");

  // compute per card
  const handleBook = () => {
    if (isLoggedIn) {
      navigate("/book");
    } else {
      toast.info("Please login to continue booking");
      navigate("/login");
    }
  };

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
    dispatch(getUserPackagesAction({ package_type: "combo" }));
  }, [dispatch]);

  return (
    <div className="waterpark-stay-page">
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

      {!loading && !error && waterparkStays.length === 0 && (
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

      {!loading && !error && waterparkStays.map((pkg) => {
        const pricing = pkg.pricings?.[0] || null;
        const imgs = (pkg.images || []).map((img) => img.image);
        const firstImg = imgs[0] || stayImg;
        return (
          <div className="waterpark-stay-card" key={pkg.id}>
            <div className="waterpark-stay-content">
              <h2>{pkg.name}</h2>
              <p className="waterpark-stay-desc">{pkg.description}</p>
              <div style={{ margin: "10px 0", color: "#334155", fontSize: 14 }}>
                {pkg.duration_hours != null && (
                  <p><strong>Duration:</strong> {pkg.duration_hours} Hours</p>
                )}
                <p><strong>Included Adults:</strong> {pkg.included_adults ?? 0}</p>
                <p><strong>Included Children:</strong> {pkg.included_children ?? 0}</p>
                <p><strong>Included Seniors:</strong> {pkg.included_seniors ?? 0}</p>
              </div>
              <div className="waterpark-stay-price">
                <strong>Price:</strong> ₹{pricing?.base_price || 0}
              </div>
              <button className="waterpark-stay-book-btn" onClick={handleBook}>
                Book Package
              </button>
            </div>
            <div className="waterpark-stay-image">
              <div className="waterpark-stay-image-wrapper">
                <img
                  src={firstImg}
                  alt="Waterpark Stay"
                  onClick={() => openSlider(imgs, 0)}
                />
                <div className="waterpark-stay-main-dots">
                  {imgs.map((_, index) => (
                    <span
                      key={index}
                      className="waterpark-stay-main-dot"
                      onClick={() => openSlider(imgs, index)}
                    ></span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {showSlider && (
        <div className="waterpark-stay-modal">
          <span className="waterpark-stay-close" onClick={closeSlider}>
            ✖
          </span>
          <button className="waterpark-stay-nav left" onClick={prevImage}>
            ❮
          </button>
          <img
            src={selectedImages[currentIndex]}
            className="waterpark-stay-slider-img"
            alt="slider"
          />
          <button className="waterpark-stay-nav right" onClick={nextImage}>
            ❯
          </button>

          <div className="waterpark-stay-dots">
            {selectedImages.map((_, index) => (
              <span
                key={index}
                className={`waterpark-stay-dot ${
                  index === currentIndex ? "active" : ""
                }`}
                onClick={() => setCurrentIndex(index)}
              ></span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WaterparkStay;

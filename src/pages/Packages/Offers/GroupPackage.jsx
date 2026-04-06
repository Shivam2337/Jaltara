import React, { useEffect, useState } from "react";
import "./GroupPackage.css";
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
const GroupPackage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list: userPackages = [], loading, error } =
    useSelector((s) => s.userPackages) || {};
  const isLoggedIn =
    useSelector((s) => !!s.userAuth?.token) ||
    !!localStorage.getItem("userAccessToken");
  const [selectedImages, setSelectedImages] = useState([]);
  useEffect(() => {
    dispatch(getUserPackagesAction({ package_type: "group_package" }));
  }, [dispatch]);

  const [showSlider, setShowSlider] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const groupPackages = userPackages.filter((p) => p.package_type === "group_package");

  const handleBook = () => {
    if (isLoggedIn) {
      navigate("/book");
    } else {
      toast.info("Please login to continue booking");
      navigate("/login");
    }
  };

  const openSlider = (images, index) => {
    setSelectedImages(images);
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

  return (
    <div className="group-package-page">
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

      {!loading && !error && groupPackages.length === 0 && (
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

      {!loading && !error && groupPackages.map((pkg) => {
        const pricing = pkg.pricings?.[0] || null;
        const images = (pkg.images || []).map((img) => img.image);
        const firstImg = images[0] || stayImg;
        return (
          <div className="group-package-card" key={pkg.id}>
            <div className="group-package-content">
              <h2>{pkg.name}</h2>
              <span className="group-package-badge">
                👥 15% OFF – Group Special
              </span>

              <p className="group-package-desc">{pkg.description}</p>
              <div style={{ margin: "10px 0", color: "#334155", fontSize: 14 }}>
                {pkg.duration_hours != null && (
                  <p><strong>Duration:</strong> {pkg.duration_hours} Hours</p>
                )}
                <p><strong>Included Adults:</strong> {pkg.included_adults ?? 0}</p>
                <p><strong>Included Children:</strong> {pkg.included_children ?? 0}</p>
                <p><strong>Included Seniors:</strong> {pkg.included_seniors ?? 0}</p>
              </div>
              <div className="group-package-price">
                <strong>Price:</strong> ₹{pricing?.base_price || 0}
              </div>
              <button className="group-package-btn" onClick={handleBook}>
                Book Group Package
              </button>
            </div>
            <div className="group-package-image">
              <div className="group-package-image-wrapper">
                <img
                  src={firstImg}
                  alt="Group Package"
                  onClick={() => openSlider(images, 0)}
                />
                <div className="group-package-main-dots">
                  {images.map((_, index) => (
                    <span
                      key={index}
                      className="group-package-main-dot"
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
        <div className="group-package-modal">
          <span className="group-package-close" onClick={closeSlider}>
            ✖
          </span>

          <button className="group-package-nav left" onClick={prevImage}>
            ❮
          </button>

          <img
            src={selectedImages[currentIndex]}
            className="group-package-slider-img"
            alt="slider"
          />

          <button className="group-package-nav right" onClick={nextImage}>
            ❯
          </button>

          <div className="group-package-dots">
            {selectedImages.map((_, index) => (
              <span
                key={index}
                className={`group-package-dot ${
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

export default GroupPackage;

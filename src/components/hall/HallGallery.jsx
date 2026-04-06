import React, { useState } from "react";
import "./HallGallery.css";
import fallbackImg from "../../assets/home/amenities/auditorium.png";

export default function HallGallery({ hallData, loading, error }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const sanitize = (u) =>
    typeof u === "string" ? u.replace(/`/g, "").trim() : u;
  const gallery = Array.isArray(hallData?.gallery) ? hallData.gallery : [];
  const len = gallery.length;
  const next = () => setSelectedImage((i) => (i + 1) % len);
  const prev = () => setSelectedImage((i) => (i - 1 + len) % len);

  if (loading) {
    return (
      <section className="hall-gallery">
        <h2 className="hall-gallery-heading">Gallery</h2>
        <p>Loading gallery...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="hall-gallery">
        <h2 className="hall-gallery-heading">Gallery</h2>
        <p>No gallery images available</p>
      </section>
    );
  }

  if (!gallery || gallery.length === 0) {
    return (
      <section className="hall-gallery">
        <h2 className="hall-gallery-heading">Gallery</h2>
        <p style={{ textAlign: "center" }}>No gallery images available</p>
      </section>
    );
  }

  return (
    <section className="hall-gallery">
      <h2 className="hall-gallery-heading">Gallery</h2>

      <div className="hall-gallery-container">
        <div className="hall-gallery-main" style={{ position: "relative" }}>
          <img
            src={sanitize(gallery[selectedImage]?.image) || fallbackImg}
            alt={gallery[selectedImage]?.title}
            className="hall-gallery-main-img"
            onError={(e) => {
              if (e.currentTarget.src !== fallbackImg) e.currentTarget.src = fallbackImg;
            }}
          />
          <button
            aria-label="Previous"
            onClick={prev}
            style={{
              position: "absolute",
              top: "50%",
              left: 12,
              transform: "translateY(-50%)",
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "none",
              background: "rgba(0,0,0,0.5)",
              color: "#fff",
              cursor: "pointer"
            }}
          >
            ❮
          </button>
          <button
            aria-label="Next"
            onClick={next}
            style={{
              position: "absolute",
              top: "50%",
              right: 12,
              transform: "translateY(-50%)",
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "none",
              background: "rgba(0,0,0,0.5)",
              color: "#fff",
              cursor: "pointer"
            }}
          >
            ❯
          </button>
          <p className="hall-gallery-main-title">
            {gallery[selectedImage]?.title}
          </p>
        </div>

        <div className="hall-gallery-thumbnails">
          {gallery.map((image, index) => (
            <div
              key={image.id || index}
              className={`hall-gallery-thumb ${selectedImage === index ? "active" : ""
                }`}
              onClick={() => setSelectedImage(index)}
            >
              <img
                src={sanitize(image.image) || fallbackImg}
                alt={image.title}
                onError={(e) => {
                  if (e.currentTarget.src !== fallbackImg) e.currentTarget.src = fallbackImg;
                }}
              />
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 8 }}>
          {gallery.map((_, i) => (
            <span
              key={i}
              onClick={() => setSelectedImage(i)}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: i === selectedImage ? "#667eea" : "#d1d5db",
                cursor: "pointer"
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

import React, { useEffect, useMemo, useState } from "react";
import "./Gallery.css";
import { useDispatch, useSelector } from "react-redux";
import { getUserGalleryAction } from "../../redux/UserActions";
import waterParkImg from "../../assets/waterpark.jpg";
export default function Gallery() {
  const [activeTab, setActiveTab] = useState("All");
  const dispatch = useDispatch();
  const items = useSelector((s) => s.userGallery?.list || []);
  const loading = useSelector((s) => s.userGallery?.loading || false);
  const error = useSelector((s) => s.userGallery?.error || null);

  useEffect(() => {
    const params = activeTab === "All" ? {} : { category: activeTab };
    dispatch(getUserGalleryAction(params));
  }, [dispatch, activeTab]);

  const categories = useMemo(() => {
    return [
      "All",
      "Water Park",
      "Activities",
      "Resort & Stay",
      "Family & Group",
      "Special Events",
    ];
  }, []);

  const filteredImages =
    activeTab === "All"
      ? items
      : items.filter((img) => {
          const a = (img.category || "").toLowerCase().trim();
          const b = (activeTab || "").toLowerCase().trim();
          return a === b;
        });

  return (
    <div className="gallery-wrapper">
      <h1>Gallery</h1>

      {/* Tabs */}
      <div className="gallery-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            className={activeTab === cat ? "active" : ""}
            onClick={() => setActiveTab(cat)}
          >
            {cat === "All" ? "All Photos" : cat}
          </button>
        ))}
      </div>

      <style>{`@keyframes gspin { to { transform: rotate(360deg); } }`}</style>

      {loading && (
        <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
          <div
            aria-label="Loading photos"
            style={{
              width: 36,
              height: 36,
              border: "3px solid #e5e7eb",
              borderTopColor: "#339af0",
              borderRadius: "50%",
              animation: "gspin 0.8s linear infinite",
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
          <p style={{ marginTop: 12, color: "#64748b" }}>Failed to load photos</p>
        </div>
      )}

      {!loading && !error && filteredImages.length === 0 && (
        <div style={{ textAlign: "center", padding: 24 }}>
          <img
            src={waterParkImg}
            alt="No photos"
            style={{ maxWidth: 320, width: "90%", borderRadius: 8 }}
          />
          <p style={{ marginTop: 12, color: "#64748b" }}>No photos found</p>
        </div>
      )}

      {!loading && !error && filteredImages.length > 0 && (
        <div className="gallery-grid">
          {filteredImages.map((img) => {
            const src =
              typeof img.src === "string"
                ? img.src.replace(/`/g, "").trim()
                : img.src;
            return (
              <div className="gallery-card" key={img.id}>
                <img src={src} alt={img.category || "Gallery"} loading="lazy" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

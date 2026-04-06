import React from "react";
import "../aboutPage/AboutStory.css";
import fallbackImg from "../../assets/home/amenities/auditorium.png";

export default function HallDetails({ hallData, loading, error }) {
  const sanitize = (u) => (typeof u === "string" ? u.replace(/`/g, "").trim() : u);

  if (loading) {
    return (
      <section className="about-page-story" >
        <div className="about-page-story-img-wrapper">
          <div className="about-page-story-img" style={{ width: "100%", height: 320, background: "#eee", borderRadius: 12 }} />
        </div>
        <div className="about-page-story-text-box">
          <h2 className="about-page-story-text-heading">- Our Hall</h2>
          <p className="about-page-story-text">Loading...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="about-page-story">
        <div className="about-page-story-img-wrapper">
          <div className="about-page-story-img" style={{ width: "100%", height: 320, background: "#eee", borderRadius: 12 }} />
        </div>
        <div className="about-page-story-text-box">
          <h2 className="about-page-story-text-heading">- Our Hall</h2>
          <p className="about-page-story-text">Failed to load content</p>
        </div>
      </section>
    );
  }

  const imageUrl = sanitize(hallData?.main_image) || fallbackImg;
  const baseText = hallData?.description || "";
  const featuresList = Array.isArray(hallData?.features) ? hallData.features : [];
  const facilities = featuresList.filter((f) => f.feature_type === "FACILITY");
  const events = featuresList.filter((f) => f.feature_type === "EVENT");
  const extra = [
    `Capacity: ${hallData?.capacity || "—"} people`,
    `Area: ${hallData?.area || "—"} sq. ft.`,
    `Type: ${hallData?.hall_type || "—"}`,
    `Air Conditioning: ${hallData?.air_conditioning ? "Yes" : "No"}`,
    `Parking: ${hallData?.parking || "—"}`,
  ];
  const paragraphs = [baseText, ...extra].filter(Boolean).flatMap((t) =>
    String(t)
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean)
  );

  return (
    <section className="about-page-story">
      <div className="about-page-story-img-wrapper">
        <img
          className="about-page-story-img"
          src={imageUrl}
          alt={hallData?.title || "Hall"}
          onError={(e) => {
            if (e.currentTarget.src !== fallbackImg) e.currentTarget.src = fallbackImg;
          }}
        />
      </div>

      <div className="about-page-story-text-box">
        <h2 className="about-page-story-text-heading"> {hallData?.title || "Our Hall"}</h2>
        <p className="about-page-story-text-tagline">{hallData?.tagline}</p>
        <p className="about-page-story-text">{hallData?.description}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "8px 0 12px" }}>
          <span style={{ background: "#eef2ff", border: "1px solid #e5e7eb", padding: "6px 10px", borderRadius: 16, fontSize: 13, color: "#334155", display: "flex", alignItems: "center", gap: 6 }}>
            <span className="material-symbols-rounded" style={{ fontSize: 16, color: "#667eea" }}>groups</span>
            {hallData?.capacity ? `${hallData.capacity} people` : "Capacity —"}
          </span>

          <span style={{ background: "#eef2ff", border: "1px solid #e5e7eb", padding: "6px 10px", borderRadius: 16, fontSize: 13, color: "#334155", display: "flex", alignItems: "center", gap: 6 }}>
            <span className="material-symbols-rounded" style={{ fontSize: 16, color: "#667eea" }}>square_foot</span>
            {hallData?.area ? `${hallData.area} sq.ft.` : "Area —"}
          </span>
          <span style={{ background: "#eef2ff", border: "1px solid #e5e7eb", padding: "6px 10px", borderRadius: 16, fontSize: 13, color: "#334155", display: "flex", alignItems: "center", gap: 6 }}>
            <span className="material-symbols-rounded" style={{ fontSize: 16, color: "#667eea" }}>apartment</span>
            {hallData?.hall_type || "Type —"}
          </span>
          <span style={{ background: "#eef2ff", border: "1px solid #e5e7eb", padding: "6px 10px", borderRadius: 16, fontSize: 13, color: "#334155", display: "flex", alignItems: "center", gap: 6 }}>
            <span className="material-symbols-rounded" style={{ fontSize: 16, color: "#667eea" }}>ac_unit</span>
            {hallData?.air_conditioning ? "AC: Yes" : "AC: No"}
          </span>
          <span style={{ background: "#eef2ff", border: "1px solid #e5e7eb", padding: "6px 10px", borderRadius: 16, fontSize: 13, color: "#334155", display: "flex", alignItems: "center", gap: 6 }}>
            <span className="material-symbols-rounded" style={{ fontSize: 16, color: "#667eea" }}>local_parking</span>
            {hallData?.parking || "Parking —"}
          </span>
        </div>





        {facilities.length > 0 && (
          <div >
            <h3 style={{ margin: "8px 0", fontSize: 18, color: "#334155" }}>Facilities</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {facilities.map((f) => (
                <span
                  key={f.id}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 12px",
                    borderRadius: 9999,
                    background: "#eef2ff",
                    color: "#334155",
                    fontSize: 14,
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <span className="material-symbols-rounded" style={{ fontSize: 18, color: "#667eea" }}>
                    check_circle
                  </span>
                  {f.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {events.length > 0 && (
          <div style={{ marginTop: 14 }}>
            <h3 style={{ margin: "8px 0", fontSize: 18, color: "#334155" }}>Perfect For</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {events.map((e) => (
                <span
                  key={e.id}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 12px",
                    borderRadius: 9999,
                    background: "#f3e8ff",
                    color: "#3b0764",
                    fontSize: 14,
                    border: "1px solid #edd4ff",
                  }}
                >
                  <span className="material-symbols-rounded" style={{ fontSize: 18, color: "#7c3aed" }}>
                    celebration
                  </span>
                  {e.name}
                </span>
              ))}
            </div>
          </div>
        )}
        {/* {(hallData?.phone_number || hallData?.email) && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
            {hallData?.phone_number && (
              <a
                href={`tel:${sanitize(hallData.phone_number)}`}
                style={{ background: "#667eea", color: "#fff", borderRadius: 8, padding: "8px 12px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
              >
                <span className="material-symbols-rounded" style={{ fontSize: 18 }}>call</span>
                Call Now
              </a>
            )}
            {hallData?.email && (
              <a
                href={`mailto:${sanitize(hallData.email)}`}
                style={{ background: "transparent", color: "#667eea", border: "2px solid #667eea", borderRadius: 8, padding: "6px 12px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
              >
                <span className="material-symbols-rounded" style={{ fontSize: 18 }}>mail</span>
                Email Us
              </a>
            )}
          </div>
        )} */}
      </div>
    </section>
  );
}

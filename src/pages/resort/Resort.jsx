import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Pages.css";
import resortImg from "../../assets/resort.jpg";

/* IMAGES */
import Cottage1 from "../../assets/images/Cottage 1.jpg";

import Premium1 from "../../assets/images/Premium 1.jpg";

import Deluxe1 from "../../assets/images/Deluxe 1.jpg";

import { useDispatch, useSelector } from "react-redux";
import { getUserRoomsAction } from "../../redux/UserActions";
import { toast } from "react-toastify";

export default function Resort() {
  /* ===== VIEW MODAL STATE ===== */
  const [showModal, setShowModal] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const dispatch = useDispatch();
  const {
    list: apiRooms = [],
    loading,
    error,
  } = useSelector((s) => s.userRooms) || {};
  const isLoggedIn =
    useSelector((s) => !!s.userAuth?.token) ||
    !!localStorage.getItem("userAccessToken");
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getUserRoomsAction());
  }, [dispatch]);

  const findRoom = (keyword) =>
    apiRooms.find((r) => (r.name || "").toLowerCase().includes(keyword));
  const primaryImg = (room) =>
    (room?.images || []).find((im) => im?.is_primary)?.image || "";
  const firstImg = (room, fallback) => primaryImg(room) || fallback || "";
  const allImgs = (room) => (room?.images || []).map((img) => img.image);
  const mealPrice = (room, plan) =>
    (room?.pricings || []).find((p) => p.meal_plan === plan)?.base_price ?? "—";
  const weekdayPrice = (room) =>
    (room?.pricings || []).find((p) => p.is_weekend === false)?.base_price ??
    "—";
  const weekendPrice = (room) =>
    (room?.pricings || []).find((p) => p.is_weekend === true)?.base_price ??
    "—";
  const persons = (room) =>
    room && (room.max_adults != null || room.max_children != null)
      ? `${room.max_adults ?? "—"}+${room.max_children ?? "—"} Persons`
      : "—";
  const bedType = (room) => room?.bed_type ?? "—";
  const roomSize = (room) => room?.room_size ?? "—";
  const hasAmenity = (room, name) =>
    (room?.amenities || []).some(
      (a) => (a || "").toLowerCase() === (name || "").toLowerCase()
    );
  const wifiLabel = (room) => (hasAmenity(room, "WiFi") ? "Free Wi-Fi" : "—");
  const breakfastLabel = (room) =>
    (room?.pricings || []).some((p) => p.meal_plan === "breakfast")
      ? "Breakfast Available"
      : "—";
  const balconyLabel = (room) =>
    hasAmenity(room, "Balcony") ? "Balcony" : "—";
  const gardenViewLabel = (room) =>
    hasAmenity(room, "Garden View") ? "Garden View" : "—";
  const privateSitoutLabel = (room) =>
    hasAmenity(room, "Private Sit-out") ? "Private Sit-out" : "—";
  const planLabel = (plan) =>
    plan === "room_only"
      ? "Room Only"
      : plan === "breakfast"
      ? "Breakfast"
      : plan === "full_board"
      ? "All Meals"
      : plan || "Plan";

  /* ===== HANDLE VIEW CLICK ===== */
  const handleView = (images) => {
    const cleaned =
      (images || [])
        .map((img) =>
          typeof img === "string"
            ? img.replace(/[`'"]/g, "").trim()
            : img?.image || img
        )
        .filter(Boolean) || [];
    setModalImages(cleaned);
    setShowModal(true);
  };
  const handleBook = (room) => {
    if (isLoggedIn) {
      navigate("/book", {
        state: {
          category: "resort",
          roomType: room.name || "Room",
          price: mealPrice(room, "room_only"),
        },
      });
    } else {
      toast.info("Please login to continue booking");
      navigate("/login");
    }
  };

  return (
    <div className="resort-suite-page">
      <style>{`@keyframes rspin { to { transform: rotate(360deg); } }`}</style>
      <h1 className="suite-title">Resort Rooms</h1>

      {loading && (
        <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
          <div
            aria-label="Loading rooms"
            style={{
              width: 36,
              height: 36,
              border: "3px solid #e5e7eb",
              borderTopColor: "#339af0",
              borderRadius: "50%",
              animation: "rspin 0.8s linear infinite",
            }}
          />
        </div>
      )}

      {!loading && error && (
        <div style={{ textAlign: "center", padding: 24 }}>
          <img
            src={resortImg}
            alt="Resort"
            style={{ maxWidth: 320, width: "90%", borderRadius: 8 }}
          />
          <p style={{ marginTop: 12, color: "#64748b" }}>
            No resort rooms available
          </p>
        </div>
      )}

      {!loading && !error && (apiRooms || []).length === 0 && (
        <div style={{ textAlign: "center", padding: 24 }}>
          <img
            src={resortImg}
            alt="Resort"
            style={{ maxWidth: 320, width: "90%", borderRadius: 8 }}
          />
          <p style={{ marginTop: 12, color: "#64748b" }}>
            No resort rooms available
          </p>
        </div>
      )}

      {!loading &&
        !error &&
        (apiRooms || []).map((room, idx) => (
          <div
            key={room.id ?? idx}
            className={`suite-section ${
              idx % 2 === 1 ? "reverse " : ""
            }light-card`}
          >
            <div className="suite-image">
              <img
                src={firstImg(
                  room,
                  (room.name || "").toLowerCase().includes("premium")
                    ? Premium1
                    : (room.name || "").toLowerCase().includes("cottage")
                    ? Cottage1
                    : Deluxe1
                )}
                alt={room.name || "Room"}
              />
            </div>

            <div className="suite-content">
              <h2>{room.name || "Room"}</h2>
              <p>{room.description || ""}</p>

              <div className="suite-features">
                <span>Adults: {room?.max_adults ?? "—"}</span>
                <span>Children: {room?.max_children ?? "—"}</span>
                <span>Bed: {bedType(room)}</span>
                <span>Size: {roomSize(room)}</span>
                {(room?.amenities || []).map((a, i) => (
                  <span key={i}>{a}</span>
                ))}
                {(room?.pricings || []).map((p, i) => (
                  <span key={`plan-${room.id ?? idx}-${i}`}>
                    {planLabel(p.meal_plan)}
                  </span>
                ))}
              </div>

              <div className="suite-price">
                {(room?.pricings || []).map((p, i) => (
                  <div key={i}>
                    <p>
                      <strong>Room Price:</strong> ₹{p.base_price}
                    </p>
                    <p>
                      <strong>Extra Adult:</strong> ₹{p.extra_adult_price}
                    </p>
                    <p>
                      <strong>Extra Child:</strong> ₹{p.extra_child_price}
                    </p>
                  </div>
                ))}
              </div>

              <div className="suite-buttons">
                <button
                  className="view-btn"
                  onClick={() => handleView(allImgs(room))}
                >
                  View
                </button>

                <button className="book-btn" onClick={() => handleBook(room)}>
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="image-modal" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Room Images</h3>
              <button
                className="close-btn"
                aria-label="Close"
                onClick={() => setShowModal(false)}
              >
                ✖
              </button>
            </div>
            <div className="modal-images-grid">
              {modalImages.length === 0 ? (
                <div className="modal-empty">No images available</div>
              ) : (
                modalImages.map((img, index) => (
                  <img
                    key={index}
                    src={
                      typeof img === "string"
                        ? img.replace(/`/g, "").trim()
                        : img
                    }
                    alt={`Room image ${index + 1}`}
                    loading="lazy"
                  />
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

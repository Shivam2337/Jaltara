import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import resortImg from "../../assets/resort.jpg";
import Cottage1 from "../../assets/images/Cottage 1.jpg";
import Premium1 from "../../assets/images/Premium 1.jpg";
import Deluxe1  from "../../assets/images/Deluxe 1.jpg";
import { useDispatch, useSelector } from "react-redux";
import { getUserRoomsAction } from "../../redux/UserActions";
import { toast } from "react-toastify";

export default function Resort() {
  const [showModal, setShowModal]   = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const dispatch   = useDispatch();
  const { list: apiRooms = [], loading, error } = useSelector((s) => s.userRooms) || {};
  const isLoggedIn = useSelector((s) => !!s.userAuth?.token) || !!localStorage.getItem("userAccessToken");
  const navigate   = useNavigate();

  useEffect(() => { dispatch(getUserRoomsAction()); }, [dispatch]);

  const primaryImg  = (room) => (room?.images || []).find((im) => im?.is_primary)?.image || "";
  const firstImg    = (room, fallback) => primaryImg(room) || fallback || "";
  const allImgs     = (room) => (room?.images || []).map((img) => img.image);
  const mealPrice   = (room, plan) => (room?.pricings || []).find((p) => p.meal_plan === plan)?.base_price ?? "—";
  const bedType     = (room) => room?.bed_type ?? "—";
  const roomSize    = (room) => room?.room_size ?? "—";
  const planLabel   = (plan) =>
    plan === "room_only" ? "Room Only" : plan === "breakfast" ? "Breakfast" : plan === "full_board" ? "All Meals" : plan || "Plan";

  const handleView = (images) => {
    const cleaned = (images || []).map((img) =>
      typeof img === "string" ? img.replace(/[`'"]/g, "").trim() : img?.image || img
    ).filter(Boolean);
    setModalImages(cleaned);
    setShowModal(true);
  };

  const handleBook = (room) => {
    if (isLoggedIn) {
      navigate("/book", { state: { category: "resort", roomType: room.name || "Room", price: mealPrice(room, "room_only") } });
    } else {
      toast.info("Please login to continue booking");
      navigate("/login");
    }
  };

  return (
    <div className="px-[16px] sm:px-[20px] md:px-[4%] lg:px-[8%] pt-[90px] sm:pt-[100px] lg:pt-[130px] pb-10 bg-[#f8fafc]">
      <style>{`@keyframes rspin { to { transform: rotate(360deg); } }`}</style>

      <h1 className="text-center text-[28px] sm:text-[30px] lg:text-[36px] font-[Playfair_Display] mb-8 sm:mb-10 lg:mb-[60px] text-[#1e293b]">
        Resort Rooms
      </h1>

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center p-6">
          <div aria-label="Loading rooms"
            className="w-9 h-9 rounded-full border-[3px] border-[#e5e7eb] border-t-[#339af0]"
            style={{ animation: "rspin 0.8s linear infinite" }} />
        </div>
      )}

      {/* ERROR / EMPTY */}
      {!loading && (error || (apiRooms || []).length === 0) && (
        <div className="text-center p-6">
          <img src={resortImg} alt="Resort" className="max-w-[320px] w-[90%] rounded-lg mx-auto" />
          <p className="mt-3 text-[#64748b]">No resort rooms available</p>
        </div>
      )}

      {/* ROOM SECTIONS */}
      {!loading && !error && (apiRooms || []).map((room, idx) => (
        <div
          key={room.id ?? idx}
          className={`flex items-start gap-4 md:gap-6 lg:gap-[50px] mb-8 md:mb-12 lg:mb-[80px] border border-[#e6e6e6] rounded-xl p-4 md:p-5 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_6px_18px_rgba(0,0,0,0.1)] hover:-translate-y-[3px]
            ${idx % 2 === 1 ? "flex-col md:flex-row-reverse" : "flex-col md:flex-row"} text-center md:text-left`}
        >
          {/* IMAGE */}
          <div className="w-full md:w-[260px] lg:w-[420px] shrink-0">
            <img
              src={firstImg(room,
                (room.name || "").toLowerCase().includes("premium") ? Premium1 :
                (room.name || "").toLowerCase().includes("cottage") ? Cottage1 : Deluxe1
              )}
              alt={room.name || "Room"}
              className="w-full h-[220px] md:h-[200px] lg:h-auto rounded-[10px] shadow-[0_8px_20px_rgba(0,0,0,0.1)] object-cover"
            />
          </div>

          {/* CONTENT */}
          <div className="flex-1">
            <h2 className="text-[20px] sm:text-[22px] md:text-[20px] lg:text-[28px] font-[Playfair_Display] mb-[10px] md:mb-[12px] text-[#0f172a]">
              {room.name || "Room"}
            </h2>
            <p className="text-[#475569] mb-3 md:mb-4 leading-[1.6] text-sm">{room.description || ""}</p>

            {/* FEATURES */}
            <div className="flex flex-wrap gap-[8px] mb-3 md:mb-4 justify-center md:justify-start">
              <span className="bg-[#e2e8f0] px-3 py-[5px] rounded-full text-[11px] md:text-[12px]">Adults: {room?.max_adults ?? "—"}</span>
              <span className="bg-[#e2e8f0] px-3 py-[5px] rounded-full text-[11px] md:text-[12px]">Children: {room?.max_children ?? "—"}</span>
              <span className="bg-[#e2e8f0] px-3 py-[5px] rounded-full text-[11px] md:text-[12px]">Bed: {bedType(room)}</span>
              <span className="bg-[#e2e8f0] px-3 py-[5px] rounded-full text-[11px] md:text-[12px]">Size: {roomSize(room)}</span>
              {(room?.amenities || []).map((a, i) => (
                <span key={i} className="bg-[#e2e8f0] px-3 py-[5px] rounded-full text-[11px] md:text-[12px]">{a}</span>
              ))}
              {(room?.pricings || []).map((p, i) => (
                <span key={`plan-${room.id ?? idx}-${i}`} className="bg-[#e2e8f0] px-3 py-[5px] rounded-full text-[11px] md:text-[12px]">
                  {planLabel(p.meal_plan)}
                </span>
              ))}
            </div>

            {/* PRICE */}
            <div className="mb-3 md:mb-4 text-[#1e293b] text-sm">
              {(room?.pricings || []).map((p, i) => (
                <div key={i}>
                  <p><strong>Room Price:</strong> ₹{p.base_price}</p>
                  <p><strong>Extra Adult:</strong> ₹{p.extra_adult_price}</p>
                  <p><strong>Extra Child:</strong> ₹{p.extra_child_price}</p>
                </div>
              ))}
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3 mt-4 items-center justify-center md:justify-start flex-wrap">
              <button
                onClick={() => handleView(allImgs(room))}
                className="w-full sm:w-[120px] px-5 py-[9px] text-sm font-semibold rounded-md border-2 border-[#ef4444] bg-white text-[#ef4444] hover:bg-[#ef4444] hover:text-white transition-all duration-300 cursor-pointer inline-flex items-center justify-center min-h-[40px]"
              >
                View
              </button>
              <button
                onClick={() => handleBook(room)}
                className="w-full sm:w-[120px] px-5 py-[9px] text-sm font-semibold rounded-md border-2 border-[#ef4444] bg-[#ef4444] text-white hover:bg-[#dc2626] transition-all duration-300 cursor-pointer inline-flex items-center justify-center min-h-[40px]"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* IMAGE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-[999]" onClick={() => setShowModal(false)}>
          <div className="bg-white p-5 rounded-xl w-[90%] max-w-[900px] relative" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-[Playfair_Display] text-lg font-semibold">Room Images</h3>
              <button onClick={() => setShowModal(false)}
                className="bg-red-500 text-white border-none text-lg cursor-pointer px-[10px] py-[5px] rounded-md">✖</button>
            </div>
            <div className="grid gap-3 max-h-[70vh] overflow-y-auto" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" }}>
              {modalImages.length === 0 ? (
                <div className="p-6 text-center text-[#64748b] col-span-full">No images available</div>
              ) : (
                modalImages.map((img, index) => (
                  <img key={index}
                    src={typeof img === "string" ? img.replace(/`/g, "").trim() : img}
                    alt={`Room image ${index + 1}`}
                    loading="lazy"
                    className="w-full h-[180px] sm:h-[220px] object-cover rounded-lg bg-[#f1f5f9]"
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

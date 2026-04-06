import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRoomsListAction, postBookingSummaryAction } from "../../../redux/UserActions";
import { setSelectedResort, setBookingSummary } from "../../../features/booking/bookingSlice";
import "./BookingRooms.css";
import fallbackImg from "../../../assets/images/Cottage 1.jpg";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import waterParkImg from "../../../assets/waterpark.jpg";
export default function BookingRooms() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: rooms = [], loading, error } =
    useSelector((s) => s.userRoomsList) || { list: [], loading: false, error: null };
  const booking = useSelector((s) => s.booking);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [counts, setCounts] = useState({ adult: 0, child: 0 });
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsRoom, setDetailsRoom] = useState(null);

  useEffect(() => {
    const fmt = (iso) => {
      if (!iso) return null;
      const d = new Date(iso);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    };
    const start = fmt(booking?.checkIn);
    const end = fmt(booking?.checkOut || booking?.checkIn);
    if (start && end) {
      dispatch(getRoomsListAction({ start_date: start, end_date: end }));
    } else {
      dispatch(getRoomsListAction());
    }
  }, [dispatch, booking?.checkIn, booking?.checkOut]);

  const openDrawer = (room) => {
    setSelectedRoom(room);
    const savedTotals =
      booking?.selectedResort && booking.selectedResort.id === room.id
        ? booking.selectedResort.counts
        : null;
    if (savedTotals) {
      const incA = parseInt(room?.max_adults ?? 0, 10) || 0;
      const incC = parseInt(room?.max_children ?? 0, 10) || 0;
      setCounts({
        adult: Math.max(0, (savedTotals.adult || 0) - incA),
        child: Math.max(0, (savedTotals.child || 0) - incC),
      });
    } else {
      setCounts({ adult: 0, child: 0 });
    }
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedRoom(null);
  };

  const changeCount = (type, delta) => {
    setCounts((c) => {
      const maxA = parseInt(selectedRoom?.max_adults ?? 0, 10) || 0;
      const maxC = parseInt(selectedRoom?.max_children ?? 0, 10) || 0;
      const next = { ...c };
      if (type === "adult") {
        const v = Math.max(0, (c.adult || 0) + delta);
        next.adult = maxA > 0 ? Math.min(v, maxA) : v;
      } else if (type === "child") {
        const v = Math.max(0, (c.child || 0) + delta);
        next.child = maxC > 0 ? Math.min(v, maxC) : v;
      }
      return next;
    });
  };

  const addOrRemoveSelection = () => {
    if (!selectedRoom) return;
    const existing = booking?.selectedResort;
    if (existing && existing.id === selectedRoom.id) {
      dispatch(setSelectedResort(null));
      dispatch(setBookingSummary(null));
      toast.info("Room removed");
      setCounts({ adult: 0, child: 0 });
      return;
    }
    if (existing && existing.id !== selectedRoom.id) {
      toast.error("Already one Room is added. Remove it, then add another.");
      return;
    }
    const incA = parseInt(selectedRoom?.max_adults ?? 0, 10) || 0;
    const incC = parseInt(selectedRoom?.max_children ?? 0, 10) || 0;
    const totals = {
      adult: incA + (counts.adult || 0),
      child: incC + (counts.child || 0),
    };
    const payload = {
      id: selectedRoom.id,
      name: selectedRoom.name,
      price: parseFloat(selectedRoom.price || 0) || 0,
      counts: totals,
      pricing: selectedRoom.pricing || {},
    };
    dispatch(setSelectedResort(payload));
    toast.success("Added");
  };

  const continueSummary = async () => {
    if (!selectedRoom) return;
    const existing = booking?.selectedResort;
    if (!existing || existing.id !== selectedRoom.id) {
      toast.warn("Add the room first");
      return;
    }
    const incA = parseInt(selectedRoom?.max_adults ?? 0, 10) || 0;
    const incC = parseInt(selectedRoom?.max_children ?? 0, 10) || 0;
    const totA = incA + (counts.adult || 0);
    const totC = incC + (counts.child || 0);
    dispatch(setSelectedResort({
      id: selectedRoom.id,
      name: selectedRoom.name,
      price: parseFloat(selectedRoom.price || 0) || 0,
      counts: { adult: totA, child: totC },
      pricing: selectedRoom.pricing || {},
    }));
    const fmt = (iso) => {
      if (!iso) return null;
      const d = new Date(iso);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    };
    const checkIn = fmt(booking?.checkIn);
    const checkOut = fmt(booking?.checkOut || booking?.checkIn);
    const mealPlan = selectedRoom?.pricing?.meal_plan || "room_only";
    const payload = {
      booking_type: "room",
      check_in: checkIn || null,
      check_out: checkOut || null,
      room_id: selectedRoom.id,
      room_category_id: selectedRoom.id,
      meal_plan: mealPlan,
      adults: totA,
      children: totC,
      coupon_code: booking?.promoCode || undefined,
    };
    const result = await dispatch(postBookingSummaryAction(payload));
    if (!result?.ok) {
      if (result?.status === 401) {
        toast.error("Please log in to calculate summary");
        navigate("/login");
      } else {
        const msg = Array.isArray(result?.data)
          ? result.data.join(", ")
          : typeof result?.data === "string"
          ? result.data
          : result?.data?.detail || "Summary failed";
        toast.error(msg);
      }
      return;
    }
    toast.success("Summary calculated");
    closeDrawer();
  };

  return (
    <div className="rooms-grid">
      <style>{`@keyframes rgspin { to { transform: rotate(360deg); } }`}</style>
      {loading && (
        <div style={{ gridColumn: "1 / -1", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", padding: 24, minHeight: 180 }}>
          <div
            aria-label="Loading rooms"
            style={{
              width: 36,
              height: 36,
              border: "3px solid #e5e7eb",
              borderTopColor: "#339af0",
              borderRadius: "50%",
              animation: "rgspin 0.8s linear infinite",
            }}
          />
        </div>
      )}

      {!loading && error && (
        <div className="booking-s2-addon-empty">Failed to load rooms</div>
      )}

      {!loading && !error && rooms.length === 0 && (
        <div className="booking-s2-addon-empty">No rooms available</div>
      )}

      {!loading && !error && rooms.map((r) => {
        const hasPrimary = Array.isArray(r.images) && r.images.some(im => im?.is_primary);
        const primaryImg = hasPrimary ? r.images.find(im => im?.is_primary)?.image : null;
        // Card rule: if no primary exists, show local fallback on card (not the first API image)
        const img = primaryImg || fallbackImg;
        const base = r.price || 0;
        const meal =
          r?.pricing?.meal_plan
            ? r.pricing.meal_plan.replace("_", " ")
            : "no meal";
        const minAvail = Array.isArray(r.availability) && r.availability.length
          ? Math.min(...r.availability.map(a => a?.available_rooms ?? 0))
          : null;
        const isSelected = booking?.selectedResort && booking.selectedResort.id === r.id;
        return (
          <div key={r.id} className="room-card">
            <div className="room-card-img">
              {img ? <img src={img} alt={r.name} /> : <div className="room-card-img-fallback" />}
              {/* price moved to bottom row */}
            </div>
            <div className="room-card-body">
              <h4 className="room-card-title">{r.name}</h4>
              <div className="room-chip-row">
                <span className="chip chip-room">{meal}</span>
                <span className="chip chip-gray">{r.max_adults ?? 0} adults</span>
                <span className="chip chip-gray">{r.max_children ?? 0} childs</span>
                {minAvail !== null ? <span className="chip chip-gray">Rooms: {minAvail}</span> : null}
              </div>
              <div className="room-card-row">
                <span className="room-card-price">₹{parseFloat(base || 0) || 0}</span>
                <div className="room-card-actions">
                  <button
                    type="button"
                    className="room-card-link"
                    onClick={() => {
                      setDetailsRoom(r);
                      setDetailsOpen(true);
                    }}
                  >
                    View details
                  </button>
                  <button className="room-card-btn" onClick={() => openDrawer(r)}>
                    {isSelected ? "Added" : "Add"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {detailsOpen && detailsRoom && (
        <div className="room-modal-overlay" onClick={() => setDetailsOpen(false)}>
          <div className="room-modal" onClick={(e) => e.stopPropagation()}>
            <div className="room-modal-header">
              <h4 className="room-modal-title">{detailsRoom.name}</h4>
              <span className="material-symbols-rounded room-modal-close" onClick={() => setDetailsOpen(false)}>
                close
              </span>
            </div>
            <div className="room-modal-body">
              <p className="room-modal-desc">{detailsRoom.description || "No description available."}</p>
              <div className="room-modal-images">
                {(detailsRoom.images && detailsRoom.images.length > 0
                  ? detailsRoom.images
                  : [{ image: fallbackImg }]).map((im, i) => (
                  <div key={i} className="room-modal-img-wrap">
                    <img src={im.image || fallbackImg} alt={`room-${i}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {drawerOpen && selectedRoom && (
        <div className="room-drawer-overlay" onClick={closeDrawer}>
          <div className="room-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="room-drawer-header">
              <h4 className="room-drawer-title">{selectedRoom.name}</h4>
              <span className="material-symbols-rounded room-drawer-close" onClick={closeDrawer}>
                close
              </span>
            </div>
            <div className="room-drawer-content">
              <div className="room-drawer-row">
                <div className="room-drawer-row-left">
                  <span className="room-drawer-label">Base Plan</span>
                  <span className="room-drawer-price">
                    ₹{parseFloat(selectedRoom?.pricing?.base_price ?? selectedRoom?.price ?? 0).toFixed(2)}
                  </span>
                  <span className="room-drawer-included-meta">
                    Adults {selectedRoom?.max_adults ?? 0} • Childs {selectedRoom?.max_children ?? 0}
                  </span>
                </div>
                <div className="room-drawer-counter">
                  <button className="vip-drawer-add-btn" onClick={addOrRemoveSelection}>
                    {booking?.selectedResort && booking.selectedResort.id === selectedRoom.id ? "Remove" : "Add"}
                  </button>
                </div>
              </div>
              <div className="room-drawer-row">
                <div className="room-drawer-row-left">
                  <span className="room-drawer-label">Extra Adult</span>
                  <span className="room-drawer-price">
                    ₹{parseFloat(selectedRoom?.pricing?.extra_adult_price || 0)}
                  </span>
                </div>
                <div className="room-drawer-counter">
                  <button onClick={() => changeCount("adult", -1)} className="room-drawer-btn">−</button>
                  <span className="room-drawer-count">{counts.adult}</span>
                  <button onClick={() => changeCount("adult", 1)} className="room-drawer-btn">+</button>
                </div>
              </div>
              <div className="room-drawer-row">
                <div className="room-drawer-row-left">
                  <span className="room-drawer-label">Extra Child</span>
                  <span className="room-drawer-price">
                    ₹{parseFloat(selectedRoom?.pricing?.extra_child_price || 0)}
                  </span>
                </div>
                <div className="room-drawer-counter">
                  <button onClick={() => changeCount("child", -1)} className="room-drawer-btn">−</button>
                  <span className="room-drawer-count">{counts.child}</span>
                  <button onClick={() => changeCount("child", 1)} className="room-drawer-btn">+</button>
                </div>
              </div>
              <div className="room-drawer-row">
                <div className="room-drawer-row-left">
                  <span className="room-drawer-label">Seasonal Discount</span>
                  <span className="room-drawer-price">
                    {selectedRoom?.pricing?.seasonal_discount_percent ? `${parseFloat(selectedRoom.pricing.seasonal_discount_percent)}%` : "0%"}
                  </span>
                </div>
              </div>
            </div>
            <div className="room-drawer-footer">
              <button className="room-drawer-confirm" onClick={continueSummary}>Continue</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

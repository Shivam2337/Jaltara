import { useDispatch, useSelector, useStore } from "react-redux";
import { useEffect } from "react";
import { updateAddonCount } from "../../../features/booking/bookingSlice";
import "./BookingAddons.css";
import { getAddonsAction, postBookingSummaryAction } from "../../../redux/UserActions";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import fallbackImg from "../../../assets/images/Cottage 1.jpg";
import waterParkImg from "../../../assets/waterpark.jpg";
export default function BookingAddons() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const store = useStore();

  const booking = useSelector((state) => state.booking);
  const addons = booking.addons;
  const { list: addonsList = [], loading, error } =
    useSelector((s) => s.userAddons) || { list: [], loading: false, error: null };

  useEffect(() => {
    dispatch(getAddonsAction());
  }, [dispatch]);

  const getCount = (id) => {
    const addon = addons.find((a) => a.id === id);
    return addon ? addon.count : 0;
  };

  const recalcSummary = async () => {
    const currentBooking = store.getState()?.booking || booking;
    const category = currentBooking?.package?.category;
    if (!category) return;
    if (category === "resort") return;
    const bt =
      category === "waterpark" ? "water_park" : category === "vip" ? "combo" : category === "resort" ? "room" : "";
    const base = {
      booking_type: bt,
      visit_date: currentBooking?.checkIn || null,
      coupon_code: currentBooking?.promoCode || undefined,
      addons: (currentBooking?.addons || []).map((a) => ({
        addon_id: a.id,
        quantity: a.count || 0,
      })),
    };
    let payload = { ...base };
    if (category === "waterpark") {
      const tList = Array.isArray(currentBooking?.selectedTickets)
        ? currentBooking.selectedTickets
        : [];
      const active = tList.find((t) => {
        const c = t?.counts || {};
        return (c.adult || 0) + (c.child || 0) + (c.senior || 0) + (c.group || 0) > 0;
      });
      if (!active) return;
      const c = active.counts || {};
      payload = {
        ...payload,
        ticket_id: active.id,
        adults: c.adult || 0,
        children: c.child || 0,
        seniors: c.senior || 0,
        group: c.group || 0,
      };
    } else if (category === "resort") {
      const r = booking?.selectedResort;
      if (!r?.id) return;
      const c = r?.counts || {};
      payload = {
        ...payload,
        room_id: r.id,
        adults: c.adult || 0,
        children: c.child || 0,
      };
    } else if (category === "vip") {
      const v = booking?.selectedVip;
      if (!v?.id) return;
      const c = v?.counts || {};
      payload = {
        ...payload,
        package_id: v.id,
        adults: c.adult || 0,
        children: c.child || 0,
        seniors: c.senior || 0,
      };
    }
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
    }
  };

  return (
    <div className="booking-s2-addon-container">
      <style>{`@keyframes adspin { to { transform: rotate(360deg); } }`}</style>
      <h3 className="booking-s2-addon-title">Addons</h3>

      {loading && (
        <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", padding: 24, minHeight: 180 }}>
          <div
            aria-label="Loading addons"
            style={{
              width: 36,
              height: 36,
              border: "3px solid #e5e7eb",
              borderTopColor: "#339af0",
              borderRadius: "50%",
              animation: "adspin 0.8s linear infinite",
            }}
          />
        </div>
      )}

      {!loading && error && (
        <div className="booking-s2-addon-empty">Failed to load add-ons</div>
      )}

      <div className="booking-s2-addon-grid">
      {!loading && !error && (!Array.isArray(addonsList) || addonsList.length === 0) ? (
        <div className="booking-s2-addon-empty">No Add-ons available</div>
      ) : !loading && !error && addonsList.map((addon) => {
        const count = getCount(addon.id);
        const displayPrice =
          addon?.pricings && addon.pricings.length > 0
            ? parseFloat(addon.pricings[0]?.price || addon.price || 0)
            : addon.price || 0;

        return (
          <div key={addon.id} className="addon-card">
            <div className="addon-card-hero">
              <img src={addon.image || fallbackImg} alt={addon.name} />
            </div>
            <div className="addon-card-header">
              <div>
                <div className="addon-card-title">{addon.name}</div>
                {addon.addon_type && (
                  <span className="booking-s2-addon-chip">
                    {addon.addon_type}
                    {addon.is_per_person ? " • per person" : ""}
                  </span>
                )}
              </div>
            </div>
            {Array.isArray(addon.images) && addon.images.length > 0 && (
              <div className="addon-card-img-row">
                {(() => {
                  const imgs = addon.images.slice(0, 3).map((im) => im?.image).filter(Boolean);
                  while (imgs.length < 3) imgs.push(addon.image || fallbackImg);
                  return imgs.slice(0, 3).map((src, idx) => (
                    <div key={idx} className="addon-card-img-thumb">
                      <img src={src || fallbackImg} alt={`${addon.name}-${idx + 1}`} />
                    </div>
                  ));
                })()}
              </div>
            )}
            <div className="addon-card-footer">
              <div className="addon-card-footer-left">
                {displayPrice ? `₹${displayPrice}` : "0"}
              </div>
              <div className="addon-card-footer-right">
                {count <= 0 ? (
                  <button
                    className="booking-s2-addon-add-btn"
                    onClick={() => {
                      dispatch(
                        updateAddonCount({
                          id: addon.id,
                          name: addon.name,
                          price: displayPrice,
                          change: +1,
                        })
                      );
                      recalcSummary();
                    }}
                  >
                    Add
                  </button>
                ) : (
                  <>
                    <button
                      className="booking-s2-addon-btn booking-s2-addon-btn-minus"
                      onClick={() => {
                        dispatch(
                          updateAddonCount({
                            id: addon.id,
                            name: addon.name,
                            price: displayPrice,
                            change: -1,
                          })
                        );
                    recalcSummary();
                      }}
                    >
                      −
                    </button>
                    <span className="booking-s2-addon-count">{count}</span>
                    <button
                      className="booking-s2-addon-btn booking-s2-addon-btn-plus"
                      onClick={() => {
                        dispatch(
                          updateAddonCount({
                            id: addon.id,
                            name: addon.name,
                            price: displayPrice,
                            change: +1,
                          })
                        );
                    recalcSummary();
                      }}
                    >
                      +
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
}

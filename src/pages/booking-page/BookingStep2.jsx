import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { selectPackage as selectPkg, setPromoCode } from "../../features/booking/bookingSlice";
import { postBookingSummaryAction } from "../../redux/UserActions";
import { toast } from "react-toastify";

import BookingTickets from "../../components/book-page/step-2/BookingTickets";
import BookingAddons from "../../components/book-page/step-2/BookingAddons";
import BookingDetails from "../../components/book-page/step-2/BookingDetails";
import BookingRooms from "../../components/book-page/step-2/BookingRooms";
import BookingVip from "../../components/book-page/step-2/BookingVip";

import "./BookingStep2.css";

export default function BookingStep2() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const booking = useSelector((s) => s.booking);
  const [activeTab, setActiveTab] = useState("tickets"); // tickets | resort | vip | promo | addons
  const hasTickets =
    Array.isArray(booking?.selectedTickets) &&
    booking.selectedTickets.some(
      (t) => (t?.counts?.adult || 0) + (t?.counts?.child || 0) + (t?.counts?.senior || 0) > 0
    );
  const hasResortOrVip = ["resort", "vip"].includes(booking?.package?.category);
  const hasAddons = (booking?.addons || []).some((a) => (a.count || 0) > 0);
  const fmt = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = d.getDate();
    const mon = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${mon}, ${year}`;
  };

  const addonsTotal = useMemo(
    () =>
      (booking.addons || []).reduce(
        (sum, a) => sum + (a.price || 0) * (a.count || 0),
        0
      ),
    [booking.addons]
  );
  const ticketsTotal = useMemo(() => {
    const list = Array.isArray(booking?.selectedTickets) ? booking.selectedTickets : [];
    return list.reduce((sum, t) => {
      const p = t?.pricing || {};
      const ap = parseFloat(p.adult_price || 0) || 0;
      const cp = parseFloat(p.child_price || 0) || 0;
      const sp = parseFloat(p.senior_price || 0) || 0;
      const gp = parseFloat(p.group_price || 0) || 0;
      const c = t?.counts || {};
      return sum + ap * (c.adult || 0) + cp * (c.child || 0) + sp * (c.senior || 0) + gp * (c.group || 0);
    }, 0);
  }, [booking?.selectedTickets]);
  const packagePrice = parseFloat(booking?.package?.price || 0) || 0;
  const resortTotal = useMemo(() => {
    const r = booking?.selectedResort;
    if (!r) return 0;
    const base = parseFloat(r.price || 0) || 0;
    const pa = r?.pricing || {};
    const eap = parseFloat(pa.extra_adult_price || 0) || 0;
    const ecp = parseFloat(pa.extra_child_price || 0) || 0;
    const c = r?.counts || {};
    return base + eap * (c.adult || 0) + ecp * (c.child || 0);
  }, [booking?.selectedResort]);
  const vipTotal = useMemo(() => {
    const v = booking?.selectedVip;
    if (!v) return 0;
    const base = parseFloat(v.price || 0) || 0;
    const p = v?.pricing || {};
    const eap = parseFloat(p.extra_adult_price || 0) || 0;
    const ecp = parseFloat(p.extra_child_price || 0) || 0;
    const esp = parseFloat(p.extra_senior_price || 0) || 0;
    const c = v?.counts || {};
    const incA = parseInt(p?.included_adults ?? 0, 10) || 0;
    const incC = parseInt(p?.included_children ?? 0, 10) || 0;
    const incS = parseInt(p?.included_seniors ?? 0, 10) || 0;
    const extraA = Math.max(0, (c.adult || 0) - incA);
    const extraC = Math.max(0, (c.child || 0) - incC);
    const extraS = Math.max(0, (c.senior || 0) - incS);
    return base + eap * extraA + ecp * extraC + esp * extraS;
  }, [booking?.selectedVip]);
  const grandTotal = ticketsTotal + addonsTotal + packagePrice + resortTotal + vipTotal;

  useEffect(() => {
    const currentCategory = booking?.package?.category;
    if (!currentCategory) {
      const isWaterpark = booking?.checkIn && booking?.checkOut === null;
      if (isWaterpark) {
        setActiveTab("tickets");
        dispatch(
          selectPkg({
            category: "waterpark",
            packageType: "Water Park",
            roomType: null,
            price: 0,
          })
        );
      } else if (booking?.checkIn && booking?.checkOut) {
        setActiveTab("resort");
        dispatch(
          selectPkg({
            category: "resort",
            packageType: "Resort Stay",
            roomType: null,
            price: 0,
          })
        );
      }
    } else {
      if (currentCategory === "waterpark") {
        setActiveTab("tickets");
      } else if (currentCategory === "resort") {
        setActiveTab("resort");
      } else if (currentCategory === "vip") {
        setActiveTab("vip");
      }
    }
  }, [booking?.package?.category, booking?.checkIn, booking?.checkOut, dispatch]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab");
    if (tabParam === "addons") {
      if (booking?.package?.category === "resort") {
        navigate("/book/summary", { replace: true });
      } else {
        setActiveTab("addons");
      }
    } else if (tabParam === "tickets") {
      handleTab("tickets");
    } else if (tabParam === "resort") {
      handleTab("resort");
    } else if (tabParam === "vip") {
      handleTab("vip");
    } else if (tabParam === "promo") {
      setActiveTab("promo");
    }
  }, [location.search]);

  const handleTab = (tab) => {
    const ticketsSelected =
      Array.isArray(booking?.selectedTickets) &&
      booking.selectedTickets.some(
        (t) =>
          (t?.counts?.adult || 0) +
          (t?.counts?.child || 0) +
          (t?.counts?.senior || 0) +
          (t?.counts?.group || 0) >
          0
      );
    const resortSelected = !!booking?.selectedResort?.id;
    const vipSelected = !!booking?.selectedVip?.id;
    const resortOrVipSelected = resortSelected || vipSelected;

    if (tab === "vip" && resortSelected) {
      toast.error("You already selected Resort Stay. Remove it to add VIP.");
      return;
    }
    if (tab === "resort" && vipSelected) {
      toast.error("You already selected VIP Package. Remove it to add Resort.");
      return;
    }
    if ((tab === "resort" || tab === "vip") && ticketsSelected) {
      toast.error("You already selected Water Park ticket. Remove it to add Rooms or VIP.");
      return;
    }

    if (tab === "tickets" && resortOrVipSelected) {
      toast.error("You already selected Rooms/VIP. Remove it to add Water Park.");
      return;
    }

    setActiveTab(tab);
    if (tab === "tickets") {
      dispatch(
        selectPkg({
          category: "waterpark",
          packageType: "Water Park",
          roomType: null,
          price: 0,
        })
      );
    } else if (tab === "resort") {
      dispatch(
        selectPkg({
          category: "resort",
          packageType: "Resort Stay",
          roomType: null,
          price: 0,
        })
      );
    } else if (tab === "vip") {
      dispatch(
        selectPkg({
          category: "vip",
          packageType: "VIP Experience",
          roomType: null,
          price: 0,
        })
      );
    }
  };

  const buildSummaryPayload = (promo) => {
    const category = booking?.package?.category;
    if (!category) return null;
    const bt =
      category === "waterpark"
        ? "water_park"
        : category === "vip"
          ? "combo"
          : category === "resort"
            ? "room"
            : "";
    const fmtISO = (iso) => {
      if (!iso) return null;
      const d = new Date(iso);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    };
    let payload = {
      booking_type: bt,
      coupon_code: promo || undefined,
    };
    if (category === "waterpark") {
      payload = {
        ...payload,
        visit_date: booking?.checkIn || null,
        addons: (booking?.addons || []).map((a) => ({
          addon_id: a.id,
          quantity: a.count || 0,
        })),
      };
      const tList = Array.isArray(booking?.selectedTickets) ? booking.selectedTickets : [];
      const active = tList.find((t) => {
        const c = t?.counts || {};
        return (c.adult || 0) + (c.child || 0) + (c.senior || 0) + (c.group || 0) > 0;
      });
      if (!active) return "waterpark_no_ticket";
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
      if (!r?.id) return "resort_no_room";
      const c = r?.counts || {};
      payload = {
        ...payload,
        check_in: fmtISO(booking?.checkIn) || null,
        check_out: fmtISO(booking?.checkOut || booking?.checkIn) || null,
        room_id: r.id,
        room_category_id: r.id,
        meal_plan: r?.pricing?.meal_plan || "room_only",
        adults: c.adult || 0,
        children: c.child || 0,
      };
    } else if (category === "vip") {
      const v = booking?.selectedVip;
      if (!v?.id) return "vip_no_pkg";
      payload = {
        ...payload,
        visit_date: booking?.checkIn || null,
        addons: (booking?.addons || []).map((a) => ({
          addon_id: a.id,
          quantity: a.count || 0,
        })),
        package_id: v.id,
        adults: v.counts?.adult || 0,
        children: v.counts?.child || 0,
        seniors: v.counts?.senior || 0,
      };
    }
    return payload;
  };

  const handleApplyPromo = async () => {
    if (!booking?.promoCode || booking.promoCode.trim() === "") {
      toast.error("Please enter promo code");
      return;
    }
    const payloadOrErr = buildSummaryPayload(booking.promoCode);
    if (!payloadOrErr || typeof payloadOrErr === "string") {
      if (payloadOrErr === "waterpark_no_ticket") toast.warn("Add a ticket to apply promo");
      else if (payloadOrErr === "resort_no_room") toast.warn("Select a room to apply promo");
      else if (payloadOrErr === "vip_no_pkg") toast.warn("Select a VIP package to apply promo");
      else toast.warn("Select a package first");
      return;
    }
    const result = await dispatch(postBookingSummaryAction(payloadOrErr));
    if (result?.ok) {
      toast.success("Promo code applied");
    } else {
      const msg = Array.isArray(result?.data) ? result.data.join(", ") : result?.data?.detail || "Summary failed";
      toast.error(msg);
    }
  };

  const handleRemovePromo = async () => {
    if (!booking?.promoCode || booking.promoCode.trim() === "") {
      toast.error("Please enter promo code");
      return;
    }
    dispatch(setPromoCode(null));
    const payloadOrErr = buildSummaryPayload(null);
    if (payloadOrErr && typeof payloadOrErr !== "string") {
      await dispatch(postBookingSummaryAction(payloadOrErr));
    }
    toast.info("Promo code removed");
  };

  const [showDetails, setShowDetails] = useState(false);
  const summary = booking?.summary;
  const detailLines = useMemo(() => {
    const items = Array.isArray(summary?.items) ? summary.items : [];
    const lines = [];
    items.forEach((it) => {
      const baseLabel = it.name || it.item_type || "Item";
      if (it.item_type === "room" || it.nights) {
        const nights = it.nights || (Array.isArray(it.breakdown) ? it.breakdown.length : 0) || 0;
        const rooms = it.rooms || 1;
        const itemTotal = parseFloat(it.total ?? 0) || 0;
        const meal = it.breakdown && it.breakdown[0]?.meal_plan ? ` • ${it.breakdown[0].meal_plan.replace("_", " ")}` : "";
        const label = `${baseLabel} • ${nights} night${nights === 1 ? "" : "s"} • ${rooms} room${rooms === 1 ? "" : "s"}${meal}`;
        lines.push({ label, qty: null, amount: itemTotal });
      } else {
        const adults = it.adults || 0;
        const children = it.children || 0;
        const seniors = it.seniors || 0;
        const group = it.group || 0;
        const qty = (adults || 0) + (children || 0) + (seniors || 0) + (group || 0) + (it.quantity || 0);
        const adultAmt = parseFloat(it.adult_total ?? 0) || 0;
        const childAmt = parseFloat(it.child_total ?? 0) || 0;
        const seniorAmt = parseFloat(it.senior_total ?? 0) || 0;
        const itemTotal = parseFloat(it.item_total ?? it.total ?? 0) || 0;
        if (adults > 0 || adultAmt > 0) lines.push({ label: `${baseLabel} • Adult`, qty: adults, amount: adultAmt });
        if (children > 0 || childAmt > 0) lines.push({ label: `${baseLabel} • Child`, qty: children, amount: childAmt });
        if (seniors > 0 || seniorAmt > 0) lines.push({ label: `${baseLabel} • Senior`, qty: seniors, amount: seniorAmt });
        if (group > 0) {
          const grpAmt = parseFloat(it.group_total ?? 0) || 0;
          lines.push({ label: `${baseLabel} • Group`, qty: group, amount: grpAmt });
        }
        if (qty > 0 || itemTotal > 0) lines.push({ label: `${baseLabel} • Total`, qty, amount: itemTotal });
      }
    });
    return lines;
  }, [summary]);
  const summaryTotal = useMemo(() => {
    const amt = summary?.payable_amount ?? summary?.total_amount ?? 0;
    return parseFloat(amt) || 0;
  }, [summary]);

  return (
    <div className="booking-s2-container">
      <div className="s2-header">
        <div className="s2-date-pill">
          <span className="material-symbols-rounded s2-date-ico">calendar_month</span>
          {booking?.checkIn && booking?.checkOut ? (
            <span>{fmt(booking.checkIn)} • {fmt(booking.checkOut)}</span>
          ) : booking?.checkIn ? (
            <span>{fmt(booking.checkIn)}</span>
          ) : (
            <span>Select date</span>
          )}
        </div>
        {/* Top Stepper */}
        <div className="s2-stepper">
          {(() => {
            const goToProduct = () => {
              const cat = booking?.package?.category;
              const tab = cat === "resort" ? "resort" : cat === "vip" ? "vip" : "tickets";
              setActiveTab(tab);
              const params = new URLSearchParams(window.location.search);
              params.set("tab", tab);
              navigate(`/book/packages?${params.toString()}`, { replace: true });
            };
            return (
              <div
                className={`s2-step ${["tickets", "resort", "vip"].includes(activeTab) ? "active" : (hasTickets || hasResortOrVip) ? "done" : ""}`}
                onClick={goToProduct}
              >
                <span className="material-symbols-rounded s2-step-ico">confirmation_number</span>
                Tickets
              </div>
            );
          })()}
          {booking?.package?.category !== "resort" && (
            <div
              className={`s2-step ${activeTab === "addons" ? "active" : hasAddons ? "done" : ""}`}
              onClick={() => {
                setActiveTab("addons");
                const params = new URLSearchParams(window.location.search);
                params.set("tab", "addons");
                navigate(`/book/packages?${params.toString()}`, { replace: true });
              }}
            >
              <span className="material-symbols-rounded s2-step-ico">add_circle</span>
              Add-ons
            </div>
          )}
          <div
            className={`s2-step ${!(hasTickets || hasResortOrVip) ? "disabled" : ""}`}
            onClick={() => (hasTickets || hasResortOrVip) && navigate("/book/summary")}
            title={!(hasTickets || hasResortOrVip) ? "Select a waterpark ticket or a resort/VIP package" : ""}
          >
            <span className="material-symbols-rounded s2-step-ico">receipt_long</span>
            Summary
          </div>
        </div>
      </div>
      <div className="s2-tabs-divider" />

      <div className="booking-s2-grid">
        <div className="booking-s2-left">
          <div className="s2-content-hero">
            <div className="s2-content-inner">
              {activeTab !== "addons" && (
                <div className="s2-option-tabs">
                  <button
                    className={`s2-option-tab ${activeTab === "tickets" ? "active" : ""}`}
                    onClick={() => handleTab("tickets")}
                  >
                    <span className="material-symbols-rounded">confirmation_number</span>
                    Waterpark
                  </button>
                  <button
                    className={`s2-option-tab ${activeTab === "resort" ? "active" : ""}`}
                    onClick={() => handleTab("resort")}
                  >
                    <span className="material-symbols-rounded">hotel</span>
                    Resort Stay
                  </button>
                  <button
                    className={`s2-option-tab ${activeTab === "vip" ? "active" : ""}`}
                    onClick={() => handleTab("vip")}
                  >
                    <span className="material-symbols-rounded">workspace_premium</span>
                    VIP Packages
                  </button>
                  <button
                    className={`s2-option-tab ${activeTab === "promo" ? "active" : ""}`}
                    onClick={() => setActiveTab("promo")}
                  >
                    <span className="material-symbols-rounded">sell</span>
                    Promo Code
                  </button>
                </div>
              )}

              {activeTab === "tickets" && <BookingTickets />}
              {activeTab === "resort" && <BookingRooms />}
              {activeTab === "vip" && <BookingVip />}
              {activeTab === "promo" && (
                <div className="s2-promo-card">
                  <label className="s2-promo-label">Enter Promo Code</label>
                  <div className="s2-promo-row">
                    <input
                      className="s2-promo-input"
                      placeholder="Apply coupon"
                      value={booking?.promoCode || ""}
                      onChange={(e) => dispatch(setPromoCode(e.target.value))}
                    />
                    <button
                      className="s2-promo-btn"
                      onClick={handleApplyPromo}
                    >
                      Apply
                    </button>
                    <button
                      className="s2-promo-btn s2-promo-btn-danger"
                      onClick={handleRemovePromo}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
              {activeTab === "addons" && booking?.package?.category !== "resort" && <BookingAddons />}
            </div>
          </div>
        </div>

        <div className="booking-s2-right">{/* intentionally empty in new layout */}</div>
      </div>

      <div className="s2-bottom-bar">
        <div className="s2-bottom-info simple">
          <div className="s2-bottom-left">
            <div className="s2-bottom-amount">₹{summaryTotal.toFixed(2)}</div>
            <button
              className="s2-view-link"
              onClick={() => setShowDetails((v) => !v)}
              disabled={!(hasTickets || hasResortOrVip)}
              title={!(hasTickets || hasResortOrVip) ? "Select a waterpark ticket or a resort/VIP package" : ""}
            >
              View Details
            </button>
            {showDetails && (hasTickets || hasResortOrVip) && (
              <div className="s2-order-popover s2-order-popover-left">
                <div className="s2-order-popover-header">Order details</div>
                <div className="s2-order-popover-body">
                  {detailLines.length === 0 ? (
                    <div className="s2-order-line">
                      <span className="s2-order-name">No items</span>
                      <span className="s2-order-amt">₹0</span>
                    </div>
                  ) : (
                    detailLines.map((l, i) => (
                      <div key={i} className="s2-order-line">
                        <div className="s2-order-left">
                          <span className="s2-order-name">{l.label}</span>
                          {l.qty ? <span className="s2-order-qty">× {l.qty}</span> : null}
                        </div>
                        <span className="s2-order-amt">₹{parseFloat(l.amount || 0).toFixed(2)}</span>
                      </div>
                    ))
                  )}
                  <div className="s2-order-sep" />
                  <div className="s2-order-total">
                    <span>Order Total (Excl. all taxes)</span>
                    <span>₹{summaryTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="s2-bottom-actions">
          <button
            className={`s2-next-btn ${!(hasTickets || hasResortOrVip) ? "disabled" : ""}`}
            onClick={() => {
              if (!(hasTickets || hasResortOrVip)) return;
              if (activeTab === "addons") {
                navigate("/book/summary"); 
              } else {
                if (booking?.package?.category === "resort") {
                  navigate("/book/summary");
                } else {
                  setActiveTab("addons");
                  const params = new URLSearchParams(window.location.search);
                  params.set("tab", "addons");
                  navigate(`/book/packages?${params.toString()}`, { replace: true });
                }
              }
            }}
            title={!(hasTickets || hasResortOrVip) ? "Select a waterpark ticket or a resort/VIP package" : "Next"}
          >
            Next <span className="material-symbols-rounded">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}

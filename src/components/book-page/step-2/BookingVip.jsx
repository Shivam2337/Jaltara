import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPackagesListAction, postBookingSummaryAction } from "../../../redux/UserActions";
import { setSelectedVip, setBookingSummary } from "../../../features/booking/bookingSlice";
import "./BookingVip.css";
import fallbackImg from "../../../assets/images/Cottage 2.jpg";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import waterParkImg from "../../../assets/waterpark.jpg";
export default function BookingVip() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: pkgs = [], loading, error } =
    useSelector((s) => s.userPackagesList) || { list: [], loading: false, error: null };
  const booking = useSelector((s) => s.booking);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [counts, setCounts] = useState({ adult: 0, child: 0, senior: 0 });
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsPkg, setDetailsPkg] = useState(null);

  useEffect(() => {
    dispatch(getPackagesListAction());
  }, [dispatch]);

  const openDrawer = (pkg) => {
    setSelectedPkg(pkg);
    const savedTotals =
      booking?.selectedVip && booking.selectedVip.id === pkg.id
        ? booking.selectedVip.counts
        : null;
    if (savedTotals) {
      const incA = parseInt(pkg?.pricing?.included_adults ?? 0, 10) || 0;
      const incC = parseInt(pkg?.pricing?.included_children ?? 0, 10) || 0;
      const incS = parseInt(pkg?.pricing?.included_seniors ?? 0, 10) || 0;
      setCounts({
        adult: Math.max(0, (savedTotals.adult || 0) - incA),
        child: Math.max(0, (savedTotals.child || 0) - incC),
        senior: Math.max(0, (savedTotals.senior || 0) - incS),
      });
    } else {
      setCounts({ adult: 0, child: 0, senior: 0 });
    }
    setDrawerOpen(true);
  };
  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedPkg(null);
  };
  const changeCount = (type, delta) => {
    setCounts((c) => {
      const v = Math.max(0, (c[type] || 0) + delta);
      return { ...c, [type]: v };
    });
  };
  const addOrRemoveSelection = () => {
    if (!selectedPkg) return;
    const existing = booking?.selectedVip;
    if (existing && existing.id !== selectedPkg.id) {
      toast.error("Already one VIP package is added. Remove it, then add another.");
      return;
    }
    if (existing && existing.id === selectedPkg.id) {
      dispatch(setSelectedVip(null));
      dispatch(setBookingSummary(null));
      setCounts({ adult: 0, child: 0, senior: 0 });
      toast.info("VIP package removed");
      return;
    }
    const incA = parseInt(selectedPkg?.pricing?.included_adults ?? 0, 10) || 0;
    const incC = parseInt(selectedPkg?.pricing?.included_children ?? 0, 10) || 0;
    const incS = parseInt(selectedPkg?.pricing?.included_seniors ?? 0, 10) || 0;
    const extraA = counts?.adult || 0;
    const extraC = counts?.child || 0;
    const extraS = counts?.senior || 0;
    const payload = {
      id: selectedPkg.id,
      name: selectedPkg.name,
      price: parseFloat(selectedPkg.price || 0) || 0,
      counts: { adult: incA + extraA, child: incC + extraC, senior: incS + extraS },
      pricing: selectedPkg.pricing || {},
    };
    dispatch(setSelectedVip(payload));
    toast.success("Added");
  };

  const continueSummary = async () => {
    const sel = booking?.selectedVip;
    if (!selectedPkg || !sel || sel.id !== selectedPkg.id) {
      toast.warn("Add the VIP package first");
      return;
    }
    const incA = parseInt(selectedPkg?.pricing?.included_adults ?? 0, 10) || 0;
    const incC = parseInt(selectedPkg?.pricing?.included_children ?? 0, 10) || 0;
    const incS = parseInt(selectedPkg?.pricing?.included_seniors ?? 0, 10) || 0;
    const extraA = counts?.adult || 0;
    const extraC = counts?.child || 0;
    const extraS = counts?.senior || 0;
    const totA = incA + extraA;
    const totC = incC + extraC;
    const totS = incS + extraS;
    const bt = "combo";
    if (sel && sel.id === selectedPkg.id) {
      dispatch(
        setSelectedVip({
          ...sel,
          counts: { adult: totA, child: totC, senior: totS },
        })
      );
    }
    const summaryPayload = {
      booking_type: bt,
      visit_date: booking?.checkIn || null,
      package_id: selectedPkg.id,
      adults: totA,
      children: totC,
      seniors: totS,
      coupon_code: booking?.promoCode || undefined,
      addons: (booking?.addons || []).map((a) => ({
        addon_id: a.id,
        quantity: a.count || 0,
      })),
    };
    const result = await dispatch(postBookingSummaryAction(summaryPayload));
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
    <div className="vip-grid">
      <style>{`@keyframes pgspin { to { transform: rotate(360deg); } }`}</style>
      {loading && (
        <div style={{ gridColumn: "1 / -1", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", padding: 24, minHeight: 180 }}>
          <div
            aria-label="Loading packages"
            style={{
              width: 36,
              height: 36,
              border: "3px solid #e5e7eb",
              borderTopColor: "#339af0",
              borderRadius: "50%",
              animation: "pgspin 0.8s linear infinite",
            }}
          />
        </div>
      )}

      {!loading && error && (
        <div className="booking-s2-addon-empty">Failed to load packages</div>
      )}

      {!loading && !error && pkgs.length === 0 && (
        <div className="booking-s2-addon-empty">No packages available</div>
      )}

      {!loading && !error && pkgs.map((p) => {
        const hasPrimary = Array.isArray(p.images) && p.images.some(im => im?.is_primary);
        const img = hasPrimary ? (p.images.find(im => im?.is_primary)?.image) : fallbackImg;
        const base = p.price || 0;
        const subtitle = p.package_type
          ? p.package_type.replace("_", " ")
          : "package";
        const isSelected = booking?.selectedVip && booking.selectedVip.id === p.id;
        return (
          <div key={p.id} className="vip-card">
            <div className="vip-card-img">
              <img src={img} alt={p.name} />
            </div>
            <div className="vip-card-body">
              <h4 className="vip-card-title">{p.name}</h4>
              <div className="vip-chip-row">
                <span className="chip chip-vip">{subtitle}</span>
                {p.duration_hours ? <span className="chip chip-gray">{p.duration_hours} hrs</span> : null}
                {/* {p.max_adults !== undefined && p.max_adults !== null ? ( */}
                  <span className="chip chip-gray">{p.max_adults || 0} Adults</span>
                {/* ) : null} */}
                {/* {p.max_children !== undefined && p.max_children !== null ? ( */}
                  <span className="chip chip-gray">{p.max_children || 0} Childs</span>
                {/* ) : null} */}
              </div>
              
              <div className="vip-card-row">
                <span className="vip-card-price">₹{parseFloat(base || 0) || 0}</span>
                <div className="vip-card-actions">
                  <button
                    type="button"
                    className="vip-card-link"
                    onClick={() => {
                      setDetailsPkg(p);
                      setDetailsOpen(true);
                    }}
                  >
                    View details
                  </button>
                  <button className="vip-card-btn" onClick={() => openDrawer(p)}>
                    {isSelected ? "Added" : "Add"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {detailsOpen && detailsPkg && (
        <div className="vip-modal-overlay" onClick={() => setDetailsOpen(false)}>
          <div className="vip-modal" onClick={(e) => e.stopPropagation()}>
            <div className="vip-modal-header">
              <h4 className="vip-modal-title">{detailsPkg.name}</h4>
              <span className="material-symbols-rounded vip-modal-close" onClick={() => setDetailsOpen(false)}>
                close
              </span>
            </div>
            <div className="vip-modal-body">
              <p className="vip-modal-desc">{detailsPkg.description || "No description available."}</p>
              <div className="vip-modal-items">
                {(detailsPkg.items || []).map((it, i) => (
                  <div key={i} className="vip-item-row">
                    <span className="vip-item-type">{it.item_type}</span>
                    <span className="vip-item-name">
                      {it.ticket_type_name || it.room_category_name || ""}
                      <span className="vip-item-meta">
                        {it.ticket_type ? `Ticket Type: ${it.ticket_type}` : ""}
                        {it.room_category ? `${it.ticket_type ? " • " : ""}Room Category: ${it.room_category}` : ""}
                        {it.ride ? `${(it.ticket_type || it.room_category) ? " • " : ""}Ride: ${it.ride}` : ""}
                      </span>
                    </span>
                    <span className="vip-item-qty">×{it.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="vip-modal-images">
                {(detailsPkg.images && detailsPkg.images.length > 0
                  ? detailsPkg.images
                  : [{ image: fallbackImg }]).map((im, i) => (
                  <div key={i} className="vip-modal-img-wrap">
                    <img src={im.image || fallbackImg} alt={`pkg-${i}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {drawerOpen && selectedPkg && (
        <div className="vip-drawer-overlay" onClick={closeDrawer}>
          <div className="vip-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="vip-drawer-header">
              <h4 className="vip-drawer-title">{selectedPkg.name}</h4>
              <span className="material-symbols-rounded vip-drawer-close" onClick={closeDrawer}>
                close
              </span>
            </div>
            <div className="vip-drawer-content">
              <div className="vip-drawer-row">
                <div className="vip-drawer-row-left">
                  <span className="vip-drawer-label">INCLUDED</span>
                  <span className="vip-drawer-price">
                    ₹{parseFloat(selectedPkg?.pricing?.base_price ?? selectedPkg?.price ?? 0).toFixed(2)}
                  </span>
                  <span className="vip-drawer-included-meta">
                    A {selectedPkg?.pricing?.included_adults ?? 0} • C {selectedPkg?.pricing?.included_children ?? 0} • S {selectedPkg?.pricing?.included_seniors ?? 0}
                  </span>
                </div>
                <div className="vip-drawer-counter">
                  <button className="vip-drawer-add-btn" onClick={addOrRemoveSelection}>
                    {booking?.selectedVip && booking.selectedVip.id === selectedPkg.id ? "Remove" : "Add"}
                  </button>
                </div>
              </div>
              <div className="vip-drawer-row">
                <div className="vip-drawer-row-left">
                  <span className="vip-drawer-label">EXTRA ADULT</span>
                  <span className="vip-drawer-price">
                    ₹{parseFloat(selectedPkg?.pricing?.extra_adult_price || 0)}
                  </span>
                </div>
                <div className="vip-drawer-counter">
                  <button onClick={() => changeCount("adult", -1)} className="vip-drawer-btn">−</button>
                  <span className="vip-drawer-count">{counts.adult}</span>
                  <button onClick={() => changeCount("adult", 1)} className="vip-drawer-btn">+</button>
                </div>
              </div>
              <div className="vip-drawer-row">
                <div className="vip-drawer-row-left">
                  <span className="vip-drawer-label">EXTRA CHILD</span>
                  <span className="vip-drawer-price">
                    ₹{parseFloat(selectedPkg?.pricing?.extra_child_price || 0)}
                  </span>
                </div>
                <div className="vip-drawer-counter">
                  <button onClick={() => changeCount("child", -1)} className="vip-drawer-btn">−</button>
                  <span className="vip-drawer-count">{counts.child}</span>
                  <button onClick={() => changeCount("child", 1)} className="vip-drawer-btn">+</button>
                </div>
              </div>
              <div className="vip-drawer-row">
                <div className="vip-drawer-row-left">
                  <span className="vip-drawer-label">EXTRA SENIOR</span>
                  <span className="vip-drawer-price">
                    ₹{parseFloat(selectedPkg?.pricing?.extra_senior_price || 0)}
                  </span>
                </div>
                <div className="vip-drawer-counter">
                  <button onClick={() => changeCount("senior", -1)} className="vip-drawer-btn">−</button>
                  <span className="vip-drawer-count">{counts.senior}</span>
                  <button onClick={() => changeCount("senior", 1)} className="vip-drawer-btn">+</button>
                </div>
              </div>
            </div>
            <div className="vip-drawer-footer">
              <button className="vip-drawer-confirm" onClick={continueSummary}>Continue</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

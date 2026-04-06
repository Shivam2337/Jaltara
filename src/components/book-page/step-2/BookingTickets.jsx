import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { selectPackage, upsertSelectedTicket, setBookingSummary } from "../../../features/booking/bookingSlice";
import { getTicketsListAction } from "../../../redux/UserActions";
import { toast } from "react-toastify";
import { postBookingSummaryAction } from "../../../redux/UserActions";
import { useNavigate } from "react-router-dom";

import img_1 from "./../../../assets/images/Cottage 1.jpg";
import img_2 from "./../../../assets/images/Cottage 2.jpg";
import waterParkImg from "../../../assets/waterpark.jpg";
import "./BookingTickets.css";

export default function BookingTickets() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const booking = useSelector((state) => state.booking);

  const { package: selectedPackage } = booking;

  const category = selectedPackage?.category;

  const { list: waterparkTickets = [], loading, error } =
    useSelector((s) => s.userTickets) || { list: [], loading: false, error: null };
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [counts, setCounts] = useState({ adult: 0, child: 0, senior: 0, group: 0 });

  useEffect(() => {
    if (category === "waterpark") {
      dispatch(getTicketsListAction());
    }
  }, [category, dispatch]);

  const handleSelect = (pkg) => {
    dispatch(
      selectPackage({
        category: pkg.category,
        packageType: pkg.packageType,
        roomType: pkg.roomType,
        price: 0,
      })
    );
  };

  const openDrawer = (ticket) => {
    const list = Array.isArray(booking?.selectedTickets) ? booking.selectedTickets : [];
    const saved = list.find((t) => t.id === ticket.id);
    setSelectedTicket(ticket);
    setCounts(saved?.counts || { adult: 0, child: 0, senior: 0, group: 0 });
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedTicket(null);
  };

  const changeCount = (type, delta) => {
    setCounts((c) => {
      const v = Math.max(0, (c[type] || 0) + delta);
      return { ...c, [type]: v };
    });
  };

  const confirmSelection = async () => {
    if (selectedTicket) {
      const currentList = Array.isArray(booking?.selectedTickets) ? booking.selectedTickets : [];
      const active = currentList.find((t) => {
        const c = t?.counts || {};
        return (c.adult || 0) + (c.child || 0) + (c.senior || 0) + (c.group || 0) > 0;
      });
      if (active && active.id !== selectedTicket.id) {
        toast.error("Already one ticket is added. Please remove the selected ticket, then add another.");
        return;
      }
      const totalCount = (counts.adult || 0) + (counts.child || 0) + (counts.senior || 0) + (counts.group || 0);
      const minGroup = parseInt(selectedTicket?.pricing?.group_min_size || 0, 10) || 0;
      if ((counts.group || 0) > 0 && (counts.group || 0) < minGroup) {
        toast.error(`Group requires at least ${minGroup} members`);
        return;
      }
      if (totalCount <= 0) {
        toast.error("Please select at least one quantity");
        return;
      }
      await dispatch(
        upsertSelectedTicket({
          id: selectedTicket.id,
          name: selectedTicket.name,
          pricing: selectedTicket.pricing || null,
          counts: { ...counts },
        })
      );
      const summaryPayload = {
        booking_type: "water_park",
        visit_date: booking?.checkIn || null,
        ticket_id: selectedTicket.id,
        adults: counts.adult || 0,
        children: counts.child || 0,
        seniors: counts.senior || 0,
        coupon_code: booking?.promoCode || undefined,
        addons: (booking?.addons || []).map((a) => ({
          addon_id: a.id,
          quantity: a.count || 0,
        })),
      };
      if (!summaryPayload.visit_date) {
        toast.warn("Please select a date before continuing");
      }
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
    }
  };

  return (
    <div className="booking-s3-tickets-container">
      <style>{`@keyframes tgspin { to { transform: rotate(360deg); } }`}</style>
      {category === "waterpark" && (
        <div className="booking-s2-tickets-grid">
          {loading && (
            <div style={{ gridColumn: "1 / -1", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", padding: 24, minHeight: 180 }}>
              <div
                aria-label="Loading tickets"
                style={{
                  width: 36,
                  height: 36,
                  border: "3px solid #e5e7eb",
                  borderTopColor: "#339af0",
                  borderRadius: "50%",
                  animation: "tgspin 0.8s linear infinite",
                }}
              />
            </div>
          )}

          {!loading && error && (
            <div className="booking-s2-addon-empty">Failed to load tickets</div>
          )}

          {!loading && !error && waterparkTickets.length === 0 && (
            <div className="booking-s2-addon-empty">No tickets available</div>
          )}

          {!loading && !error && waterparkTickets.map((t) => {
            const displayPrice = t?.pricing?.adult_price ?? t?.price ?? null;
            const priceNum = displayPrice ? parseFloat(displayPrice) : 0;
            const cardImg = img_1;
            const existing = (Array.isArray(booking?.selectedTickets) ? booking.selectedTickets : []).find((st) => st.id === t.id);
            const existingCount = existing ? ((existing?.counts?.adult || 0) + (existing?.counts?.child || 0) + (existing?.counts?.senior || 0) + (existing?.counts?.group || 0)) : 0;
            return (
              <div key={t.id} className="booking-s2-ticket-card">
                <div className="booking-s2-ticket-card-img">
                  <img src={cardImg} alt={t.name} />
                </div>
                <div className="booking-s2-ticket-card-body">
                  <h4 className="booking-s2-ticket-card-title">{t.name}</h4>
                  <div className="ticket-chip-row">
                    {t.duration_hours ? (
                      <span className="chip chip-ticket">{t.duration_hours} hrs</span>
                    ) : null}
                    <span className="chip chip-gray">
                      {t.includes_meal ? "Meal included" : "No meal"}
                    </span>
                    <span className="chip chip-gray">
                      {t.includes_stay ? "Stay included" : "No stay"}
                    </span>
                  </div>
                  <div className="booking-s2-ticket-card-row">
                    <span className="ticket-card-price">₹{Number.isFinite(priceNum) ? priceNum : 0}</span>
                    <button className="booking-s2-ticket-card-btn" onClick={() => openDrawer(t)}>
                      {existingCount > 0 ? "Added" : "Add"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {drawerOpen && selectedTicket && (
            <div className="ticket-drawer-overlay" onClick={closeDrawer}>
              <div className="ticket-drawer" onClick={(e) => e.stopPropagation()}>
                <div className="ticket-drawer-header">
                  <h4 className="ticket-drawer-title">{selectedTicket.name}</h4>
                  {(() => {
                    const list = Array.isArray(booking?.selectedTickets) ? booking.selectedTickets : [];
                    const current = list.find((t) => t.id === selectedTicket.id);
                    const q =
                      current
                        ? (current?.counts?.adult || 0) +
                          (current?.counts?.child || 0) +
                          (current?.counts?.senior || 0) +
                          (current?.counts?.group || 0)
                        : 0;
                    if (q > 0) {
                      return (
                        <button
                          className="ticket-drawer-remove"
                          onClick={async () => {
                            await dispatch(
                              upsertSelectedTicket({
                                id: selectedTicket.id,
                                name: selectedTicket.name,
                                pricing: selectedTicket.pricing || null,
                                counts: { adult: 0, child: 0, senior: 0, group: 0 },
                              })
                            );
                            dispatch(setBookingSummary(null));
                            toast.info("Removed selected ticket");
                            closeDrawer();
                          }}
                        >
                          Remove
                        </button>
                      );
                    }
                    return null;
                  })()}
                  <span className="material-symbols-rounded ticket-drawer-close" onClick={closeDrawer}>
                    close
                  </span>
                </div>
                <div className="ticket-drawer-content">
                  {parseFloat(selectedTicket?.pricing?.weekend_discount_percent || 0) > 0 && (
                    <div className="ticket-drawer-banner">
                      <span className="material-symbols-rounded">local_offer</span>
                      Weekend discount {parseFloat(selectedTicket.pricing.weekend_discount_percent)}% applies to all tickets
                    </div>
                  )}
                  {selectedTicket?.pricing?.group_price ? (
                    <div className="ticket-drawer-row">
                      <div className="ticket-drawer-row-left">

                        {(() => {
                          const min = parseInt(selectedTicket?.pricing?.group_min_size || 10, 10) || 10;
                          const price = parseFloat(selectedTicket?.pricing?.group_price || 0) || 0;
                          const disc = parseFloat(selectedTicket?.pricing?.group_discount_percent || 10) || 10;
const msg = `🏖️ Bring ${min}+ friends and enjoy ${disc}% off — Group price only ₹${price}!`;
                          return (
                            <span className="ticket-drawer-sublabel">{msg}</span>
                          );
                        })()}
                      </div>
                    </div>
                  ) : null}
                  {selectedTicket?.pricing?.adult_price !== undefined && (
                    <div className="ticket-drawer-row">
                      <div className="ticket-drawer-row-left">
                        <span className="ticket-drawer-label">ADULT</span>
                        <span className="ticket-drawer-price">₹{parseFloat(selectedTicket.pricing.adult_price || 0)}</span>
                      </div>
                      <div className="ticket-drawer-counter">
                        <button onClick={() => changeCount("adult", -1)} className="ticket-drawer-btn">−</button>
                        <span className="ticket-drawer-count">{counts.adult}</span>
                        <button onClick={() => changeCount("adult", 1)} className="ticket-drawer-btn">+</button>
                      </div>
                    </div>
                  )}
                  {selectedTicket?.pricing?.child_price !== undefined && (
                    <div className="ticket-drawer-row">
                      <div className="ticket-drawer-row-left">
                        <span className="ticket-drawer-label">CHILD</span>
                        <span className="ticket-drawer-price">₹{parseFloat(selectedTicket.pricing.child_price || 0)}</span>
                      </div>
                      <div className="ticket-drawer-counter">
                        <button onClick={() => changeCount("child", -1)} className="ticket-drawer-btn">−</button>
                        <span className="ticket-drawer-count">{counts.child}</span>
                        <button onClick={() => changeCount("child", 1)} className="ticket-drawer-btn">+</button>
                      </div>
                    </div>
                  )}
                  {selectedTicket?.pricing?.senior_price !== undefined && (
                    <div className="ticket-drawer-row">
                      <div className="ticket-drawer-row-left">
                        <span className="ticket-drawer-label">SENIOR</span>
                        <span className="ticket-drawer-price">₹{parseFloat(selectedTicket.pricing.senior_price || 0)}</span>
                      </div>
                      <div className="ticket-drawer-counter">
                        <button onClick={() => changeCount("senior", -1)} className="ticket-drawer-btn">−</button>
                        <span className="ticket-drawer-count">{counts.senior}</span>
                        <button onClick={() => changeCount("senior", 1)} className="ticket-drawer-btn">+</button>
                      </div>
                    </div>
                  )}
                  
                </div>
                <div className="ticket-drawer-footer">
                  <button className="ticket-drawer-confirm" onClick={confirmSelection}>Continue</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {(category === "resort" || category === "vip") && (
        <>
          <div className="booking-s2-tickets-r-card-top">
            <h5 className="booking-s2-tickets-r-card-top-heading">
              {selectedPackage?.roomType}
            </h5>
            <p className="booking-s2-tickets-r-card-top-sub-heading">
              {category}
            </p>
          </div>
          <div className="booking-s2-tickets-r-card">
            <p className="booking-s2-tickets-r-card-text">
              Relax in our luxurious resort rooms with modern amenities and
              peaceful surroundings.
            </p>

            <p className="booking-s2-tickets-r-card-heading">Highlights</p>

            <div className="booking-s2-tickets-r-card-img-box">
              <div className="booking-s2-tickets-r-card-img-wrapper">
                <img
                  className="booking-s2-tickets-r-card-img"
                  src={img_1}
                  alt=""
                />
              </div>
              <div className="booking-s2-tickets-r-card-img-wrapper">
                <img
                  className="booking-s2-tickets-r-card-img"
                  src={img_2}
                  alt=""
                />
              </div>
            </div>

            <ul className="booking-s2-tickets-r-card-list">
              <li className="booking-s2-tickets-r-card-list-item">
                Comfortable Stay
              </li>
              <li className="booking-s2-tickets-r-card-list-item">
                Waterpark Access
              </li>
              <li className="booking-s2-tickets-r-card-list-item">
                Dining Facilities
              </li>
              <li className="booking-s2-tickets-r-card-list-item">
                Family Friendly
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

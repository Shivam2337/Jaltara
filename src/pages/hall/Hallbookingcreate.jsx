import { useState, useEffect } from "react";
import "./Hallbookingcreate.css";

const AUDITORIUMS = [
  { id: 1, name: "Main Hall", area: "8,200 sq ft", price: 45000 },
  { id: 2, name: "Conference Centre", area: "4,500 sq ft", price: 28000 },
  { id: 3, name: "Seminar Room A", area: "2,100 sq ft", price: 18000 },
  { id: 4, name: "Boardroom", area: "900 sq ft", price: 12000 },
];

const VALID_COUPONS = {
  HALL10: 10,
  EVENT20: 20,
  SAVE15: 15,
};

const formatINR = (amount) =>
  "₹" + Number(amount).toLocaleString("en-IN", { minimumFractionDigits: 0 });

const today = new Date().toISOString().split("T")[0];

export default function HallBookingCreate() {
  const [form, setForm] = useState({
    auditorium: "",
    event_name: "",
    event_date: "",
    approx_guests: "",
    coupon_code: "",
  });

  const [errors, setErrors] = useState({});
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const selectedAud = AUDITORIUMS.find((a) => a.id === Number(form.auditorium));
  const basePrice = selectedAud ? selectedAud.price : null;
  const discountPct = appliedCoupon ? VALID_COUPONS[appliedCoupon] : 0;
  const discountAmt = basePrice ? Math.round(basePrice * discountPct / 100) : 0;
  const payable = basePrice ? basePrice - discountAmt : null;
  const showSummary = basePrice !== null && form.event_date;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    setCouponError("");
    setAppliedCoupon(null);
    if (!code) return;
    if (VALID_COUPONS[code]) {
      setAppliedCoupon(code);
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code.");
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!form.auditorium) newErrors.auditorium = "Please select an auditorium.";
    if (!form.event_name.trim()) newErrors.event_name = "Event name is required.";
    if (!form.event_date) newErrors.event_date = "Please select a date.";
    if (!form.approx_guests || Number(form.approx_guests) < 1)
      newErrors.approx_guests = "Enter a valid guest count.";
    return newErrors;
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);

    const payload = {
      auditorium: Number(form.auditorium),
      event_name: form.event_name.trim(),
      event_date: form.event_date,
      approx_guests: Number(form.approx_guests),
      coupon_code: appliedCoupon || "",
    };

    try {
      // Replace with your actual API endpoint
      // const res = await fetch("/api/hall-bookings/", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      //   body: JSON.stringify(payload),
      // });
      // if (!res.ok) throw new Error((await res.json()).detail || "Booking failed.");

      // Simulated success
      await new Promise((r) => setTimeout(r, 900));
      showToast("success", "Booking request submitted. Status: pending — awaiting admin confirmation.");
      setForm({ auditorium: "", event_name: "", event_date: "", approx_guests: "", coupon_code: "" });
      setAppliedCoupon(null);
      setCouponInput("");
      setErrors({});
    } catch (err) {
      showToast("error", err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="HallBookingCreate">
      <div className="HallBookingCreate__header">
        <h1 className="HallBookingCreate__title">Book an auditorium</h1>
        <p className="HallBookingCreate__subtitle">
          Reserve a hall for your event. Fields marked <span className="HallBookingCreate__required-star">*</span> are required.
        </p>
      </div>

      <form className="HallBookingCreate__form" onSubmit={handleSubmit} noValidate>

        {/* ── Venue & Event ───────────────────────────────────────────── */}
        <section className="HallBookingCreate__section">
          <p className="HallBookingCreate__section-label">Venue &amp; event</p>

          <div className="HallBookingCreate__field">
            <label className="HallBookingCreate__label" htmlFor="auditorium">
              Auditorium <span className="HallBookingCreate__required-star">*</span>
            </label>
            <div className="HallBookingCreate__select-wrap">
              <select
                className={`HallBookingCreate__select${errors.auditorium ? " HallBookingCreate__input--error" : ""}`}
                id="auditorium"
                name="auditorium"
                value={form.auditorium}
                onChange={handleChange}
              >
                <option value="">Select an auditorium</option>
                {AUDITORIUMS.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} — {a.area}
                  </option>
                ))}
              </select>
              <span className="HallBookingCreate__select-arrow" aria-hidden="true" />
            </div>
            {errors.auditorium && (
              <p className="HallBookingCreate__error-msg">{errors.auditorium}</p>
            )}
          </div>

          <div className="HallBookingCreate__field">
            <label className="HallBookingCreate__label" htmlFor="event_name">
              Event name <span className="HallBookingCreate__required-star">*</span>
            </label>
            <input
              className={`HallBookingCreate__input${errors.event_name ? " HallBookingCreate__input--error" : ""}`}
              type="text"
              id="event_name"
              name="event_name"
              placeholder="e.g. Annual General Meeting"
              value={form.event_name}
              onChange={handleChange}
            />
            {errors.event_name && (
              <p className="HallBookingCreate__error-msg">{errors.event_name}</p>
            )}
          </div>

          <div className="HallBookingCreate__row">
            <div className="HallBookingCreate__field">
              <label className="HallBookingCreate__label" htmlFor="event_date">
                Event date <span className="HallBookingCreate__required-star">*</span>
              </label>
              <input
                className={`HallBookingCreate__input${errors.event_date ? " HallBookingCreate__input--error" : ""}`}
                type="date"
                id="event_date"
                name="event_date"
                min={today}
                value={form.event_date}
                onChange={handleChange}
              />
              {errors.event_date && (
                <p className="HallBookingCreate__error-msg">{errors.event_date}</p>
              )}
            </div>

            <div className="HallBookingCreate__field">
              <label className="HallBookingCreate__label" htmlFor="approx_guests">
                Approx. guests <span className="HallBookingCreate__required-star">*</span>
              </label>
              <input
                className={`HallBookingCreate__input${errors.approx_guests ? " HallBookingCreate__input--error" : ""}`}
                type="number"
                id="approx_guests"
                name="approx_guests"
                placeholder="e.g. 250"
                min="1"
                value={form.approx_guests}
                onChange={handleChange}
              />
              {errors.approx_guests && (
                <p className="HallBookingCreate__error-msg">{errors.approx_guests}</p>
              )}
            </div>
          </div>
        </section>

        <hr className="HallBookingCreate__divider" />

        {/* ── Coupon ──────────────────────────────────────────────────── */}
        <section className="HallBookingCreate__section">
          <p className="HallBookingCreate__section-label">Coupon</p>

          <div className="HallBookingCreate__field">
            <label className="HallBookingCreate__label" htmlFor="coupon_code">
              Coupon code{" "}
              <span className="HallBookingCreate__label-optional">(optional)</span>
            </label>

            {appliedCoupon ? (
              <div className="HallBookingCreate__coupon-applied">
                <span className="HallBookingCreate__coupon-dot" />
                <span className="HallBookingCreate__coupon-text">
                  {appliedCoupon} — {VALID_COUPONS[appliedCoupon]}% off applied
                </span>
                <button
                  type="button"
                  className="HallBookingCreate__coupon-remove"
                  onClick={removeCoupon}
                  aria-label="Remove coupon"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="HallBookingCreate__coupon-row">
                <input
                  className={`HallBookingCreate__input HallBookingCreate__input--coupon${couponError ? " HallBookingCreate__input--error" : ""}`}
                  type="text"
                  id="coupon_code"
                  name="coupon_code"
                  placeholder="Enter code"
                  value={couponInput}
                  onChange={(e) => {
                    setCouponInput(e.target.value.toUpperCase());
                    setCouponError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applyCoupon())}
                />
                <button
                  type="button"
                  className="HallBookingCreate__apply-btn"
                  onClick={applyCoupon}
                >
                  Apply
                </button>
              </div>
            )}

            {couponError && (
              <p className="HallBookingCreate__error-msg">{couponError}</p>
            )}
          </div>
        </section>

        {/* ── Pricing summary ─────────────────────────────────────────── */}
        {showSummary && (
          <div className="HallBookingCreate__summary">
            <div className="HallBookingCreate__summary-row">
              <span>Base price</span>
              <span>{formatINR(basePrice)}</span>
            </div>
            {discountAmt > 0 && (
              <div className="HallBookingCreate__summary-row HallBookingCreate__summary-row--discount">
                <span>Discount ({discountPct}%)</span>
                <span>− {formatINR(discountAmt)}</span>
              </div>
            )}
            <div className="HallBookingCreate__summary-row HallBookingCreate__summary-row--total">
              <span>Payable amount</span>
              <span>{formatINR(payable)}</span>
            </div>
          </div>
        )}

        {/* ── Submit ──────────────────────────────────────────────────── */}
        <div className="HallBookingCreate__footer">
          <p className="HallBookingCreate__notice">
            Booking stays <strong>pending</strong> until confirmed by an admin.
          </p>
          <button
            type="submit"
            className={`HallBookingCreate__submit-btn${submitting ? " HallBookingCreate__submit-btn--loading" : ""}`}
            disabled={submitting}
          >
            {submitting ? "Submitting…" : "Request booking"}
          </button>
        </div>

        {/* ── Toast ───────────────────────────────────────────────────── */}
        {toast && (
          <div className={`HallBookingCreate__toast HallBookingCreate__toast--${toast.type}`}>
            <span className="HallBookingCreate__toast-icon">
              {toast.type === "success" ? "✓" : "!"}
            </span>
            {toast.message}
          </div>
        )}
      </form>
    </div>
  );
}
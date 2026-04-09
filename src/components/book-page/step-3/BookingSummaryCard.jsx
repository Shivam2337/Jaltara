import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createBookingAction, createPaymentOrderAction, capturePaymentAction } from "../../../redux/UserActions";
import { resetBooking } from "../../../features/booking/bookingSlice";

import "./BookingSummaryCard.css";

import img_1 from "./../../../assets/booking/booking.webp";

export default function BookingSummaryCard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const booking = useSelector((state) => state.booking);

  const [paying, setPaying] = useState(false);
  const { checkIn, checkOut, guests, package: selectedPackage } = booking;
  const summary = booking?.summary;

  const fmt = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    const m = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][d.getMonth()];
    return `${d.getDate()} ${m}, ${d.getFullYear()}`;
  };

  const lines = useMemo(() => {
    const items = Array.isArray(summary?.items) ? summary.items : [];
    const arr = [];
    items.forEach((it) => {
      const baseLabel = it.name || it.item_type || "Item";
      if (it.item_type === "room" || it.nights) {
        const nights = it.nights || (Array.isArray(it.breakdown) ? it.breakdown.length : 0) || 0;
        const rooms = it.rooms || 1;
        const itemTotal = parseFloat(it.total ?? 0) || 0;
        const meal = it.breakdown && it.breakdown[0]?.meal_plan ? ` • ${it.breakdown[0].meal_plan.replace("_", " ")}` : "";
        const label = `${baseLabel} • ${nights} night${nights === 1 ? "" : "s"} • ${rooms} room${rooms === 1 ? "" : "s"}${meal}`;
        arr.push({ label, qty: null, amount: itemTotal });
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
        if (adults > 0 || adultAmt > 0) arr.push({ label: `${baseLabel} • Adult`, qty: adults, amount: adultAmt });
        if (children > 0 || childAmt > 0) arr.push({ label: `${baseLabel} • Child`, qty: children, amount: childAmt });
        if (seniors > 0 || seniorAmt > 0) arr.push({ label: `${baseLabel} • Senior`, qty: seniors, amount: seniorAmt });
        if (group > 0) {
          const grpAmt = parseFloat(it.group_total ?? 0) || 0;
          arr.push({ label: `${baseLabel} • Group`, qty: group, amount: grpAmt });
        }
        if (qty > 0 || itemTotal > 0) arr.push({ label: `${baseLabel} • Total`, qty, amount: itemTotal });
      }
    });
    return arr;
  }, [summary]);

  const subtotal = useMemo(() => {
    const amt = summary?.total_amount ?? undefined;
    if (amt !== undefined && amt !== null) return parseFloat(amt) || 0;
    return lines.reduce((s, l) => s + (parseFloat(l.amount || 0) || 0), 0);
  }, [lines, summary]);
  const discount = useMemo(() => {
    const d = summary?.discount_amount ?? 0;
    return parseFloat(d) || 0;
  }, [summary]);
  const total = useMemo(() => {
    const p = summary?.payable_amount ?? summary?.total_amount ?? 0;
    return parseFloat(p) || 0;
  }, [summary]);

  const loadScript = (src) =>
    new Promise((resolve) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = resolve;
      document.body.appendChild(s);
    });

  const buildBookingPayload = () => {
    const cat = booking?.package?.category;
    if (!cat) return null;
    if (cat === "waterpark") {
      const list = Array.isArray(booking?.selectedTickets) ? booking.selectedTickets : [];
      const active = list.find((t) => {
        const c = t?.counts || {};
        return (c.adult || 0) + (c.child || 0) + (c.senior || 0) + (c.group || 0) > 0;
      });
      if (!active) return null;
      const c = active.counts || {};
      return {
        booking_type: "water_park",
        visit_date: booking?.checkIn || null,
        adults: c.adult || 0,
        children: c.child || 0,
        ticket_id: active.id,
        addons: (booking?.addons || [])
          .filter((a) => (a.count || 0) > 0)
          .map((a) => ({ addon_id: a.id, quantity: a.count || 0 })),
        coupon_code: booking?.promoCode || undefined,
      };
    } else if (cat === "resort") {
      const r = booking?.selectedResort;
      if (!r?.id) return null;
      const c = r?.counts || {};
      const mealPlan = r?.pricing?.meal_plan || "room_only";
      return {
        booking_type: "room",
        visit_date: booking?.checkIn || null,
        check_in: booking?.checkIn || null,
        check_out: booking?.checkOut || null,
        adults: c.adult || 0,
        children: c.child || 0,
        room_category_id: r.id,
        meal_plan: mealPlan,
        coupon_code: booking?.promoCode || undefined,
      };
    } else if (cat === "vip") {
      const v = booking?.selectedVip;
      if (!v?.id) return null;
      const c = v?.counts || {};
      return {
        booking_type: "combo",
        visit_date: booking?.checkIn || null,
        adults: c.adult || 0,
        children: c.child || 0,
        package_id: v.id,
        addons: (booking?.addons || [])
          .filter((a) => (a.count || 0) > 0)
          .map((a) => ({ addon_id: a.id, quantity: a.count || 0 })),
        coupon_code: booking?.promoCode || undefined,
      };
    }
    return null;
  };
  const handleCancelBooking = () => {
    dispatch(resetBooking());
    navigate("/");
  };

  const handlePayNow = async () => {
    setPaying(true);
    if (!summary) {
      toast.warn("Calculate summary before paying");
      setPaying(false);
      return;
    }
    const payload = buildBookingPayload();
    if (!payload) {
      toast.warn("Complete selection before paying");
      setPaying(false);
      return;
    }
    const createRes = await dispatch(createBookingAction(payload));
    if (!createRes?.ok) {
      const msg = Array.isArray(createRes?.data)
        ? createRes.data.join(", ")
        : typeof createRes?.data === "string"
          ? createRes.data
          : createRes?.data?.detail || "Booking failed";
      toast.error(msg);
      setPaying(false);
      return;
    }
    const bookingId = createRes.data?.booking_id;
    if (!bookingId) {
      toast.error("Booking ID not received");
      setPaying(false);
      return;
    }
    const orderRes = await dispatch(createPaymentOrderAction(bookingId));
    if (!orderRes?.ok) {
      const msg = Array.isArray(orderRes?.data)
        ? orderRes.data.join(", ")
        : typeof orderRes?.data === "string"
          ? orderRes.data
          : orderRes?.data?.detail || "Payment order failed";
      toast.error(msg);
      setPaying(false);
      return;
    }
    await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    const keyId = orderRes.data?.key_id ||   import.meta.env.VITE_RAZORPAY_KEY_ID || "";
    if (!keyId) {
      toast.error("Payment key not configured");
      setPaying(false);
      return;
    }
    const amount = parseInt(
      orderRes.data?.amount ??
      (createRes.data?.payable_amount ? parseFloat(createRes.data.payable_amount) * 100 : total * 100),
      10
    ) || 0;
    const currency = orderRes.data?.currency || "INR";
    const orderId = orderRes.data?.razorpay_order_id || orderRes.data?.order_id || orderRes.data?.id;
    const paymentPk = orderRes.data?.payment_id || createRes.data?.payment_id || bookingId;
    const options = {
      key: keyId,
      amount,
      currency,
      name: "Jaltara Parks : Water Parks And Resort",
      description: "Booking Payment",
      order_id: orderId,
      handler: async function (resp) {
        const capRes = await dispatch(
          capturePaymentAction(paymentPk, {
            razorpay_payment_id: resp.razorpay_payment_id,
            razorpay_order_id: resp.razorpay_order_id,
            razorpay_signature: resp.razorpay_signature,
          })
        );
        if (!capRes?.ok) {
          const msg = Array.isArray(capRes?.data)
            ? capRes.data.join(", ")
            : typeof capRes?.data === "string"
              ? capRes.data
              : capRes?.data?.detail || "Payment failed";
          toast.error(msg);
          setPaying(false);
          return;
        }
        toast.success("Payment successful");
        setPaying(false);
        try { localStorage.removeItem("booking"); } catch { }
        try { dispatch(resetBooking()); } catch { }
        navigate("/MyAccount");
      },
      modal: {
        ondismiss: function () {
          toast.info("Payment cancelled");
          setPaying(false);
        },
      },
      prefill: {},
      notes: {},
      theme: { color: "#2563eb" },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="booking-s3-summary-card">
      <div className="booking-s3-summary-header">
        <div className=" booking-s3-summary-header-img-wrapper">
          <img src={img_1} alt="park" className="booking-s3-summary-img" />
        </div>

        <div>
          <h3 className="booking-s3-summary-title">
            Jaltara Parks : Water Parks And Resort
          </h3>
          <p className="booking-s3-summary-sub">Palus, Maharashtra</p>
        </div>
      </div>
      <hr className="booking-s3-seperator" />
      <div className="booking-s3-summary-data-section">
        <p className="booking-s3-summary-data-label">Date</p>
        <p className="booking-s3-summary-data-value">
          {summary?.visit_date
            ? fmt(summary.visit_date)
            : checkIn && checkOut
              ? `${fmt(checkIn)} • ${fmt(checkOut)}`
              : checkIn
                ? fmt(checkIn)
                : "-"}
        </p>
      </div>
      <div className="booking-s3-summary-data-section">
        <p className="booking-s3-summary-data-label">Items</p>
        <div className="booking-s3-line-items">
          {lines.length === 0 ? (
            <div className="booking-s3-line">
              <span className="booking-s3-line-name">No items selected</span>
              <span className="booking-s3-line-amt">₹0</span>
            </div>
          ) : (
            lines.map((l, i) => (
              <div key={i} className="booking-s3-line">
                <div className="booking-s3-line-left">
                  <span className="booking-s3-line-name">{l.label}</span>
                  {l.qty ? <span className="booking-s3-line-qty">× {l.qty}</span> : null}
                </div>
                <span className="booking-s3-line-amt">₹{parseFloat(l.amount || 0).toFixed(2)}</span>
              </div>
            ))
          )}
        </div>
      </div>
      <hr className="booking-s3-seperator" />

      <div className="booking-s3-summary-price-section">
        <p className="booking-s3-summary-price-label">Price details</p>

        <div className="booking-s3-summary-price-row">
          <span>Subtotal</span>
          <span>₹{parseFloat(subtotal || 0).toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="booking-s3-summary-price-row">
            <span>Discount</span>
            <span>-₹{discount.toFixed(2)}</span>
          </div>
        )}
      </div>
      <hr className="booking-s3-seperator" />

      <div className="booking-s3-summary-price-section">
        <div className="booking-s3-summary-price-row booking-s3-summary-total-div">
          <span>Total</span>
          <span>₹{parseFloat(total || 0).toFixed(2)}</span>
        </div>
      </div>

      <div className="booking-s3-summary-btn-box">
        <button className="booking-s3-summary-btn-pay" onClick={handlePayNow} disabled={paying}>
          {paying ? "Processing..." : "Pay Now"}
        </button>
        <button onClick={handleCancelBooking} className="booking-s3-summary-btn-cancel">
          Cancel
        </button>
      </div>
    </div>
  );
}

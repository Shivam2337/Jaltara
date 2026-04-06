export const encodeBooking = (booking) => {
  try {
    const data = {
      checkIn: booking?.checkIn || null,
      checkOut: booking?.checkOut || null,
      guests: booking?.guests || { adults: 0, children: 0 },
      package: booking?.package || { category: null, packageType: null, roomType: null },
      addons: Array.isArray(booking?.addons) ? booking.addons : [],
      selectedTickets: Array.isArray(booking?.selectedTickets) ? booking.selectedTickets : [],
      selectedResort: booking?.selectedResort || null,
      selectedVip: booking?.selectedVip || null,
    };
    const json = JSON.stringify(data);
    const b64 = btoa(unescape(encodeURIComponent(json)));
    return b64;
  } catch {
    return "";
  }
};

export const decodeBooking = (b64) => {
  try {
    const json = decodeURIComponent(escape(atob(b64)));
    const obj = JSON.parse(json);
    return obj && typeof obj === "object" ? obj : null;
  } catch {
    return null;
  }
};

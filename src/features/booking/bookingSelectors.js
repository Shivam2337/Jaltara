export const selectBooking = (state) => state.booking;

export const selectDates = (state) => ({
  checkIn: state.booking.checkIn,
  checkOut: state.booking.checkOut,
});

export const selectPackage = (state) => state.booking.package;

export const selectAddons = (state) => state.booking.addons;

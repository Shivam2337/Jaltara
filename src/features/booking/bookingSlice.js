import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "booking";

const persisted =
  (() => {
    try {
      if (typeof localStorage === "undefined") return null;
      const raw = localStorage.getItem(STORAGE_KEY);
      const data = raw ? JSON.parse(raw) : null;
      if (data && data.package && data.package.category === "combo") {
        return { ...data, package: { ...data.package, category: "vip" } };
      }
      return data;
    } catch {
      return null;
    }
  })() || null;

const defaultState = {
  checkIn: null,
  checkOut: null,

  package: {
    category: null,
    packageType: null,
    roomType: null,
  },

  addons: [],
  selectedTickets: [],
  selectedResort: null,
  selectedVip: null,
  summary: null,
  promoCode: null,
};
const initialState = {
  ...defaultState,
  ...(persisted || {}),
  package: { ...defaultState.package, ...((persisted && persisted.package) || {}) },
  addons: Array.isArray(persisted?.addons) ? persisted.addons : defaultState.addons,
  selectedTickets: Array.isArray(persisted?.selectedTickets)
    ? persisted.selectedTickets
    : defaultState.selectedTickets,
  selectedResort:
    typeof persisted?.selectedResort === "undefined"
      ? defaultState.selectedResort
      : persisted.selectedResort,
  selectedVip:
    typeof persisted?.selectedVip === "undefined"
      ? defaultState.selectedVip
      : persisted.selectedVip,
  summary: typeof persisted?.summary === "undefined" ? defaultState.summary : persisted.summary,
  promoCode:
    typeof persisted?.promoCode === "undefined" ? defaultState.promoCode : persisted.promoCode,
};

const saveState = (state) => {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  } catch {}
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,

  reducers: {
    hydrateBooking: (state, action) => {
      const inc = action.payload || {};
      const next = {
        ...state,
        ...inc,
        package: { ...state.package, ...(inc.package || {}) },
        addons: Array.isArray(inc.addons) ? inc.addons : state.addons,
        selectedTickets: Array.isArray(inc.selectedTickets)
          ? inc.selectedTickets
          : state.selectedTickets,
        selectedResort:
          typeof inc.selectedResort === "undefined"
            ? state.selectedResort
            : inc.selectedResort,
        selectedVip:
          typeof inc.selectedVip === "undefined" ? state.selectedVip : inc.selectedVip,
        summary: typeof inc.summary === "undefined" ? state.summary : inc.summary,
        promoCode: typeof inc.promoCode === "undefined" ? state.promoCode : inc.promoCode,
      };
      saveState(next);
      return next;
    },
    /* SET DATES */

    setDates: (state, action) => {
      const { checkIn, checkOut } = action.payload;

      state.checkIn = checkIn;
      state.checkOut = checkOut;
      saveState(state);
    },

    /* SELECT PACKAGE */

    selectPackage: (state, action) => {
      const { category, packageType, roomType } = action.payload;

      const prevCategory = state.package.category;
      state.package.category = category;
      state.package.packageType = packageType || null;
      state.package.roomType = roomType || null;
      if (prevCategory !== category) {
        state.selectedTickets = [];
        state.summary = null;
      }
      saveState(state);
    },

    /* SELECTED TICKETS */
    upsertSelectedTicket: (state, action) => {
      const { id, name, pricing, counts } = action.payload;
      const total =
        (counts?.adult || 0) + (counts?.child || 0) + (counts?.senior || 0);
      if (!Array.isArray(state.selectedTickets)) state.selectedTickets = [];
      const existing = state.selectedTickets.find((t) => t.id === id);
      if (total <= 0) {
        state.selectedTickets = state.selectedTickets.filter((t) => t.id !== id);
        state.summary = null;
      } else if (existing) {
        existing.counts = counts;
        existing.pricing = pricing || existing.pricing || null;
        existing.name = name || existing.name;
      } else {
        state.selectedTickets.push({
          id,
          name,
          pricing: pricing || null,
          counts: counts || { adult: 0, child: 0, senior: 0 },
        });
      }
      saveState(state);
    },

    /* SELECTED RESORT */
    setSelectedResort: (state, action) => {
      const sel = action.payload || null;
      state.selectedResort = sel;
      saveState(state);
    },

    /* SELECTED VIP */
    setSelectedVip: (state, action) => {
      const sel = action.payload || null;
      state.selectedVip = sel;
      saveState(state);
    },

    /* TOGGLE ADDONS */

    toggleAddon: (state, action) => {
      const addon = action.payload;

      const exists = state.addons.find((a) => a.id === addon.id);

      if (exists) {
        state.addons = state.addons.filter((a) => a.id !== addon.id);
      } else {
        state.addons.push(addon);
      }
      saveState(state);
    },
    updateAddonCount: (state, action) => {
      const { id, name, price, change } = action.payload;

      const addon = state.addons.find((a) => a.id === id);

      if (addon) {
        addon.count += change;

        if (addon.count <= 0) {
          state.addons = state.addons.filter((a) => a.id !== id);
        }
      } else if (change > 0) {
        state.addons.push({
          id,
          name,
          price,
          count: 1,
        });
      }
      saveState(state);
    },

    /* RESET */

    resetBooking: () => {
      const next = defaultState;
      saveState(next);
      return next;
    },
    setBookingSummary: (state, action) => {
      state.summary = action.payload || null;
      saveState(state);
    },
    setPromoCode: (state, action) => {
      state.promoCode = action.payload || null;
      saveState(state);
    },
  },
});

export const {
  hydrateBooking,
  setDates,
  selectPackage,
  upsertSelectedTicket,
  setSelectedResort,
  setSelectedVip,
  toggleAddon,
  updateAddonCount,
  resetBooking,
  setBookingSummary,
  setPromoCode,
} = bookingSlice.actions;

export default bookingSlice.reducer;

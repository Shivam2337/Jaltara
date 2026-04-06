import {
  USER_PACKAGES_REQUEST,
  USER_PACKAGES_SUCCESS,
  USER_PACKAGES_FAIL,
  USER_BOOKING_SUMMARY_REQUEST,
  USER_BOOKING_SUMMARY_SUCCESS,
  USER_BOOKING_SUMMARY_FAIL,
  USER_BOOKING_CREATE_REQUEST,
  USER_BOOKING_CREATE_SUCCESS,
  USER_BOOKING_CREATE_FAIL,
  USER_PAYMENT_ORDER_REQUEST,
  USER_PAYMENT_ORDER_SUCCESS,
  USER_PAYMENT_ORDER_FAIL,
  USER_PAYMENT_CAPTURE_REQUEST,
  USER_PAYMENT_CAPTURE_SUCCESS,
  USER_PAYMENT_CAPTURE_FAIL,
  USER_RIDES_REQUEST,
  USER_RIDES_SUCCESS,
  USER_RIDES_FAIL,
  USER_TESTIMONIALS_REQUEST,
  USER_TESTIMONIALS_SUCCESS,
  USER_TESTIMONIALS_FAIL,
  USER_GALLERY_REQUEST,
  USER_GALLERY_SUCCESS,
  USER_GALLERY_FAIL,
  USER_ROOMS_REQUEST,
  USER_ROOMS_SUCCESS,
  USER_ROOMS_FAIL,
  USER_CONTACT_REQUEST,
  USER_CONTACT_SUCCESS,
  USER_CONTACT_FAIL,
  USER_TERMS_REQUEST,
  USER_TERMS_SUCCESS,
  USER_TERMS_FAIL,
  USER_PRIVACY_REQUEST,
  USER_PRIVACY_FAIL,
  USER_PRIVACY_SUCCESS,
  PROFILE_FETCH_REQUEST,
  PROFILE_FETCH_SUCCESS,
  PROFILE_FETCH_FAIL,
  PROFILE_UPDATE_REQUEST,
  PROFILE_UPDATE_SUCCESS,
  PROFILE_UPDATE_FAIL,
  PROFILE_UPDATE_RESET,
  USER_WPR_SECTIONS_REQUEST,
  USER_WPR_SECTIONS_SUCCESS,
  USER_WPR_SECTIONS_FAIL,
  USER_AMENITIES_REQUEST,
  USER_AMENITIES_SUCCESS,
  USER_AMENITIES_FAIL,
  USER_MY_BOOKINGS_REQUEST,
  USER_MY_BOOKINGS_SUCCESS,
  USER_MY_BOOKINGS_FAIL,
   USER_CONTACT_SEND_REQUEST,
   USER_CONTACT_SEND_SUCCESS,
   USER_CONTACT_SEND_FAIL,
   USER_ABOUT_REQUEST,
   USER_ABOUT_SUCCESS,
   USER_ABOUT_FAIL,
   USER_FAQ_REQUEST,
   USER_FAQ_SUCCESS,
   USER_FAQ_FAIL,
   USER_HALL_REQUEST,
   USER_HALL_SUCCESS,
   USER_HALL_FAIL,
   USER_TESTIMONIAL_CREATE_REQUEST,
   USER_TESTIMONIAL_CREATE_SUCCESS,
   USER_TESTIMONIAL_CREATE_FAIL,
   USER_TESTIMONIAL_UPDATE_REQUEST,
   USER_TESTIMONIAL_UPDATE_SUCCESS,
   USER_TESTIMONIAL_UPDATE_FAIL,
} from "./UserActionTypes";

const initialList = { list: [], loading: false, error: null };

export const UserPackagesReducer = (state = initialList, action) => {
  switch (action.type) {
    case USER_PACKAGES_REQUEST:
      return { ...state, loading: true, error: null };
    case USER_PACKAGES_SUCCESS:
      return { ...state, loading: false, list: action.payload || [] };
    case USER_PACKAGES_FAIL:
      return { ...state, loading: false, error: action.payload || "Error" };
    default:
      return state;
  }
};

export const UserContactSendReducer = (state = { loading: false, success: false, error: null }, action) => {
  switch (action.type) {
    case USER_CONTACT_SEND_REQUEST:
      return { loading: true, success: false, error: null };
    case USER_CONTACT_SEND_SUCCESS:
      return { loading: false, success: true, error: null };
    case USER_CONTACT_SEND_FAIL:
      return { loading: false, success: false, error: action.payload || "Error" };
    default:
      return state;
  }
};

export const UserRidesReducer = (state = initialList, action) => {
  switch (action.type) {
    case USER_RIDES_REQUEST:
      return { ...state, loading: true, error: null };
    case USER_RIDES_SUCCESS:
      return { ...state, loading: false, list: action.payload || [] };
    case USER_RIDES_FAIL:
      return { ...state, loading: false, error: action.payload || "Error" };
    default:
      return state;
  }
};

export const UserTestimonialsReducer = (state = initialList, action) => {
  switch (action.type) {
    case USER_TESTIMONIALS_REQUEST:
      return { ...state, loading: true, error: null };
    case USER_TESTIMONIALS_SUCCESS:
      return { ...state, loading: false, list: action.payload || [] };
    case USER_TESTIMONIALS_FAIL:
      return { ...state, loading: false, error: action.payload || "Error" };
    default:
      return state;
  }
};

export const UserGalleryReducer = (state = initialList, action) => {
  switch (action.type) {
    case USER_GALLERY_REQUEST:
      return { ...state, loading: true, error: null };
    case USER_GALLERY_SUCCESS:
      return { ...state, loading: false, list: action.payload || [] };
    case USER_GALLERY_FAIL:
      return { ...state, loading: false, error: action.payload || "Error" };
    default:
      return state;
  }
};

export const UserRoomsReducer = (state = initialList, action) => {
  switch (action.type) {
    case USER_ROOMS_REQUEST:
      return { ...state, loading: true, error: null };
    case USER_ROOMS_SUCCESS:
      return { ...state, loading: false, list: action.payload || [] };
    case USER_ROOMS_FAIL:
      return { ...state, loading: false, error: action.payload || "Error" };
    default:
      return state;
  }
};

export const UserAddonsReducer = (state = initialList, action) => {
  switch (action.type) {
    case "USER_ADDONS_REQUEST":
      return { ...state, loading: true, error: null };
    case "USER_ADDONS_SUCCESS":
      return { ...state, loading: false, list: action.payload || [] };
    case "USER_ADDONS_FAIL":
      return { ...state, loading: false, error: action.payload || "Error" };
    default:
      return state;
  }
};

export const UserTicketsReducer = (state = initialList, action) => {
  switch (action.type) {
    case "USER_TICKETS_REQUEST":
      return { ...state, loading: true, error: null };
    case "USER_TICKETS_SUCCESS":
      return { ...state, loading: false, list: action.payload || [] };
    case "USER_TICKETS_FAIL":
      return { ...state, loading: false, error: action.payload || "Error" };
    default:
      return state;
  }
};

export const UserRoomsListReducer = (state = initialList, action) => {
  switch (action.type) {
    case "USER_ROOMS_LIST_REQUEST":
      return { ...state, loading: true, error: null };
    case "USER_ROOMS_LIST_SUCCESS":
      return { ...state, loading: false, list: action.payload || [] };
    case "USER_ROOMS_LIST_FAIL":
      return { ...state, loading: false, error: action.payload || "Error" };
    default:
      return state;
  }
};

export const UserPackagesListReducer = (state = initialList, action) => {
  switch (action.type) {
    case "USER_PACKAGES_LIST_REQUEST":
      return { ...state, loading: true, error: null };
    case "USER_PACKAGES_LIST_SUCCESS":
      return { ...state, loading: false, list: action.payload || [] };
    case "USER_PACKAGES_LIST_FAIL":
      return { ...state, loading: false, error: action.payload || "Error" };
    default:
      return state;
  }
};

export const UserBookingSummaryReducer = (
  state = { data: null, loading: false, error: null },
  action
) => {
  switch (action.type) {
    case USER_BOOKING_SUMMARY_REQUEST:
      return { ...state, loading: true, error: null };
    case USER_BOOKING_SUMMARY_SUCCESS:
      return { ...state, loading: false, data: action.payload || null };
    case USER_BOOKING_SUMMARY_FAIL:
      return { ...state, loading: false, error: action.payload || "Error" };
    default:
      return state;
  }
};

export const UserBookingCreateReducer = (
  state = { data: null, loading: false, error: null },
  action
) => {
  switch (action.type) {
    case USER_BOOKING_CREATE_REQUEST:
      return { ...state, loading: true, error: null };
    case USER_BOOKING_CREATE_SUCCESS:
      return { ...state, loading: false, data: action.payload || null };
    case USER_BOOKING_CREATE_FAIL:
      return { ...state, loading: false, error: action.payload || "Error" };
    default:
      return state;
  }
};

export const UserPaymentReducer = (
  state = { order: null, capture: null, loading: false, error: null },
  action
) => {
  switch (action.type) {
    case USER_PAYMENT_ORDER_REQUEST:
    case USER_PAYMENT_CAPTURE_REQUEST:
      return { ...state, loading: true, error: null };
    case USER_PAYMENT_ORDER_SUCCESS:
      return { ...state, loading: false, order: action.payload || null };
    case USER_PAYMENT_ORDER_FAIL:
      return { ...state, loading: false, error: action.payload || "Error" };
    case USER_PAYMENT_CAPTURE_SUCCESS:
      return { ...state, loading: false, capture: action.payload || null };
    case USER_PAYMENT_CAPTURE_FAIL:
      return { ...state, loading: false, error: action.payload || "Error" };
    default:
      return state;
  }
};
export const UserContactReducer = (state = initialList, action) => {
  switch (action.type) {
    case USER_CONTACT_REQUEST:
      return { ...state, loading: true, error: null };
    case USER_CONTACT_SUCCESS:
      return { ...state, loading: false, list: action.payload || [] };
    case USER_CONTACT_FAIL:
      return { ...state, loading: false, error: action.payload || "Error" };
    default:
      return state;
  }
};

/* ==================== MY BOOKINGS ==================== */
export const UserMyBookingsReducer = (state = { list: [], loading: false, error: null }, action) => {
  switch (action.type) {
    case USER_MY_BOOKINGS_REQUEST:
      return { ...state, loading: true, error: null };
    case USER_MY_BOOKINGS_SUCCESS:
      return { ...state, loading: false, list: action.payload || [] };
    case USER_MY_BOOKINGS_FAIL:
      return { ...state, loading: false, error: action.payload || "Error" };
    default:
      return state;
  }
};

export const UserTermsReducer = (state = initialList, action) => {
  switch (action.type) {
    case USER_TERMS_REQUEST:
      return { ...state, loading: true, error: null };
    case USER_TERMS_SUCCESS:
      return { ...state, loading: false, list: action.payload || [] };
    case USER_TERMS_FAIL:
      return { ...state, loading: false, error: action.payload || "Error" };
    default:
      return state;
  }
};

export const UserPrivacyReducer = (state = initialList, action) => {
  switch (action.type) {
    case USER_PRIVACY_REQUEST:
      return { ...state, loading: true, error: null };
    case USER_PRIVACY_SUCCESS:
      return { ...state, loading: false, list: action.payload || [] };
    case USER_PRIVACY_FAIL:
      return { ...state, loading: false, error: action.payload || "Error" };
    default:
      return state;
  }
};


export const UserWprSectionsReducer = (
  state = { data: null, loading: false, error: null },
  action
) => {
  switch (action.type) {
    case USER_WPR_SECTIONS_REQUEST:
      return { ...state, loading: true, error: null };
    case USER_WPR_SECTIONS_SUCCESS:
      return { ...state, loading: false, data: action.payload || null };
    case USER_WPR_SECTIONS_FAIL:
      return { ...state, loading: false, error: action.payload || "Error" };
    default:
      return state;
  }
};


export const UserAmenitiesReducer = (state = initialList, action) => {
  switch (action.type) {
    case USER_AMENITIES_REQUEST:
      return { ...state, loading: true, error: null };
    case USER_AMENITIES_SUCCESS:
      return { ...state, loading: false, list: action.payload || [] };
    case USER_AMENITIES_FAIL:
      return { ...state, loading: false, error: action.payload || "Error" };
    default:
      return state;
  }
};

/* ==================== ABOUT PAGE ==================== */

const aboutInitialState = { data: null, loading: false, error: null };

export const UserAboutReducer = (state = aboutInitialState, action) => {
  switch (action.type) {
    case USER_ABOUT_REQUEST:
      return { ...state, loading: true, error: null };
    case USER_ABOUT_SUCCESS:
      return { ...state, loading: false, data: action.payload || null };
    case USER_ABOUT_FAIL:
      return { ...state, loading: false, error: action.payload || "Error" };
    default:
      return state;
  }
};

/* ==================== FAQ PAGE ==================== */

export const UserFaqReducer = (state = initialList, action) => {
  switch (action.type) {
    case USER_FAQ_REQUEST:
      return { ...state, loading: true, error: null };
    case USER_FAQ_SUCCESS:
      return { ...state, loading: false, list: action.payload || [] };
    case USER_FAQ_FAIL:
      return { ...state, loading: false, error: action.payload || "Error" };
    default:
      return state;
  }
};

/* ==================== HALL / AUDITORIUM ==================== */

const hallInitialState = { data: null, loading: false, error: null };

export const UserHallReducer = (state = hallInitialState, action) => {
  switch (action.type) {
    case USER_HALL_REQUEST:
      return { ...state, loading: true, error: null };
    case USER_HALL_SUCCESS:
      return { ...state, loading: false, data: action.payload || null };
    case USER_HALL_FAIL:
      return { ...state, loading: false, error: action.payload || "Error" };
    default:
      return state;
  }
};

// ─── Profile Fetch Reducer ────────────────────────────────────
const fetchInitialState = {
  loading: false,
  profile: null,
  error: null,
};
 
export const profileFetchReducer = (state = fetchInitialState, action) => {
  switch (action.type) {
    case PROFILE_FETCH_REQUEST:
      return { ...state, loading: true, error: null };
    case PROFILE_FETCH_SUCCESS:
      return { loading: false, profile: action.payload, error: null };
    case PROFILE_FETCH_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
 
// ─── Profile Update Reducer ───────────────────────────────────
const updateInitialState = {
  loading: false,
  success: false,
  updatedProfile: null,
  error: null,
};
 
export const profileUpdateReducer = (state = updateInitialState, action) => {
  switch (action.type) {
    case PROFILE_UPDATE_REQUEST:
      return { ...state, loading: true, success: false, error: null };
    case PROFILE_UPDATE_SUCCESS:
      return {
        loading: false,
        success: true,
        updatedProfile: action.payload,
        error: null,
      };
    case PROFILE_UPDATE_FAIL:
      return { ...state, loading: false, success: false, error: action.payload };
    case PROFILE_UPDATE_RESET:
      return updateInitialState;
    default:
      return state;
  }
};

/* ==================== TESTIMONIALS ==================== */

export const UserTestimonialCreateReducer = (
  state = { loading: false, success: false, error: null },
  action
) => {
  switch (action.type) {
    case USER_TESTIMONIAL_CREATE_REQUEST:
      return { loading: true, success: false, error: null };
    case USER_TESTIMONIAL_CREATE_SUCCESS:
      return { loading: false, success: true, error: null };
    case USER_TESTIMONIAL_CREATE_FAIL:
      return { loading: false, success: false, error: action.payload };
    default:
      return state;
  }
};

export const UserTestimonialUpdateReducer = (
  state = { loading: false, success: false, error: null },
  action
) => {
  switch (action.type) {
    case USER_TESTIMONIAL_UPDATE_REQUEST:
      return { loading: true, success: false, error: null };
    case USER_TESTIMONIAL_UPDATE_SUCCESS:
      return { loading: false, success: true, error: null };
    case USER_TESTIMONIAL_UPDATE_FAIL:
      return { loading: false, success: false, error: action.payload };
    default:
      return state;
  }
};

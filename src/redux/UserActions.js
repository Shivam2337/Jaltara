import PublicAPI from "../BaseAPI/PublicAPI";
import { setBookingSummary } from "../features/booking/bookingSlice";
import {
  USER_WPR_SECTIONS_REQUEST,
  USER_WPR_SECTIONS_SUCCESS,
  USER_WPR_SECTIONS_FAIL,
  USER_PACKAGES_REQUEST,
  USER_PACKAGES_SUCCESS,
  USER_PACKAGES_FAIL,
  USER_CONTACT_SEND_REQUEST,
  USER_CONTACT_SEND_SUCCESS,
  USER_CONTACT_SEND_FAIL,
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
  USER_ADDONS_REQUEST,
  USER_ADDONS_SUCCESS,
  USER_ADDONS_FAIL,
  USER_TICKETS_REQUEST,
  USER_TICKETS_SUCCESS,
  USER_TICKETS_FAIL,
  USER_ROOMS_LIST_REQUEST,
  USER_ROOMS_LIST_SUCCESS,
  USER_ROOMS_LIST_FAIL,
  USER_PACKAGES_LIST_REQUEST,
  USER_PACKAGES_LIST_SUCCESS,
  USER_PACKAGES_LIST_FAIL,
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
  USER_MY_BOOKINGS_REQUEST,
  USER_MY_BOOKINGS_SUCCESS,
  USER_MY_BOOKINGS_FAIL,
  USER_CONTACT_REQUEST,
  USER_CONTACT_SUCCESS,
  USER_CONTACT_FAIL,
  USER_TERMS_REQUEST,
  USER_TERMS_SUCCESS,
  USER_TERMS_FAIL,
  USER_PRIVACY_REQUEST,
  USER_PRIVACY_FAIL,
  USER_PRIVACY_SUCCESS,
  USER_AMENITIES_REQUEST,
  USER_AMENITIES_SUCCESS,
  USER_AMENITIES_FAIL,
  USER_ABOUT_REQUEST,
  USER_ABOUT_SUCCESS,
  USER_ABOUT_FAIL,
  USER_FAQ_REQUEST,
  USER_FAQ_SUCCESS,
  USER_FAQ_FAIL,
  USER_HALL_REQUEST,
  USER_HALL_SUCCESS,
  USER_HALL_FAIL,
  PROFILE_FETCH_REQUEST,
  PROFILE_FETCH_SUCCESS,
  PROFILE_FETCH_FAIL,
  PROFILE_UPDATE_REQUEST,
  PROFILE_UPDATE_SUCCESS,
  PROFILE_UPDATE_FAIL,
  PROFILE_UPDATE_RESET,
  USER_TESTIMONIAL_CREATE_REQUEST,
  USER_TESTIMONIAL_CREATE_SUCCESS,
  USER_TESTIMONIAL_CREATE_FAIL,
  USER_TESTIMONIAL_UPDATE_REQUEST,
  USER_TESTIMONIAL_UPDATE_SUCCESS,
  USER_TESTIMONIAL_UPDATE_FAIL,
} from "./UserActionTypes";

const normalizePackages = (data) =>
  Array.isArray(data)
    ? data.map((pkg) => {
        const primary =
          (pkg.images || []).find((im) => im?.is_primary)?.image || null;
        return {
          ...pkg,
          image: primary || "",
        };
      })
    : [];

export const getUserPackagesAction =
  (params = {}) =>
  async (dispatch) => {
    dispatch({ type: USER_PACKAGES_REQUEST });
    try {
      const { data } = await PublicAPI.get("catalog/packages/", { params });
      dispatch({
        type: USER_PACKAGES_SUCCESS,
        payload: normalizePackages(data),
      });
    } catch (error) {
      dispatch({
        type: USER_PACKAGES_FAIL,
        payload: error.response?.data || error.message,
      });
    }
  };

const normalizeRides = (data, isAdultOnly) =>
  Array.isArray(data)
    ? data.map((r) => ({
        title: r.name,
        img: (r.images || []).find((im) => im?.is_primary)?.image || null,
        tag: isAdultOnly ? "HIGH THRILL" : "FAMILY / KIDS RIDES",
        description: r.description || "",
        features: [],
      }))
    : [];

export const getUserRidesAction =
  (isAdultOnly = false) =>
  async (dispatch) => {
    dispatch({ type: USER_RIDES_REQUEST });
    try {
      const { data } = await PublicAPI.get("catalog/rides/", {
        params: { is_adult_only: isAdultOnly },
      });
      dispatch({
        type: USER_RIDES_SUCCESS,
        payload: normalizeRides(data, isAdultOnly),
      });
    } catch (error) {
      dispatch({
        type: USER_RIDES_FAIL,
        payload: error.response?.data || error.message,
      });
    }
  };

const normalizeTestimonials = (data) =>
  Array.isArray(data)
    ? data.map((t) => ({
        id: t.id,
        name: t.name,
        rating: t.rating,
        review: t.comment,
        profilePhoto: t.profile_photo,
        reviewFor: t.category,
      }))
    : [];

export const getUserTestimonialsAction = () => async (dispatch) => {
  dispatch({ type: USER_TESTIMONIALS_REQUEST });
  try {
    const { data } = await PublicAPI.get("cms/testimonials/");
    dispatch({
      type: USER_TESTIMONIALS_SUCCESS,
      payload: normalizeTestimonials(data),
    });
  } catch (error) {
    dispatch({
      type: USER_TESTIMONIALS_FAIL,
      payload: error.response?.data || error.message,
    });
  }
};

const normalizeSection = (data) => {
  if (!data) return null;
  return {
    id: data.id,
    name: data.name,
    section_heading: data.section_heading,
    section_text: data.section_text,
    contact_no: data.contact_no,
    front_image: data.front_image,
    background_image: data.background_image,
  };
};

export const getWprSectionsAction = () => async (dispatch) => {
  dispatch({ type: USER_WPR_SECTIONS_REQUEST });
  try {
    const [wpRes, rRes] = await Promise.all([
      PublicAPI.get("cms/sections/water_park/"),
      PublicAPI.get("cms/sections/resort/"),
    ]);
    const payload = {
      water_park: normalizeSection(wpRes.data),
      resort: normalizeSection(rRes.data),
    };
    dispatch({ type: USER_WPR_SECTIONS_SUCCESS, payload });
  } catch (error) {
    dispatch({
      type: USER_WPR_SECTIONS_FAIL,
      payload: error.response?.data || error.message,
    });
  }
};

const normalizeGallery = (data) =>
  Array.isArray(data)
    ? data.map((g, i) => ({
        id: g.id ?? i,
        src: g.image ?? g.url ?? g.file ?? "",
        category:
          g.category_name ??
          (g.category && g.category.name) ??
          g.category ??
          "Uncategorized",
      }))
    : [];

export const getUserGalleryAction =
  (params = {}) =>
  async (dispatch) => {
    dispatch({ type: USER_GALLERY_REQUEST });
    try {
      const { data } = await PublicAPI.get("cms/gallery/", { params });
      dispatch({
        type: USER_GALLERY_SUCCESS,
        payload: normalizeGallery(data),
      });
    } catch (error) {
      dispatch({
        type: USER_GALLERY_FAIL,
        payload: error.response?.data || error.message,
      });
    }
  };

const normalizeRooms = (data) =>
  Array.isArray(data)
    ? data.map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        bed_type: r.bed_type,
        max_adults: r.max_adults ?? null,
        max_children: r.max_children ?? null,
        room_size: r.room_size ?? "",
        amenities: r.amenities ?? [],
        images: (r.images || []).map((img) => ({
          image: img.image,
          is_primary: !!img.is_primary,
        })),
        pricings: r.pricings || [],
      }))
    : [];

export const getUserRoomsAction = () => async (dispatch) => {
  dispatch({ type: USER_ROOMS_REQUEST });
  try {
    const { data } = await PublicAPI.get("catalog/resort/rooms/");
    dispatch({
      type: USER_ROOMS_SUCCESS,
      payload: normalizeRooms(data),
    });
  } catch (error) {
    dispatch({
      type: USER_ROOMS_FAIL,
      payload: error.response?.data || error.message,
    });
  }
};

/* ==================== BOOKING STEP 2 DATA ==================== */

export const getAddonsAction = () => async (dispatch) => {
  dispatch({ type: USER_ADDONS_REQUEST });
  try {
    const { data } = await PublicAPI.get("catalog/addons/");
    const mapped = Array.isArray(data)
      ? data.map((item, idx) => {
          const pricings = Array.isArray(item.pricings) ? item.pricings : [];
          const firstPricing = pricings[0]?.price;
          const derivedPrice =
            firstPricing !== undefined && firstPricing !== null
              ? parseFloat(firstPricing) || 0
              : 0;
          const images = Array.isArray(item.images) ? item.images : [];
          const primary =
            images.find((im) => im?.is_primary)?.image || images[0]?.image || null;
          return {
            id: item.id ?? item.code ?? item.slug ?? String(idx),
            name: item.name ?? item.title ?? "Addon",
            addon_type: item.addon_type ?? null,
            is_per_person: !!item.is_per_person,
            pricings: pricings,
            price: derivedPrice,
            images,
            image: primary,
          };
        })
      : [];
    dispatch({ type: USER_ADDONS_SUCCESS, payload: mapped });
  } catch (error) {
    dispatch({
      type: USER_ADDONS_FAIL,
      payload: error.response?.data || error.message,
    });
  }
};

export const getTicketsListAction = () => async (dispatch) => {
  dispatch({ type: USER_TICKETS_REQUEST });
  try {
    const { data } = await PublicAPI.get("catalog/ticketslist/");
    const mapped = Array.isArray(data)
      ? data.map((t, idx) => {
          const adult = parseFloat(t?.pricing?.adult_price ?? t?.price ?? 0) || 0;
          return {
            id: t.id ?? t.slug ?? String(idx),
            name: t.name ?? t.title ?? "Pass",
            duration_hours: t.duration_hours ?? null,
            includes_meal: !!t.includes_meal,
            includes_stay: !!t.includes_stay,
            entry_anytime: !!t.entry_anytime,
            max_capacity_per_slot: t.max_capacity_per_slot ?? null,
            pricing: t.pricing || null,
            price: adult,
          };
        })
      : [];
    dispatch({ type: USER_TICKETS_SUCCESS, payload: mapped });
  } catch (error) {
    dispatch({
      type: USER_TICKETS_FAIL,
      payload: error.response?.data || error.message,
    });
  }
};

export const getRoomsListAction =
  (params = {}) =>
  async (dispatch) => {
    dispatch({ type: USER_ROOMS_LIST_REQUEST });
    try {
      const { data } = await PublicAPI.get("catalog/roomslist/", { params });
      const mapped = Array.isArray(data)
        ? data.map((r, idx) => {
            const images = Array.isArray(r.images) ? r.images : [];
            const primary =
              images.find((im) => im?.is_primary)?.image ||
              images[0]?.image ||
              null;
            const base = parseFloat(r?.pricing?.base_price ?? r?.price ?? 0) || 0;
            return {
              id: r.id ?? r.slug ?? String(idx),
              name: r.name ?? r.title ?? "Room",
              label: r.name ?? r.title ?? "Room",
              description: r.description ?? "",
              images: images,
              image: primary,
              pricing: r.pricing || null,
              price: base,
              max_adults: r.max_adults ?? null,
              max_children: r.max_children ?? null,
              availability: Array.isArray(r.availability) ? r.availability : [],
            };
          })
        : [];
      dispatch({ type: USER_ROOMS_LIST_SUCCESS, payload: mapped });
    } catch (error) {
      dispatch({
        type: USER_ROOMS_LIST_FAIL,
        payload: error.response?.data || error.message,
      });
    }
  };

export const getPackagesListAction = () => async (dispatch) => {
  dispatch({ type: USER_PACKAGES_LIST_REQUEST });
  try {
    const { data } = await PublicAPI.get("catalog/packageslist/");
    const mapped = Array.isArray(data)
      ? data.map((p, idx) => {
          const images = Array.isArray(p.images) ? p.images : [];
          const primary =
            images.find((im) => im?.is_primary)?.image ||
            images[0]?.image ||
            null;
          const base = parseFloat(p?.pricing?.base_price ?? p?.price ?? 0) || 0;
          return {
            id: p.id ?? p.slug ?? String(idx),
            name: p.name ?? p.title ?? "Package",
            label: p.name ?? p.title ?? "Package",
            description: p.description ?? "",
            items: p.items || [],
            images,
            image: primary,
            pricing: p.pricing || null,
            price: base,
            package_type: p.package_type ?? null,
            duration_hours: p.duration_hours ?? null,
            max_adults: p.max_adults ?? null,
            max_children: p.max_children ?? null,
          };
        })
      : [];
    dispatch({ type: USER_PACKAGES_LIST_SUCCESS, payload: mapped });
  } catch (error) {
    dispatch({
      type: USER_PACKAGES_LIST_FAIL,
      payload: error.response?.data || error.message,
    });
  }
};

/* ==================== BOOKING SUMMARY ==================== */

export const postBookingSummaryAction =
  (payload) =>
  async (dispatch) => {
    dispatch({ type: USER_BOOKING_SUMMARY_REQUEST });
    try {
      const token = localStorage.getItem("userAccessToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const { data } = await PublicAPI.post("bookings/summary/", payload, {
        headers,
      });
      dispatch({ type: USER_BOOKING_SUMMARY_SUCCESS, payload: data });
      dispatch(setBookingSummary({ ...data, ticket_id: payload?.ticket_id ?? null }));
      return { ok: true, data };
    } catch (error) {
      const status = error?.response?.status;
      const payloadErr = error.response?.data || error.message;
      dispatch({ type: USER_BOOKING_SUMMARY_FAIL, payload: payloadErr });
      return { ok: false, status, data: payloadErr };
    }
  };

export const createBookingAction =
  (payload) =>
  async (dispatch) => {
    dispatch({ type: USER_BOOKING_CREATE_REQUEST });
    try {
      const token = localStorage.getItem("userAccessToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const { data } = await PublicAPI.post("bookings/", payload, { headers });
      dispatch({ type: USER_BOOKING_CREATE_SUCCESS, payload: data });
      return { ok: true, data };
    } catch (error) {
      const status = error?.response?.status;
      const payloadErr = error.response?.data || error.message;
      dispatch({ type: USER_BOOKING_CREATE_FAIL, payload: payloadErr });
      return { ok: false, status, data: payloadErr };
    }
  };

export const createPaymentOrderAction =
  (bookingId) =>
  async (dispatch) => {
    dispatch({ type: USER_PAYMENT_ORDER_REQUEST });
    try {
      const token = localStorage.getItem("userAccessToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const { data } = await PublicAPI.post(
        `payments/${bookingId}/create-order/`,
        {},
        { headers }
      );
      dispatch({ type: USER_PAYMENT_ORDER_SUCCESS, payload: data });
      return { ok: true, data };
    } catch (error) {
      const status = error?.response?.status;
      const payloadErr = error.response?.data || error.message;
      dispatch({ type: USER_PAYMENT_ORDER_FAIL, payload: payloadErr });
      return { ok: false, status, data: payloadErr };
    }
  };

export const capturePaymentAction =
  (paymentId, payload) =>
  async (dispatch) => {
    dispatch({ type: USER_PAYMENT_CAPTURE_REQUEST });
    try {
      const token = localStorage.getItem("userAccessToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const { data } = await PublicAPI.post(
        `payments/${paymentId}/pay/`,
        payload,
        { headers }
      );
      dispatch({ type: USER_PAYMENT_CAPTURE_SUCCESS, payload: data });
      return { ok: true, data };
    } catch (error) {
      const status = error?.response?.status;
      const payloadErr = error.response?.data || error.message;
      dispatch({ type: USER_PAYMENT_CAPTURE_FAIL, payload: payloadErr });
      return { ok: false, status, data: payloadErr };
    }
  };

const normalizeContact = (data) => {
  if (!data) return null;
  return {
    name: data.name,
    address: data.address,
    phone: data.phone,
    email: data.email,
    whatsapp: data.whatsapp,
    google_map_link: data.google_map_link,
  };
};

export const getUserContactAction = () => async (dispatch) => {
  dispatch({ type: USER_CONTACT_REQUEST });
  try {
    const { data } = await PublicAPI.get("/cms/contact-info/");
    dispatch({
      type: USER_CONTACT_SUCCESS,
      payload: normalizeContact(data),
    });
  } catch (error) {
    dispatch({
      type: USER_CONTACT_FAIL,
      payload: error.response?.data || error.message,
    });
  }
};

export const postContactAction = (payload) => async (dispatch) => {
  dispatch({ type: USER_CONTACT_SEND_REQUEST });
  try {
    await PublicAPI.post("cms/contact/", payload);
    dispatch({ type: USER_CONTACT_SEND_SUCCESS });
  } catch (error) {
    dispatch({
      type: USER_CONTACT_SEND_FAIL,
      payload: error.response?.data || error.message,
    });
  }
};

const normalizeTerms = (data) => ({
  id: data.id,
  slug: data.slug,
  title: data.title,
  body: data.body,
  isActive: data.is_active,
});

export const getUserTermsAction = () => async (dispatch) => {
  dispatch({ type: USER_TERMS_REQUEST });
  try {
    const { data } = await PublicAPI.get("cms/pages/terms-and-conditions/");
    dispatch({
      type: USER_TERMS_SUCCESS,
      payload: normalizeTerms(data),
    });
  } catch (error) {
    dispatch({
      type: USER_TERMS_FAIL,
      payload: error.response?.data || error.message,
    });
  }
};

const normalizePrivacy = (data) => ({
  id: data.id,
  slug: data.slug,
  title: data.title,
  body: data.body,
  isActive: data.is_active,
});

export const getUserPrivacyAction = () => async (dispatch) => {
  dispatch({ type: USER_PRIVACY_REQUEST });
  try {
    const { data } = await PublicAPI.get("cms/pages/privacy-policy/");
    dispatch({
      type: USER_PRIVACY_SUCCESS,
      payload: normalizePrivacy(data),
    });
  } catch (error) {
    dispatch({
      type: USER_PRIVACY_FAIL,
      payload: error.response?.data || error.message,
    });
  }
};

const normalizeAmenities = (data) =>
  Array.isArray(data)
    ? data.map((a, i) => ({
        id: a.id ?? i,
        name: a.name ?? "",
        image:
          typeof a.image === "string"
            ? a.image.replace(/`/g, "").trim()
            : a.image || "",
      }))
    : [];

export const getUserAmenitiesAction = () => async (dispatch) => {
  dispatch({ type: USER_AMENITIES_REQUEST });
  try {
    const { data } = await PublicAPI.get("cms/amenities/");
    dispatch({
      type: USER_AMENITIES_SUCCESS,
      payload: normalizeAmenities(data),
    });
  } catch (error) {
    dispatch({
      type: USER_AMENITIES_FAIL,
      payload: error.response?.data || error.message,
    });
  }
};

/* ==================== ABOUT PAGE ==================== */

const normalizeAbout = (data) => {
  if (!data) return null;
  return {
    title: data.title || "",
    description: data.description || "",
    main_image: data.main_image || "",
    cards: Array.isArray(data.cards)
      ? data.cards.map((card) => ({
          id: card.id,
          title: card.title || "",
          header: card.header || "",
          image: card.image || "",
          features: Array.isArray(card.features)
            ? card.features.map((feature) => ({
                id: feature.id,
                title: feature.title || "",
                icon: feature.icon || null,
              }))
            : [],
        }))
      : [],
    rides_count: data.rides_count || 0,
    users_count: data.users_count || 0,
    rooms_count: data.rooms_count || 0,
    avg_rating: data.avg_rating || 0,
  };
};

export const getUserAboutAction = () => async (dispatch) => {
  dispatch({ type: USER_ABOUT_REQUEST });
  try {
    const { data } = await PublicAPI.get("cms/about/");
    dispatch({
      type: USER_ABOUT_SUCCESS,
      payload: normalizeAbout(data),
    });
  } catch (error) {
    dispatch({
      type: USER_ABOUT_FAIL,
      payload: error.response?.data || error.message,
    });
  }
};

/* ==================== FAQ PAGE ==================== */

const normalizeFaq = (data) =>
  Array.isArray(data)
    ? data
        .filter((item) => item.is_active)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((faq) => ({
          id: faq.id,
          question: faq.question || "",
          answer: faq.answer || "",
          order: faq.order || 0,
          is_active: !!faq.is_active,
        }))
    : [];

export const getUserFaqAction = () => async (dispatch) => {
  dispatch({ type: USER_FAQ_REQUEST });
  try {
    const { data } = await PublicAPI.get("cms/faqs/");
    dispatch({
      type: USER_FAQ_SUCCESS,
      payload: normalizeFaq(data),
    });
  } catch (error) {
    dispatch({
      type: USER_FAQ_FAIL,
      payload: error.response?.data || error.message,
    });
  }
};

/* ==================== HALL / AUDITORIUM ==================== */

const normalizeHall = (data) => {
  if (!data) return null;
  return {
    id: data.id,
    title: data.title || "",
    tagline: data.tagline || "",
    description: data.description || "",
    main_image: data.main_image || "",
    capacity: data.capacity || 0,
    area: data.area || "",
    hall_type: data.hall_type || "",
    air_conditioning: !!data.air_conditioning,
    parking: data.parking || "",
    phone_number: data.phone_number || "",
    email: data.email || "",
    gallery: Array.isArray(data.gallery)
      ? data.gallery.map((item) => ({
          id: item.id,
          image: item.image || "",
          title: item.title || "",
        }))
      : [],
    features: Array.isArray(data.features)
      ? data.features.map((feature) => ({
          id: feature.id,
          name: feature.name || "",
          feature_type: feature.feature_type || "FACILITY",
        }))
      : [],
  };
};

export const getUserHallAction = () => async (dispatch) => {
  dispatch({ type: USER_HALL_REQUEST });
  try {
    const { data } = await PublicAPI.get("cms/hall/");
    dispatch({
      type: USER_HALL_SUCCESS,
      payload: normalizeHall(data),
    });
  } catch (error) {
    dispatch({
      type: USER_HALL_FAIL,
      payload: error.response?.data || error.message,
    });
  }
};

/* ==================== PROFILE (authenticated) ==================== */
 
// GET /api/auth/me/profile/
export const fetchMyProfile = () => async (dispatch) => {
  dispatch({ type: PROFILE_FETCH_REQUEST });
  try {
    const token = localStorage.getItem("userAccessToken");
    const { data } = await PublicAPI.get("auth/me/profile/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({ type: PROFILE_FETCH_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PROFILE_FETCH_FAIL,
      payload: error.response?.data?.detail || error.message,
    });
  }
};
 
// PUT /api/auth/me/profile/

/* ==================== MY BOOKINGS (authenticated) ==================== */
export const getMyBookingsAction = () => async (dispatch) => {
  dispatch({ type: USER_MY_BOOKINGS_REQUEST });
  try {
    const token = localStorage.getItem("userAccessToken");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const { data } = await PublicAPI.get("bookings/my/", { headers });
    const mapped = Array.isArray(data)
      ? data.map((b) => ({
          id: b.id,
          booking_type: b.booking_type || "",
          status: b.status || "",
          payment_status: b.payment_status || "",
          visit_date:
            b.booking_date?.visit_date ||
            b.visit_date ||
            null,
          check_in: b.booking_date?.check_in || b.start_time || null,
          check_out: b.booking_date?.check_out || null,
          start_time: b.booking_date?.start_time || null,
          amount: parseFloat(b.amount || 0) || 0,
          testimonial: b.testimonial || null,
          details: b.details || null,
        }))
      : [];
    dispatch({ type: USER_MY_BOOKINGS_SUCCESS, payload: mapped });
  } catch (error) {
    dispatch({
      type: USER_MY_BOOKINGS_FAIL,
      payload: error.response?.data || error.message,
    });
  }
};
export const updateMyProfile = (formData) => async (dispatch) => {
  dispatch({ type: PROFILE_UPDATE_REQUEST });
  try {
    const token = localStorage.getItem("userAccessToken");
    const { data } = await PublicAPI.put("auth/me/profile/", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    dispatch({ type: PROFILE_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PROFILE_UPDATE_FAIL,
      payload: error.response?.data || error.message,
    });
  }
};
 
// PATCH /api/auth/me/profile/
export const patchMyProfile = (formData) => async (dispatch) => {
  dispatch({ type: PROFILE_UPDATE_REQUEST });
  try {
    const token = localStorage.getItem("userAccessToken");
    const { data } = await PublicAPI.patch("auth/me/profile/", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    dispatch({ type: PROFILE_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PROFILE_UPDATE_FAIL,
      payload: error.response?.data || error.message,
    });
  }
};
 
// Clear success/error after save
export const resetProfileUpdate = () => (dispatch) => {
  dispatch({ type: PROFILE_UPDATE_RESET });
};

/* ==================== TESTIMONIALS ==================== */

export const createTestimonialAction = (payload) => async (dispatch) => {
  dispatch({ type: USER_TESTIMONIAL_CREATE_REQUEST });
  try {
    const token = localStorage.getItem("userAccessToken");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const { data } = await PublicAPI.post("cms/testimonials/create/", payload, {
      headers,
    });
    dispatch({ type: USER_TESTIMONIAL_CREATE_SUCCESS, payload: data });
    return { ok: true, data };
  } catch (error) {
    const payloadErr = error.response?.data || error.message;
    dispatch({ type: USER_TESTIMONIAL_CREATE_FAIL, payload: payloadErr });
    return { ok: false, error: payloadErr };
  }
};

export const updateTestimonialAction = (id, payload) => async (dispatch) => {
  dispatch({ type: USER_TESTIMONIAL_UPDATE_REQUEST });
  try {
    const token = localStorage.getItem("userAccessToken");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const { data } = await PublicAPI.patch(`cms/my-testimonials/${id}/`, payload, {
      headers,
    });
    dispatch({ type: USER_TESTIMONIAL_UPDATE_SUCCESS, payload: data });
    return { ok: true, data };
  } catch (error) {
    const payloadErr = error.response?.data || error.message;
    dispatch({ type: USER_TESTIMONIAL_UPDATE_FAIL, payload: payloadErr });
    return { ok: false, error: payloadErr };
  }
};
 

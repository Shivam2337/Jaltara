import { createStore, combineReducers, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";

import authReducer, { staffUsersReducer } from "./reducer/AdminLoginReducer";
import { AdminWaterParkPricingReducer } from "./reducer/AdminWaterParkPricingReducer";
import AdminRideReducer from "./reducer/AdminRideReducer";
import { AdminPackageReducer } from "./reducer/AdminPackageReducer";
import { packageItemReducer } from "./reducer/AdminPackageItemReducer";
import { packagePricingReducer } from "./reducer/AdminPackagePricingReducer";
import AdminRoomsReducer from "./reducer/AdminRoomsReducer";
import { AdminRoomPricingReducer } from "./reducer/AdminRoomPricingReducer";
import categoriesReducer from "./reducer/AdminRoomCategoriesReducer";
import AdminRoomBookingReducer from "./reducer/AdminRoomBookingReducer";
import AdminAddOnReducer from "./reducer/AdminAddOnsReducer";
import AdminAddOnPricingReducer from "./reducer/AdminAddOnPricingReducer";
import AdminAmenitiesReducer from "./reducer/AdminAmenitiesReducer";
import AdminTicketTypeReducer from "./reducer/AdminTicketTypeReducer";
import { AdminTicketPricingReducer } from "./reducer/AdminTicketPricingReducer";
import { AdminCouponReducer } from "./reducer/AdminCouponReducer";
import { AdminAuditoriumReducer } from "./reducer/AdminAuditoriumReducer";
import { AdminAuditoriumPricingReducer } from "./reducer/AdminAuditoriumPricingReducer";
import { AdminTestimonialReducer } from "./reducer/AdminTestimonialReducer";
import { AdminWpRReducer } from "./reducer/AdminWpRReducer";
import { AdminGallaryReducer } from "./reducer/AdminGallaryReducer";

import { AdminContactReducer } from "./reducer/AdminContactReducer";

import {
  UserPackagesReducer,
  UserTestimonialsReducer,
  UserRidesReducer,
  UserGalleryReducer,
  UserRoomsReducer,
  UserWprSectionsReducer,
  UserAmenitiesReducer,
  UserAboutReducer,
  UserFaqReducer,
  UserHallReducer,
  UserAddonsReducer,
  UserTicketsReducer,
  UserRoomsListReducer,
  UserPackagesListReducer,
  UserBookingSummaryReducer,
  UserBookingCreateReducer,
  UserPaymentReducer,
  UserPrivacyReducer,
  UserContactReducer,
  UserTermsReducer,
  profileFetchReducer,
  profileUpdateReducer,
  UserMyBookingsReducer,
  UserContactSendReducer,
  UserTestimonialCreateReducer,
  UserTestimonialUpdateReducer,
} from "../redux/UserReducer";
import bookingReducer from "../features/booking/bookingSlice";
import UserAuthReducer from "./UserAuthReducer";
import AdminDashboardReducer from "./reducer/AdminDashboardReducer";
import AdminBookingReducer from "./reducer/AdminBookingReducer";
import AdminPaymentReducer from "./reducer/AdminPaymentReducer";
import { AdminPrivacyTermsReducer } from "./reducer/AdminPrivacyTermsReducer";
import AdminHallReducer from "./reducer/AdminHallReducer";
import AdminNotificationReducer from "./reducer/AdminNotificationReducer";
import { AdminFaqReducer } from "./reducer/AdminFaqReducer";
import { AdminAboutReducer } from "./reducer/AdminAboutReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  staffUsersList: staffUsersReducer,
  waterParkPricing: AdminWaterParkPricingReducer,
  rides: AdminRideReducer,
  packages: AdminPackageReducer,
  packageItems: packageItemReducer,
  packagePricing: packagePricingReducer,
  rooms: AdminRoomsReducer,
  pricing: AdminRoomPricingReducer,
  categories: categoriesReducer,
  bookings: AdminRoomBookingReducer,
  addons: AdminAddOnReducer,
  amenities: AdminAmenitiesReducer,
  adminContactList: AdminContactReducer,
  addonPricing: AdminAddOnPricingReducer,
  ticketTypes: AdminTicketTypeReducer,
  ticketPricing: AdminTicketPricingReducer,
  coupons: AdminCouponReducer,
  auditoriums: AdminAuditoriumReducer,
  auditoriumPricing: AdminAuditoriumPricingReducer,
  testimonials: AdminTestimonialReducer,
  wprSections: AdminWpRReducer,
  gallary: AdminGallaryReducer,
  AdminPrivacyTerms: AdminPrivacyTermsReducer,
  Faq: AdminFaqReducer,
  AboutPage: AdminAboutReducer,

  userPackages: UserPackagesReducer,
  userTestimonials: UserTestimonialsReducer,
  userRides: UserRidesReducer,
  userGallery: UserGalleryReducer,
  userRooms: UserRoomsReducer,
  userAddons: UserAddonsReducer,
  userTickets: UserTicketsReducer,
  userRoomsList: UserRoomsListReducer,
  userPackagesList: UserPackagesListReducer,
  userBookingSummary: UserBookingSummaryReducer,
  userBookingCreate: UserBookingCreateReducer,
  userPayment: UserPaymentReducer,
  userContactSend: UserContactSendReducer,
  booking: bookingReducer,
  userAuth: UserAuthReducer,
  userContact: UserContactReducer,
  userTermsAndConditions: UserTermsReducer,
  userPrivacyPolicy: UserPrivacyReducer,
  userWprSections: UserWprSectionsReducer,
  userAmenities: UserAmenitiesReducer,
  userAbout: UserAboutReducer,
  userFaq: UserFaqReducer,
  userHall: UserHallReducer,
  userMyBookings: UserMyBookingsReducer,
  profileFetch: profileFetchReducer, // → state.profileFetch
  profileUpdate: profileUpdateReducer, // → state.profileUpdate
  dashboard: AdminDashboardReducer,
  Adminbookings: AdminBookingReducer,
  payments: AdminPaymentReducer,
  hall: AdminHallReducer,
  notifications: AdminNotificationReducer,
  userTestimonialCreate: UserTestimonialCreateReducer,
  userTestimonialUpdate: UserTestimonialUpdateReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;

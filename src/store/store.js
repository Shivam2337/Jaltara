import { configureStore } from "@reduxjs/toolkit";
import bookingReducer from "../features/booking/bookingSlice";
import {
  UserPackagesReducer,
  UserTestimonialsReducer,
  UserRidesReducer,
  UserGalleryReducer,
  UserRoomsReducer,
} from "../redux/UserReducer";

export const store = configureStore({
  reducer: {
    booking: bookingReducer,
    userPackages: UserPackagesReducer,
    userTestimonials: UserTestimonialsReducer,
    userRides: UserRidesReducer,
    userGallery: UserGalleryReducer,
    userRooms: UserRoomsReducer,
  },
});

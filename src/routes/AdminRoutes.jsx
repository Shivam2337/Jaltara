import { Routes, Route } from "react-router-dom";
import ProtectedAdminRoute from "./ProtectedAdminRoute";

import AdminDashboard from "../pages/auth/admin/AdminDashboard";
import AdminRoomCategories from "../pages/auth/admin/AdminRoomCategories";
import AdminRoomPricing from "../pages/auth/admin/AdminRoomPricing";
import AdminRooms from "../pages/auth/admin/AdminRooms";
import AdminPackagePricing from "../components/Admin/Package/AdminPackagePricing";
import AdminPackage from "../components/Admin/Package/AdminPackage";
import AdminRide from "../components/Admin/Ride/AdminRide";
import AdminWaterParkRidePricing from "../components/Admin/Ride/AdminWaterParkRidePricing";
import AdminLayout from "../layout/AdminLayout";
import AdminLogin from "../components/Admin/AdminLogReg/AdminLogin";
import AdminRegister from "../components/Admin/AdminLogReg/AdminRegister";
import AdminPackageItem from "../components/Admin/Package/AdminPackageItem";
import AdminRoomBookings from "../pages/auth/admin/AdminRoomBookings";
import AdminAddOns from "../components/Admin/AdminAddOns/AdminAddOns";
import AdminAddOnsPricing from "../components/Admin/AdminAddOns/AdminAddOnsPricing";
import AdminAmenities from "../pages/auth/admin/AdminAmenities";
import AdminTicketType from "../components/Admin/TicketType/AdminTicketType";
import AdminTicketPricing from "../components/Admin/TicketType/AdminTicketPricing";
import AdminCoupon from "../components/Admin/AdminCoupon/AdminCoupon";
import AdminAuditorium from "../components/Admin/AdminAuditorium/AdminAuditorium";
import AdminAuditoriumPricing from "../components/Admin/AdminAuditorium/AdminAuditoriumPricing";
import AdminTestimonial from "../components/Admin/AdminTestimonial/AdminTestimonial";
import AdminContact from "../pages/auth/admin/AdminContact";
import AdminWpRSection from "../components/Admin/AdminWpR/AdminWpR";
import AdminGallary from "../components/Admin/AdminGallary/AdminGallary";
import AdminBookingList from "../components/Admin/AdminBooking/AdminBookingList";
import AdminPaymentList from "../components/Admin/AdminBooking/AdminPaymentList";

import AdminRoomManagement from "../components/common/AdminRoomManagement";
import AdminPackageManagement from "../components/common/AdminPackageManagement";
import AdminAddOnsManagement from "../components/common/AdminAddOnsManagement";
import AdminTicketManagement from "../components/common/AdminTicketManagement";
import AdminAuditoriumManagement from "../components/common/AdminAuditoriumManagement";
import AdminPrivacyTerms from "../components/Admin/AdminPrivacyTerms/AdminPrivacyTerms";
import AdminHallPage from "../components/Admin/AdminHall/AdminHallPage";
import AdminHallGallery from "../components/Admin/AdminHall/AdminHallGallery";
import HallFeaturesAdmin from "../components/Admin/AdminHall/AdminHallFeatures";
import AdminHallManagement from "../components/common/AdminHallManagement";
import AdminBookPay from "../components/common/AdminBookPay";

import AdminFaq from "../components/Admin/AdminFaq/AdminFaq";
import AdminAboutPage from "../components/Admin/AdminAboutPage/AdminAboutPage";
export default function AdminRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="AdminLogin" element={<AdminLogin />} />

      {/* Protected Admin Routes */}
      <Route
        element={
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        }
      >
        <Route path="AdminDashboard" element={<AdminDashboard />} />
        <Route path="AdminRoomCategories" element={<AdminRoomCategories />} />
        <Route path="AdminRooms" element={<AdminRooms />} />
        <Route path="AdminRoomPricing" element={<AdminRoomPricing />} />
        <Route path="AdminPackagePricing" element={<AdminPackagePricing />} />
        <Route path="AdminRoomBookings" element={<AdminRoomBookings />} />
        <Route path="AdminPackagePricing" element={<AdminPackagePricing />} />
        <Route path="AdminPackage" element={<AdminPackage />} />
        <Route path="AdminRide" element={<AdminRide />} />
        <Route
          path="AdminWaterParkRidePricing"
          element={<AdminWaterParkRidePricing />}
        />
        <Route path="AdminPackageItem" element={<AdminPackageItem />} />
        <Route path="AdminAddOns" element={<AdminAddOns />} />
        <Route path="AdminAddOnsPricing" element={<AdminAddOnsPricing />} />
        <Route path="AdminAmenities" element={<AdminAmenities />} />
        <Route path="AdminTicketType" element={<AdminTicketType />} />
        <Route path="AdminTicketPricing" element={<AdminTicketPricing />} />
        <Route path="AdminCoupon" element={<AdminCoupon />} />
        <Route path="AdminAuditorium" element={<AdminAuditorium />} />
        <Route
          path="AdminAuditoriumPricing"
          element={<AdminAuditoriumPricing />}
        />
        <Route path="AdminTestimonial" element={<AdminTestimonial />} />
        <Route path="AdminContact" element={<AdminContact />} />

        <Route path="AdminWpR" element={<AdminWpRSection />} />
        <Route path="AdminBookingList" element={<AdminBookingList />} />
        <Route path="AdminPaymentList" element={<AdminPaymentList />} />
        <Route path="AdminGallary" element={<AdminGallary />} />
        <Route path="AdminRegister" element={<AdminRegister />} />

        <Route path="AdminRoomManagement" element={<AdminRoomManagement />} />
        <Route
          path="AdminPackageManagement"
          element={<AdminPackageManagement />}
        />
        <Route
          path="AdminAddOnsManagement"
          element={<AdminAddOnsManagement />}
        />
        <Route
          path="AdminTicketManagement"
          element={<AdminTicketManagement />}
        />
        <Route
          path="AdminAuditoriumManagement"
          element={<AdminAuditoriumManagement />}
        />
        <Route path="AdminPrivacyTerms" element={<AdminPrivacyTerms />} />
        <Route path="AdminHallPage" element={<AdminHallPage />} />
        <Route path="AdminHallGallery" element={<AdminHallGallery />} />
        <Route path="AdminHallFeatures" element={<HallFeaturesAdmin />} />
        <Route path="AdminHallManagement" element={<AdminHallManagement />} />

        <Route path="AdminBookPay" element={<AdminBookPay />} />

        <Route path="AdminFaq" element={<AdminFaq />} />
        <Route path="AdminAboutPage" element={<AdminAboutPage />} />
      </Route>
    </Routes>
  );
}

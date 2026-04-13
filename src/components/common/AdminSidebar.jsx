import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome, FaBed, FaClipboardList, FaWater, FaBoxOpen,
  FaSignOutAlt, FaPuzzlePiece, FaTicketAlt, FaGift,
  FaSwimmingPool, FaListAlt, FaUserPlus, FaCogs, FaImage,
  FaEnvelope, FaFileAlt, FaQuestionCircle, FaBookOpen, FaTheaterMasks,
} from "react-icons/fa";

const AdminSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isSuperuser = localStorage.getItem("isSuperuser") === "true";
  // eslint-disable-next-line no-unused-vars
  const role = localStorage.getItem("adminRole");

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRole");
    localStorage.removeItem("adminUsername");
    localStorage.removeItem("isSuperuser");
    sessionStorage.clear();
    navigate("/AdminLogin", { replace: true });
  };

  const allMenuItems = [
    { name: "Dashboard", path: "/AdminDashboard", icon: <FaHome />, superuserOnly: false },
    { name: "Admin", path: "/AdminRegister", icon: <FaUserPlus />, superuserOnly: true },
    { name: "Waterpark", path: "/AdminRide", icon: <FaWater />, superuserOnly: false },
    { name: "Room", path: "/AdminRoomManagement", icon: <FaBed />, superuserOnly: false },
    { name: "Hall", path: "/AdminHallManagement", icon: <FaTheaterMasks />, superuserOnly: false },
    { name: "Packages", path: "/AdminPackageManagement", icon: <FaBoxOpen />, superuserOnly: false },
    { name: "Addons", path: "/AdminAddOnsManagement", icon: <FaPuzzlePiece />, superuserOnly: false },
    { name: "Ticket", path: "/AdminTicketManagement", icon: <FaTicketAlt />, superuserOnly: false },
    { name: "Coupons", path: "/AdminCoupon", icon: <FaGift />, superuserOnly: false },
    { name: "Booking And Payment", path: "/AdminBookPay", icon: <FaListAlt />, superuserOnly: false },
    { name: "Testimonials", path: "/AdminTestimonial", icon: <FaClipboardList />, superuserOnly: false },
    { name: "Gallery", path: "/AdminGallary", icon: <FaImage />, superuserOnly: false },
    { name: "Water-park And Resort", path: "/AdminWpR", icon: <FaSwimmingPool />, superuserOnly: false },
    { name: "Amenities", path: "/AdminAmenities", icon: <FaCogs />, superuserOnly: false },
    { name: "Enquiry", path: "/AdminContact", icon: <FaEnvelope />, superuserOnly: false },
    { name: "Privacy And Terms", path: "/AdminPrivacyTerms", icon: <FaFileAlt />, superuserOnly: false },
    { name: "FAQ", path: "/AdminFaq", icon: <FaQuestionCircle />, superuserOnly: false },
    { name: "Admin About Page", path: "/AdminAboutPage", icon: <FaBookOpen />, superuserOnly: false },
  ];

  const menuItems = allMenuItems.filter((item) => !(item.superuserOnly && !isSuperuser));

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-[240px] bg-[#1e293b] text-white px-[15px] pt-[15px] pb-[10px] flex flex-col overflow-y-auto overflow-x-hidden z-40 transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Logo */}
        <h2 className="mb-5 text-[20px] font-semibold text-white px-[10px] pt-[10px] pb-[12px] tracking-[0.5px] border-b border-white/20">
          {isSuperuser ? "Super Admin" : "Admin"} Panel
        </h2>

        {/* Menu */}
        <ul className="list-none p-0 m-0">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <li
                key={index}
                className={`mb-[6px] rounded-lg transition-all duration-300 ${isActive ? "bg-white/15" : ""}`}
              >
                <Link
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-[10px] px-[8px] py-[7px] text-[14px] rounded-lg no-underline transition-all duration-300
                    ${isActive ? "text-white font-semibold" : "text-[#cbd5e1] hover:text-[#38bdf8] hover:bg-white/[0.08]"}`}
                >
                  <span className="text-[15px] flex items-center">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Logout */}
        <div className="mt-auto pt-[2px]">
          <button
            onClick={handleLogout}
            className="w-full px-[10px] py-[8px] bg-[#dc2626] hover:bg-[#b91c1c] text-white border-none rounded-lg text-[14px] cursor-pointer flex items-center justify-center gap-[8px] transition-all duration-300"
          >
            <FaSignOutAlt className="text-[15px]" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;

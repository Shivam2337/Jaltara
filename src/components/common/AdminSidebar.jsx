import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBed,
  FaClipboardList,
  FaWater,
  FaBoxOpen,
  FaSignOutAlt,
  FaPuzzlePiece,
  FaTicketAlt,
  FaGift,
  FaSwimmingPool,
  FaListAlt,
  FaUserPlus,
  FaCogs,
  FaImage,
  FaEnvelope,
  FaFileAlt,
  FaQuestionCircle,
  FaBookOpen,
  FaTheaterMasks,
} from "react-icons/fa";
import "./AdminSidebar.css";

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ CHANGE 1 — Read role and isSuperuser from localStorage
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

  // ✅ CHANGE 2 — All menu items with isSuperuserOnly flag
  const allMenuItems = [
    {
      name: "Dashboard",
      path: "/AdminDashboard",
      icon: <FaHome />,
      superuserOnly: false,
    },
    {
      // ✅ CHANGE 4 — Admin Register only for superuser
      name: "Admin",
      path: "/AdminRegister",
      icon: <FaUserPlus />,
      superuserOnly: true,
    },
    {
      name: "Waterpark",
      path: "/AdminRide",
      icon: <FaWater />,
      superuserOnly: false,
    },
    {
      name: "Room",
      path: "/AdminRoomManagement",
      icon: <FaBed />,
      superuserOnly: false,
    },
    {
      name: "Hall",
      path: "/AdminHallManagement",
      icon: <FaTheaterMasks />,
      superuserOnly: false,
    },
    {
      name: "Packages",
      path: "/AdminPackageManagement",
      icon: <FaBoxOpen />,
      superuserOnly: false,
    },
    {
      name: "Addons",
      path: "/AdminAddOnsManagement",
      icon: <FaPuzzlePiece />,
      superuserOnly: false,
    },
    {
      name: "Ticket",
      path: "/AdminTicketManagement",
      icon: <FaTicketAlt />,
      superuserOnly: false,
    },
    {
      name: "Coupons",
      path: "/AdminCoupon",
      icon: <FaGift />,
      superuserOnly: false,
    },
    {
      name: "Booking And Payment",
      path: "/AdminBookPay",
      icon: <FaListAlt />,
      superuserOnly: false,
    },
    {
      name: "Testimonials",
      path: "/AdminTestimonial",
      icon: <FaClipboardList />,
      superuserOnly: false,
    },
    {
      name: "Gallery",
      path: "/AdminGallary",
      icon: <FaImage />,
      superuserOnly: false,
    },
    {
      name: "Water-park And Resort",
      path: "/AdminWpR",
      icon: <FaSwimmingPool />,
      superuserOnly: false,
    },
    {
      name: "Amenities",
      path: "/AdminAmenities",
      icon: <FaCogs />,
      superuserOnly: false,
    },
    {
      name: "Enquiry",
      path: "/AdminContact",
      icon: <FaEnvelope />,
      superuserOnly: false,
    },
    {
      name: "Privacy And Terms",
      path: "/AdminPrivacyTerms",
      icon: <FaFileAlt />,
      superuserOnly: false,
    },
    // {
    //   name: "Amenities",
    //   path: "/AdminAmenities",
    //   icon: <FaCogs />,
    //   superuserOnly: false,
    // },
    {
      name: "Admin Contact",
      path: "/AdminContact",
      icon: <FaCogs />,
      superuserOnly: false,
    },
    {
      name: "FAQ",
      path: "/AdminFaq",
      icon: <FaQuestionCircle />,
      superuserOnly: false,
    },
    {
      name: "Admin About Page",
      path: "/AdminAboutPage",
      icon: <FaBookOpen />,
      superuserOnly: false,
    },
  ];
  // ✅ CHANGE 5 — Filter menu based on role
  const menuItems = allMenuItems.filter((item) => {
    if (item.superuserOnly && !isSuperuser) return false;
    return true;
  });
  return (
    <div className="admin-sidebar">
      {/* ✅ CHANGE 6 — Show role in sidebar header */}
      <h2 className="admin-logo">
        {isSuperuser ? "Super Admin" : "Admin"} Panel
        <span className="logo-underline"></span>
      </h2>

      <ul>
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={location.pathname === item.path ? "active" : ""}
          >
            <Link to={item.path} className="sidebar-link">
              <span className="sidebar-icon">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="logout-container">
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt className="sidebar-icon" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;

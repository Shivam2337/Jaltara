import React, { useEffect, useState } from "react";
import stayImg from "../../../assets/images/room.png";
import room1 from "../../../assets/images/Deluxe 1.jpg";
import room2 from "../../../assets/images/Deluxe 2.jpg";
import room3 from "../../../assets/images/Deluxe 3.jpg";
import { useNavigate } from "react-router-dom";
// import { packages } from "./../../../data/Packages";
import { useDispatch, useSelector } from "react-redux";
import { getUserPackagesAction } from "../../../redux/UserActions";
import { toast } from "react-toastify";
import waterParkImg from "../../../assets/waterpark.jpg";
const WaterparkStay = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list: userPackages = [], loading, error } =
    useSelector((s) => s.userPackages) || {};
  const isLoggedIn =
    useSelector((s) => !!s.userAuth?.token) ||
    !!localStorage.getItem("userAccessToken");

  const [showSlider, setShowSlider] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImages, setSelectedImages] = useState([]);

  const waterparkStays = userPackages.filter((p) => p.package_type === "combo");

  // compute per card
  const handleBook = () => {
    if (isLoggedIn) {
      navigate("/book");
    } else {
      toast.info("Please login to continue booking");
      navigate("/login");
    }
  };

  const openSlider = (imgs, index) => {
    setSelectedImages(imgs);
    setCurrentIndex(index);
    setShowSlider(true);
  };

  const closeSlider = () => setShowSlider(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % selectedImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + selectedImages.length) % selectedImages.length);
  };

  useEffect(() => {
    dispatch(getUserPackagesAction({ package_type: "combo" }));
  }, [dispatch]);

  return (
    <div className="pt-[150px] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 2xl:px-[150px] mx-0 xl:mx-20 pb-8 animate-[waterparkStayFade_0.6s_ease] font-['Outfit']">
      <style>{`@keyframes pkgspin { to { transform: rotate(360deg); } } @keyframes waterparkStayFade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      {loading && (
        <div className="flex justify-center p-6">
          <div
            aria-label="Loading packages"
            className="w-9 h-9 border-[3px] border-gray-200 border-t-[#339af0] rounded-full animate-[pkgspin_0.8s_linear_infinite]"
          />
        </div>
      )}

      {!loading && error && (
        <div className="text-center p-6">
          <img
            src={waterParkImg}
            alt="Error"
            className="max-w-[320px] w-[90%] rounded-lg mx-auto"
          />
          <p className="mt-3 text-slate-500">
            No packages available
          </p>
        </div>
      )}

      {!loading && !error && waterparkStays.length === 0 && (
        <div className="text-center p-6">
          <img
            src={waterParkImg}
            alt="No packages"
            className="max-w-[320px] w-[90%] rounded-lg mx-auto"
          />
          <p className="mt-3 text-slate-500">
            No packages available
          </p>
        </div>
      )}

      {!loading && !error && waterparkStays.map((pkg) => {
        const pricing = pkg.pricings?.[0] || null;
        const imgs = (pkg.images || []).map((img) => img.image);
        const firstImg = imgs[0] || stayImg;
        return (
          <div className="flex flex-col md:flex-row gap-6 md:gap-[30px] bg-white rounded-2xl p-5 md:p-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.1)] items-center mb-6 last:mb-0" key={pkg.id}>
            <div className="flex-1 w-full">
              <h2 className="font-['Outfit'] text-xl sm:text-2xl md:text-[26px] font-semibold text-[#1a92c2] mb-4 md:mb-[18px] text-center md:text-left">{pkg.name}</h2>
              <p className="text-sm md:text-base text-gray-700 mb-2">{pkg.description}</p>
              <div className="my-2.5 text-slate-700 text-sm">
                {pkg.duration_hours != null && (
                  <p><strong>Duration:</strong> {pkg.duration_hours} Hours</p>
                )}
                <p><strong>Included Adults:</strong> {pkg.included_adults ?? 0}</p>
                <p><strong>Included Children:</strong> {pkg.included_children ?? 0}</p>
                <p><strong>Included Seniors:</strong> {pkg.included_seniors ?? 0}</p>
              </div>
              <div className="text-base font-medium text-gray-800 my-3">
                <strong>Price:</strong> ₹{pricing?.base_price || 0}
              </div>
              <button className="mt-4 md:mt-[18px] px-5 md:px-[22px] py-2.5 md:py-[10px] bg-[#e31b23] text-white border-none rounded-md text-sm font-semibold cursor-pointer transition-all duration-300 hover:bg-[#c0161d] w-full sm:w-auto block mx-auto md:mx-0" onClick={handleBook}>
                Book Package
              </button>
            </div>
            <div className="flex-1 w-full">
              <div>
                <img
                  src={firstImg}
                  alt="Waterpark Stay"
                  className="w-full h-auto md:max-h-none max-h-[380px] rounded-[14px] object-cover cursor-pointer"
                  onClick={() => openSlider(imgs, 0)}
                />
                <div className="flex justify-center gap-2 mt-2.5">
                  {imgs.map((_, index) => (
                    <span
                      key={index}
                      className="w-2.5 h-2.5 sm:w-2 sm:h-2 bg-gray-300 rounded-full cursor-pointer hover:bg-[#e31b23]"
                      onClick={() => openSlider(imgs, index)}
                    ></span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {showSlider && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/80 flex items-center justify-center z-[999]">
          <span className="fixed top-20 right-[30px] text-[26px] text-white py-[18px] px-3.5 rounded-full cursor-pointer z-[1000000]" onClick={closeSlider}>
            ✖
          </span>
          <button className="absolute top-1/2 sm:top-1/2 sm:bottom-auto bottom-[10%] left-10 sm:left-10 text-[30px] sm:text-[40px] text-white bg-transparent border-none cursor-pointer select-none" onClick={prevImage}>
            ❮
          </button>
          <img
            src={selectedImages[currentIndex]}
            className="max-w-[95%] sm:max-w-[80%] max-h-[75%] sm:max-h-[80%] rounded-[10px]"
            alt="slider"
          />
          <button className="absolute top-1/2 sm:top-1/2 sm:bottom-auto bottom-[10%] right-10 sm:right-10 text-[30px] sm:text-[40px] text-white bg-transparent border-none cursor-pointer select-none" onClick={nextImage}>
            ❯
          </button>

          <div className="absolute bottom-[14%] sm:bottom-10 flex gap-2.5">
            {selectedImages.map((_, index) => (
              <span
                key={index}
                className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full cursor-pointer ${
                  index === currentIndex ? "bg-[#e31b23]" : "bg-gray-300"
                }`}
                onClick={() => setCurrentIndex(index)}
              ></span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WaterparkStay;

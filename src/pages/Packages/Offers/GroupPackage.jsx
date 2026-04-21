import React, { useEffect, useState } from "react";
import stayImg from "../../../assets/images/rides.png";
import room1 from "../../../assets/images/Cottage 1.jpg";
import room2 from "../../../assets/images/Cottage 2.jpg";
import room3 from "../../../assets/images/Cottage 3.jpg";
import { useNavigate } from "react-router-dom";
// import { packages } from "../../../data/Packages";
import { useDispatch, useSelector } from "react-redux";
import { getUserPackagesAction } from "../../../redux/UserActions";
import { toast } from "react-toastify";
import waterParkImg from "../../../assets/waterpark.jpg";
const GroupPackage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list: userPackages = [], loading, error } =
    useSelector((s) => s.userPackages) || {};
  const isLoggedIn =
    useSelector((s) => !!s.userAuth?.token) ||
    !!localStorage.getItem("userAccessToken");
  const [selectedImages, setSelectedImages] = useState([]);
  useEffect(() => {
    dispatch(getUserPackagesAction({ package_type: "group_package" }));
  }, [dispatch]);

  const [showSlider, setShowSlider] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const groupPackages = userPackages.filter((p) => p.package_type === "group_package");

  const handleBook = () => {
    if (isLoggedIn) {
      navigate("/book");
    } else {
      toast.info("Please login to continue booking");
      navigate("/login");
    }
  };

  const openSlider = (images, index) => {
    setSelectedImages(images);
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

  return (
    <div className="pt-[150px] mx-0 xl:mx-20 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 2xl:px-[150px] pb-8 font-['Outfit']">
      <style>{`@keyframes pkgspin { to { transform: rotate(360deg); } }`}</style>
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

      {!loading && !error && groupPackages.length === 0 && (
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

      {!loading && !error && groupPackages.map((pkg) => {
        const pricing = pkg.pricings?.[0] || null;
        const images = (pkg.images || []).map((img) => img.image);
        const firstImg = images[0] || stayImg;
        return (
          <div className="flex flex-col md:flex-row gap-6 md:gap-[30px] bg-white rounded-2xl p-6 md:p-[30px] shadow-[0_10px_30px_rgba(0,0,0,0.1)] items-center mb-6 last:mb-0" key={pkg.id}>
            <div className="flex-1 w-full">
              <h2 className="text-xl sm:text-2xl md:text-[26px] text-[#1a92c2] mb-3 text-center md:text-left">{pkg.name}</h2>
              <span className="inline-block bg-[#ff9800] text-white px-3 py-1.5 text-[13px] sm:text-xs font-bold rounded-[20px] mb-3">
                👥 15% OFF – Group Special
              </span>

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
              <button className="mt-[18px] px-[22px] py-2.5 bg-[#e31b23] text-white border-none rounded-md font-semibold cursor-pointer transition-all duration-300 hover:bg-[#c0161d] w-full sm:w-auto block mx-auto md:mx-0" onClick={handleBook}>
                Book Group Package
              </button>
            </div>
            <div className="flex-1 w-full">
              <div className="relative">
                <img
                  src={firstImg}
                  alt="Group Package"
                  className="w-full rounded-2xl cursor-pointer md:max-h-none max-h-[380px] object-cover"
                  onClick={() => openSlider(images, 0)}
                />
                <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, index) => (
                    <span
                      key={index}
                      className="w-[9px] h-[9px] sm:w-2 sm:h-2 bg-white/60 rounded-full cursor-pointer hover:bg-white hover:scale-[1.4] transition-transform"
                      onClick={() => openSlider(images, index)}
                    ></span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {showSlider && (
        <div className="fixed inset-0 bg-black/90 flex justify-center items-center z-[999]">
          <span className="fixed top-20 right-[30px] text-[26px] text-white cursor-pointer z-10" onClick={closeSlider}>
            ✖
          </span>

          <button className="absolute top-1/2 sm:top-1/2 sm:bottom-auto bottom-[10%] -translate-y-1/2 sm:-translate-y-1/2 left-10 sm:left-10 text-[30px] sm:text-[40px] text-white bg-transparent border-none cursor-pointer" onClick={prevImage}>
            ❮
          </button>

          <img
            src={selectedImages[currentIndex]}
            className="max-w-[95%] sm:max-w-[80%] max-h-[75%] sm:max-h-[80%] rounded-[10px]"
            alt="slider"
          />

          <button className="absolute top-1/2 sm:top-1/2 sm:bottom-auto bottom-[10%] -translate-y-1/2 sm:-translate-y-1/2 right-10 sm:right-10 text-[30px] sm:text-[40px] text-white bg-transparent border-none cursor-pointer" onClick={nextImage}>
            ❯
          </button>

          <div className="absolute bottom-[18%] sm:bottom-[30px] flex gap-2.5">
            {selectedImages.map((_, index) => (
              <span
                key={index}
                className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-transform ${
                  index === currentIndex ? "bg-white scale-[1.3]" : "bg-white/50"
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

export default GroupPackage;

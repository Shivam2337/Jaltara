import React, { useEffect, useState } from "react";
import ridesImg from "../../assets/images/rides.png";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserRidesAction } from "../../redux/UserActions";
import { toast } from "react-toastify";
import waterParkImg from "../../assets/waterpark.jpg";

const WaterparkRides = () => {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const { list: publicRides = [], loading = false, error = null } = useSelector((s) => s.userRides || {});
  const isLoggedIn = useSelector((s) => !!s.userAuth?.token) || !!localStorage.getItem("userAccessToken");
  const [active, setActive] = useState("family");

  useEffect(() => { dispatch(getUserRidesAction(active === "thrill")); }, [dispatch, active]);

  const sanitize = (u) => (typeof u === "string" ? u.replace(/`/g, "").trim() : u);
  const rides = publicRides;

  const handleBook = () => {
    if (isLoggedIn) { navigate("/book"); }
    else { toast.info("Please login to continue booking"); navigate("/login"); }
  };

  return (
    <div className="max-w-[1200px] mx-auto my-[120px] px-[5px] sm:px-[30px] lg:px-[40px] text-center font-[Outfit] text-[#2b2b2b] animate-[waterRidesFade_0.6s_ease]">

      <style>{`@keyframes wrspin { to { transform: rotate(360deg); } } @keyframes waterRidesFade { from { opacity:0; transform:translateY(15px); } to { opacity:1; transform:translateY(0); } }`}</style>

      <h1 className="font-[Playfair_Display] text-[26px] sm:text-[30px] lg:text-[34px] font-bold mb-[25px]">
        Waterpark Rides
      </h1>

      {/* TOGGLE */}
      <div className="flex justify-center gap-3 sm:gap-5 mb-10 flex-wrap">
        {[{ key: "family", label: "Family / Kids" }, { key: "thrill", label: "High Thrill" }].map(({ key, label }) => (
          <div
            key={key}
            onClick={() => setActive(key)}
            className={`px-5 sm:px-[30px] lg:px-10 py-[10px] sm:py-3 rounded-[10px] border-2 border-[#c7d7de] cursor-pointer text-[14px] sm:text-[16px] lg:text-[18px] font-medium transition-all duration-300 bg-white
              ${active === key ? "bg-[#c7d7de]" : ""}`}
            style={active === key ? { background: "#c7d7de" } : {}}
          >
            {label}
          </div>
        ))}
      </div>

      <h2 className="font-[Playfair_Display] text-[22px] sm:text-[24px] lg:text-[26px] font-semibold mt-[10px] mb-10 inline-block">
        {active === "family" ? "Family / Kids Rides" : "High Thrill Rides"}
      </h2>
      <br />

      {/* LOADING */}
      {loading && (
        <div className="col-span-full flex justify-center p-6">
          <div aria-label="Loading rides"
            className="w-[34px] h-[34px] rounded-full border-[3px] border-[#e5e7eb] border-t-[#339af0]"
            style={{ animation: "wrspin 0.8s linear infinite" }} />
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center w-full text-center">
          <img src={waterParkImg} alt="Error" className="max-w-[280px] w-full" />
          <p>Failed to load rides</p>
        </div>
      )}

      {/* GRID */}
      {!loading && !error && (
        <div className="grid gap-[25px]" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          {rides.map((ride, index) => (
            <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-[0_10px_25px_rgba(0,0,0,0.12)] transition-transform duration-300 hover:-translate-y-2">
              <img
                src={sanitize(ride.img) || ridesImg}
                alt={ride.title}
                className="w-full h-[180px] sm:h-[200px] object-cover"
              />
              <div className="p-[15px] text-left">
                <span className="font-[Outfit] text-[12px] font-medium uppercase text-[#777]">{ride.tag}</span>
                <h3 className="font-[Playfair_Display] text-[18px] sm:text-[20px] font-semibold mt-[6px] text-[#004aad]">{ride.title}</h3>
                <p className="font-[Outfit] text-[13px] sm:text-[14.5px] leading-[1.7] text-[#555] my-[6px]">{ride.description}</p>
                <ul className="pl-[18px] font-[Outfit] text-[13px] sm:text-[14px] leading-[1.8] text-[#444]">
                  {ride.features.map((f, i) => (
                    <li key={i} className="mb-[6px]">{f}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}

          {rides.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center w-full text-center">
              <img src={waterParkImg} alt="Empty" className="max-w-[280px] w-full" />
              <p>No rides available.</p>
            </div>
          )}
        </div>
      )}

      {/* BOOK BUTTON */}
      {!loading && !error && rides.length > 0 && (
        <button
          onClick={handleBook}
          className="mt-[50px] px-8 py-3 rounded-md border-none bg-[#e31b23] hover:bg-[#c5181f] text-white font-[Outfit] font-semibold tracking-[0.3px] cursor-pointer transition-all duration-300 w-full sm:w-auto"
        >
          Book Now
        </button>
      )}
    </div>
  );
};

export default WaterparkRides;

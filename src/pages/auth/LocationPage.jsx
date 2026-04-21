import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserContactAction } from "../../redux/UserActions";

const LocationPage = () => {
  const dispatch = useDispatch();
  const { list } = useSelector((state) => state.userContact);

  useEffect(() => { dispatch(getUserContactAction()); }, [dispatch]);

  const data = list || {};
  const [from, setFrom] = useState("Kolhapur Airport");
  const destination = "Jaltara Water Park Morale Palus";

  const handleGetDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(from)}&destination=${encodeURIComponent(destination)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="max-w-[1100px] mx-auto mt-[120px] mb-[60px] px-4 sm:px-5 w-full font-[Outfit] text-[#2b2b2b] animate-[fadeIn_0.6s_ease]">

      <h1 className="font-[Playfair_Display] text-[22px] sm:text-[24px] md:text-[28px] lg:text-[34px] font-bold text-center mb-[26px] text-black">
        Find Us
      </h1>

      {/* MAP */}
      <div className="block w-full bg-white border border-[#e5e7eb] rounded-[14px] shadow-[0_10px_25px_rgba(0,0,0,0.06)] overflow-hidden">
        <iframe
          title="Jaltara Parks Location"
          src={`https://www.google.com/maps?q=${encodeURIComponent(destination)}&output=embed`}
          allowFullScreen
          loading="lazy"
          className="block w-full h-[240px] sm:h-[300px] md:h-[340px] lg:h-[420px] border-none"
        />
      </div>

      {/* DIRECTION BAR */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 md:gap-4 p-4 md:p-[18px] bg-white border border-[#e5e7eb] rounded-[14px] mt-[18px] shadow-[0_10px_25px_rgba(0,0,0,0.06)]">

        <div className="flex flex-col">
          <label className="text-[13px] mb-[6px] text-[#374151]">From</label>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="px-3 py-[10px] w-full text-sm rounded-[10px] border border-[#d1d5db] bg-[#f9fafb] outline-none transition-all duration-200 focus:border-[#339af0] focus:shadow-[0_0_0_3px_rgba(51,154,240,0.15)]"
          >
            <option>Palus Bus stand</option>
            <option>Sangli Bus Stand</option>
            <option>Kolhapur Airport</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-[13px] mb-[6px] text-[#374151]">To</label>
          <select
            value="Jaltara Parks"
            disabled
            className="px-3 py-[10px] w-full text-sm rounded-[10px] border border-[#d1d5db] bg-[#f9fafb] outline-none"
          >
            <option>Jaltara Parks</option>
          </select>
        </div>

        <button
          onClick={handleGetDirections}
          className="self-end w-full md:w-auto px-5 py-3 h-[44px] bg-[#339af0] hover:bg-[#238be6] border-none rounded-[30px] font-semibold cursor-pointer text-white transition-all duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.14)] hover:-translate-y-[1px]"
        >
          Get Directions
        </button>
      </div>
    </div>
  );
};

export default LocationPage;

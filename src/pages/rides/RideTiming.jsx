import React from "react";

const RideTimings = () => {
  return (
    <div className="w-full">
      <div className="max-w-[1100px] mx-auto mt-[50px] px-3 sm:px-[25px] md:px-[40px] lg:px-[60px] xl:px-[80px] py-[25px] sm:py-[30px] md:py-[40px] lg:py-[50px] xl:py-[80px] font-[Segoe_UI,sans-serif] animate-[fadeIn_0.6s_ease]">

        {/* CARD */}
        <div className="relative bg-white text-[#222] px-4 sm:px-[22px] md:px-[30px] py-[22px] sm:py-[28px] md:py-[35px] rounded-[18px] text-center shadow-[0_10px_25px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-[6px] hover:shadow-[0_16px_35px_rgba(0,0,0,0.18)] overflow-hidden">

          {/* Gradient top border */}
          <div className="absolute top-0 left-0 h-[6px] w-full bg-gradient-to-r from-[#1a92c2] to-[#00c6ff]" />

          <h1 className="text-[22px] sm:text-[24px] md:text-[28px] lg:text-[32px] text-[#1a92c2] mb-[25px] font-bold tracking-[1px]">
            Park Timings
          </h1>

          <div className="bg-[#f4faff] px-[14px] py-[14px] rounded-xl mx-auto my-3 w-full sm:max-w-[380px] border border-[#d6efff] transition-colors duration-300 hover:bg-[#e9f6ff]">
            <p className="text-[16px] sm:text-[17px] md:text-[18px] m-0 text-[#333] font-semibold">
              <strong>Monday to Sunday</strong>
            </p>
            <span className="text-[14px] sm:text-[14px] md:text-[16px] block mt-[6px] text-[#555]">
              10:00 AM – 06:00 PM
            </span>
          </div>

          <div className="bg-[#f4faff] px-[14px] py-[14px] rounded-xl mx-auto my-3 w-full sm:max-w-[380px] border border-[#d6efff] transition-colors duration-300 hover:bg-[#e9f6ff]">
            <p className="text-[16px] sm:text-[17px] md:text-[18px] m-0 text-[#333] font-semibold">
              <strong>Rides & Attractions</strong>
            </p>
            <span className="text-[14px] sm:text-[14px] md:text-[16px] block mt-[6px] text-[#555]">
              10:30 AM – 05:30 PM
            </span>
          </div>
        </div>

        {/* NOTES */}
        <div className="mt-[50px] bg-[#f9fbff] px-5 sm:px-6 md:px-[30px] py-5 sm:py-6 md:py-[30px] rounded-[14px] shadow-[0_8px_20px_rgba(0,0,0,0.08)]">
          <h2 className="text-[#004aad] mb-[14px] text-[20px] sm:text-[22px] md:text-[24px] lg:text-[26px]">
            Important Notes
          </h2>
          <ul className="list-none p-0 m-0">
            {[
              "Height and weight restrictions apply on select rides.",
              "Safety harness must be properly fastened at all times.",
              "Only Nylon / Lycra costumes are allowed in water rides.",
              "All rides will be on hold during Wave Pool operations.",
              "Schedule may change due to safety or maintenance.",
              "Re-entry is not permitted.",
            ].map((note, i, arr) => (
              <li key={i} className={`py-[10px] text-[#333] text-[12px] sm:text-[14px] md:text-[16px] ${i < arr.length - 1 ? "border-b border-[#ddd]" : ""}`}>
                {note}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
};

export default RideTimings;

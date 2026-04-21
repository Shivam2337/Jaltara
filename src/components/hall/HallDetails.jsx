import React from "react";
import fallbackImg from "../../assets/home/amenities/auditorium.png";

const badgeCls = "bg-[#eef2ff] border border-[#e5e7eb] px-[10px] py-[6px] rounded-full text-[13px] text-[#334155] flex items-center gap-[6px]";
const iconCls  = "material-symbols-rounded text-[16px] text-[#667eea]";

function StorySection({ imageUrl, children }) {
  return (
    <section className="w-[98%] mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-[60px] mb-24 sm:mb-32 px-4 md:px-0">
      <div className="w-full">
        <img
          className="block w-full rounded-[10px]"
          src={imageUrl}
          alt="Hall"
          onError={(e) => { if (e.currentTarget.src !== fallbackImg) e.currentTarget.src = fallbackImg; }}
        />
      </div>
      <div className="flex flex-col gap-[14px] px-0 md:px-4">
        {children}
      </div>
    </section>
  );
}

export default function HallDetails({ hallData, loading, error }) {
  const sanitize = (u) => (typeof u === "string" ? u.replace(/`/g, "").trim() : u);

  if (loading) return (
    <StorySection imageUrl={fallbackImg}>
      <h2 className="font-[Playfair_Display] text-[24px] sm:text-[32px] font-medium mb-5">- Our Hall</h2>
      <p className="leading-[1.7] text-[14px] sm:text-[18px]">Loading...</p>
    </StorySection>
  );

  if (error) return (
    <StorySection imageUrl={fallbackImg}>
      <h2 className="font-[Playfair_Display] text-[24px] sm:text-[32px] font-medium mb-5">- Our Hall</h2>
      <p className="leading-[1.7] text-[14px] sm:text-[18px]">Failed to load content</p>
    </StorySection>
  );

  const imageUrl    = sanitize(hallData?.main_image) || fallbackImg;
  const featuresList = Array.isArray(hallData?.features) ? hallData.features : [];
  const facilities  = featuresList.filter((f) => f.feature_type === "FACILITY");
  const events      = featuresList.filter((f) => f.feature_type === "EVENT");

  return (
    <StorySection imageUrl={imageUrl}>
      <h2 className="font-[Playfair_Display] text-[24px] sm:text-[32px] font-medium mb-[10px] sm:mb-5">
        {hallData?.title || "Our Hall"}
      </h2>
      <p className="leading-[1.7] text-[14px] sm:text-[18px]">{hallData?.tagline}</p>
      <p className="leading-[1.7] text-[14px] sm:text-[18px]">{hallData?.description}</p>

      {/* BADGES */}
      <div className="flex flex-wrap gap-2 my-2">
        <span className={badgeCls}><span className={iconCls}>groups</span>{hallData?.capacity ? `${hallData.capacity} people` : "Capacity —"}</span>
        <span className={badgeCls}><span className={iconCls}>square_foot</span>{hallData?.area ? `${hallData.area} sq.ft.` : "Area —"}</span>
        <span className={badgeCls}><span className={iconCls}>apartment</span>{hallData?.hall_type || "Type —"}</span>
        <span className={badgeCls}><span className={iconCls}>ac_unit</span>{hallData?.air_conditioning ? "AC: Yes" : "AC: No"}</span>
        <span className={badgeCls}><span className={iconCls}>local_parking</span>{hallData?.parking === true || hallData?.parking === "true" ? "Parking: Yes" : "Parking: No"}</span>
      </div>

      {/* FACILITIES */}
      {facilities.length > 0 && (
        <div>
          <h3 className="text-[18px] text-[#334155] my-2">Facilities</h3>
          <div className="flex flex-wrap gap-[10px]">
            {facilities.map((f) => (
              <span key={f.id} className="inline-flex items-center gap-[6px] px-3 py-2 rounded-full bg-[#eef2ff] text-[#334155] text-[14px] border border-[#e5e7eb]">
                <span className="material-symbols-rounded text-[18px] text-[#667eea]">check_circle</span>
                {f.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* EVENTS */}
      {events.length > 0 && (
        <div className="mt-[14px]">
          <h3 className="text-[18px] text-[#334155] my-2">Perfect For</h3>
          <div className="flex flex-wrap gap-[10px]">
            {events.map((e) => (
              <span key={e.id} className="inline-flex items-center gap-[6px] px-3 py-2 rounded-full bg-[#f3e8ff] text-[#3b0764] text-[14px] border border-[#edd4ff]">
                <span className="material-symbols-rounded text-[18px] text-[#7c3aed]">celebration</span>
                {e.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </StorySection>
  );
}

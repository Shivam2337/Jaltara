import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserGalleryAction } from "../../redux/UserActions";
import waterParkImg from "../../assets/waterpark.jpg";

export default function Gallery() {
  const [activeTab, setActiveTab] = useState("All");
  const dispatch = useDispatch();
  const items   = useSelector((s) => s.userGallery?.list    || []);
  const loading = useSelector((s) => s.userGallery?.loading || false);
  const error   = useSelector((s) => s.userGallery?.error   || null);

  useEffect(() => {
    const params = activeTab === "All" ? {} : { category: activeTab };
    dispatch(getUserGalleryAction(params));
  }, [dispatch, activeTab]);

  const categories = useMemo(() => [
    "All", "Water Park", "Activities", "Resort & Stay", "Family & Group", "Special Events",
  ], []);

  const filteredImages = activeTab === "All"
    ? items
    : items.filter((img) => {
        const a = (img.category || "").toLowerCase().trim();
        const b = (activeTab   || "").toLowerCase().trim();
        return a === b;
      });

  return (
    <div className="max-w-[1100px] mx-auto  mb-20 px-[10px] sm:px-[60px]  pt-[90px] sm:pt-[100px] md:pt-[120px] lg:pt-[140px]  font-[Outfit] animate-[fadeIn_0.6s_ease]">

      <h1 className="text-center text-[24px] sm:text-[36px] font-bold mb-[30px] text-[#2b2b2b]">
        Gallery
      </h1>

      {/* TABS */}
      <div className="flex justify-center gap-[5px] sm:gap-5 my-[30px] sm:my-[40px] flex-wrap border-b border-[#eee]">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            style={activeTab === cat ? { borderBottom: "2px solid #f7b500" } : { borderBottom: "2px solid transparent" }}
            className={`text-[14px] sm:text-[16px] px-3 py-2 cursor-pointer rounded border-none bg-transparent font-normal transition-all duration-300
              ${activeTab === cat ? "text-[#f7b500]" : "text-[#222] hover:text-[#f7b500]"}`}
          >
            {cat === "All" ? "All Photos" : cat}
          </button>
        ))}
      </div>

      <style>{`@keyframes gspin { to { transform: rotate(360deg); } } @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`}</style>

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center p-6">
          <div aria-label="Loading photos"
            className="w-9 h-9 rounded-full border-[3px] border-[#e5e7eb] border-t-[#339af0]"
            style={{ animation: "gspin 0.8s linear infinite" }}
          />
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div className="text-center p-6">
          <img src={waterParkImg} alt="Error" className="max-w-[320px] w-[90%] rounded-lg mx-auto" />
          <p className="mt-3 text-[#64748b]">Failed to load photos</p>
        </div>
      )}

      {/* EMPTY */}
      {!loading && !error && filteredImages.length === 0 && (
        <div className="text-center p-6">
          <img src={waterParkImg} alt="No photos" className="max-w-[320px] w-[90%] rounded-lg mx-auto" />
          <p className="mt-3 text-[#64748b]">No photos found</p>
        </div>
      )}

      {/* GRID */}
      {!loading && !error && filteredImages.length > 0 && (
        <div className="grid gap-[10px] sm:gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
          {filteredImages.map((img) => {
            const src = typeof img.src === "string" ? img.src.replace(/`/g, "").trim() : img.src;
            return (
              <div key={img.id} className="rounded-xl overflow-hidden h-full">
                <img
                  src={src}
                  alt={img.category || "Gallery"}
                  loading="lazy"
                  className="w-full h-full sm:h-[220px] object-cover transition-transform duration-[350ms] ease-in-out hover:scale-[1.08]"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

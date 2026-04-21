import React, { useState } from "react";
import fallbackImg from "../../assets/home/amenities/auditorium.png";

export default function HallGallery({ hallData, loading, error }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const sanitize = (u) => typeof u === "string" ? u.replace(/`/g, "").trim() : u;
  const gallery = Array.isArray(hallData?.gallery) ? hallData.gallery : [];
  const len = gallery.length;
  const next = () => setSelectedImage((i) => (i + 1) % len);
  const prev = () => setSelectedImage((i) => (i - 1 + len) % len);

  const Wrapper = ({ children }) => (
    <section className="pb-[60px] md:pb-[60px] px-5 xl:px-0 bg-white">
      <h2 className="text-center text-[28px] md:text-[36px] font-bold mb-10 text-[#333]">Gallery</h2>
      {children}
    </section>
  );

  if (loading) return <Wrapper><p className="text-center">Loading gallery...</p></Wrapper>;
  if (error)   return <Wrapper><p className="text-center">No gallery images available</p></Wrapper>;
  if (!gallery || gallery.length === 0) return <Wrapper><p className="text-center">No gallery images available</p></Wrapper>;

  return (
    <Wrapper>
      <div className="max-w-[1200px] mx-auto flex flex-col gap-[30px]">

        {/* MAIN IMAGE */}
        <div className="flex flex-col gap-[15px] relative">
          <img
            src={sanitize(gallery[selectedImage]?.image) || fallbackImg}
            alt={gallery[selectedImage]?.title}
            className="w-full h-[300px] md:h-[400px] object-cover rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
            onError={(e) => { if (e.currentTarget.src !== fallbackImg) e.currentTarget.src = fallbackImg; }}
          />
          <button aria-label="Previous" onClick={prev}
            className="absolute top-1/2 left-3 -translate-y-1/2 w-9 h-9 rounded-full border-none bg-black/50 text-white cursor-pointer">❮</button>
          <button aria-label="Next" onClick={next}
            className="absolute top-1/2 right-3 -translate-y-1/2 w-9 h-9 rounded-full border-none bg-black/50 text-white cursor-pointer">❯</button>
          <p className="text-center text-[18px] font-semibold text-[#333] m-0">{gallery[selectedImage]?.title}</p>
        </div>

        {/* THUMBNAILS */}
        <div className="grid gap-[15px]" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))" }}>
          {gallery.map((image, index) => (
            <div
              key={image.id || index}
              onClick={() => setSelectedImage(index)}
              className={`cursor-pointer rounded-lg overflow-hidden border-[3px] transition-all duration-300 aspect-square
                ${selectedImage === index
                  ? "border-[#667eea] shadow-[0_4px_12px_rgba(102,126,234,0.4)]"
                  : "border-transparent hover:border-[#667eea] hover:scale-105"}`}
            >
              <img
                src={sanitize(image.image) || fallbackImg}
                alt={image.title}
                className="w-full h-full object-cover"
                onError={(e) => { if (e.currentTarget.src !== fallbackImg) e.currentTarget.src = fallbackImg; }}
              />
            </div>
          ))}
        </div>

        {/* DOTS */}
        <div className="flex justify-center gap-[6px] mt-2">
          {gallery.map((_, i) => (
            <span key={i} onClick={() => setSelectedImage(i)}
              className="w-2 h-2 rounded-full cursor-pointer transition-all"
              style={{ background: i === selectedImage ? "#667eea" : "#d1d5db" }}
            />
          ))}
        </div>
      </div>
    </Wrapper>
  );
}

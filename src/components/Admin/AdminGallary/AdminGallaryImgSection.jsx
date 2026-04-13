import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGallaryImages, updateGallaryImageStatus } from "../../../redux/actions/AdminGallaryAction";
import { toast } from "react-toastify";

export default function AdminGallaryImgSection({ selectedCategory }) {
  const dispatch = useDispatch();
  const { images, loading } = useSelector((state) => state.gallary);

  useEffect(() => { dispatch(getGallaryImages()); }, [dispatch]);

  const filteredImages = images
    ?.filter((img) => selectedCategory?.id === "all" ? true : img.category === selectedCategory?.id)
    ?.sort((a, b) => b.is_active - a.is_active);

  const handleToggleStatus = async (img) => {
    try {
      const res = await dispatch(updateGallaryImageStatus(img.id, !img.is_active));
      if (res) toast.success("Image Status updated");
      else toast.error("Unable to update status");
    } catch { toast.error("Something went wrong"); }
  };

  return (
    <div>
      {selectedCategory ? (
        <>
          <h3 className="text-[20px] font-medium text-center mb-6 capitalize">{selectedCategory.name}</h3>

          <div className="grid gap-[14px]" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))" }}>
            {filteredImages?.length ? (
              filteredImages.map((img) => (
                <div
                  key={img.id}
                  className={`bg-white rounded-xl overflow-hidden border border-[#eee]
                    ${!img.is_active ? "[&_img]:grayscale-[60%] [&_img]:opacity-60" : ""}`}
                >
                  <div className="w-full h-[200px] relative overflow-hidden">
                    {img.image ? (
                      <img src={img.image} alt={img.title} className="w-full h-full object-cover block" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#999] text-sm">No Image</div>
                    )}

                    {/* OVERLAY */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-all duration-300">
                      <button
                        onClick={() => handleToggleStatus(img)}
                        className={`px-[8px] py-[8px] border-none rounded-md text-base cursor-pointer text-white
                          ${img.is_active ? "bg-[#007bff]" : "bg-[#9a9a9a]"}`}
                      >
                        {img.is_active ? "Allowed" : "Not Allowed"}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-[#9ca3af]">No images in this category</p>
            )}
          </div>
        </>
      ) : (
        <p></p>
      )}
    </div>
  );
}

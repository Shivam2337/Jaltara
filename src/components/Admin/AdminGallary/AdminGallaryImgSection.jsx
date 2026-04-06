import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getGallaryImages,
  updateGallaryImageStatus,
} from "../../../redux/actions/AdminGallaryAction";

import { toast } from "react-toastify";

export default function AdminGallaryImgSection({ selectedCategory }) {
  const dispatch = useDispatch();

  const { images, loading } = useSelector((state) => state.gallary);

  useEffect(() => {
    dispatch(getGallaryImages());
  }, [dispatch]);

  /* ================= FILTER + SORT ================= */
  const filteredImages = images
    ?.filter((img) =>
      selectedCategory?.id === "all"
        ? true
        : img.category === selectedCategory?.id
    )
    ?.sort((a, b) => b.is_active - a.is_active);

  /* ================= TOGGLE STATUS ================= */
  const handleToggleStatus = async (img) => {
    try {
      const res = await dispatch(
        updateGallaryImageStatus(img.id, !img.is_active)
      );

      if (res) {
        toast.success(" Image Status updated");
      } else {
        toast.error("Unable to update status");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="admin-gallary-images-section">
      {selectedCategory ? (
        <>
          <h3 className="admin-gallary-grid-images-title">
            {selectedCategory.name}
          </h3>

          <div className="admin-gallary-images-grid">
            {filteredImages?.length ? (
              filteredImages.map((img) => (
                <div
                  key={img.id}
                  className={`admin-gallary-image-card ${
                    !img.is_active ? "admin-gallary-status-inactive" : ""
                  }`}
                >
                  <div className="admin-gallary-image-wrapper">
                    {img.image ? (
                      <img
                        src={img.image}
                        alt={img.title}
                        className="admin-gallary-image"
                      />
                    ) : (
                      <div className="admin-gallary-no-image">No Image</div>
                    )}

                    <div className="admin-gallary-image-overlay">
                      <button
                        onClick={() => handleToggleStatus(img)}
                        className={`admin-gallary-status-btn ${
                          img.is_active
                            ? "admin-gallary-status-btn-active"
                            : "admin-gallary-status-btn-inactive"
                        }`}
                      >
                        {img.is_active ? "Allowed" : "Not Allowed"}
                      </button>
                    </div>
                  </div>

                  {/* <p className="admin-gallary-image-title">{img.title}</p> */}
                </div>
              ))
            ) : (
              <p>No images in this category</p>
            )}
          </div>
        </>
      ) : (
        <p></p>
      )}
    </div>
  );
}

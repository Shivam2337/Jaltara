import React, { useEffect, useState } from "react";
import "./AdminWpR.css";

import { useDispatch, useSelector } from "react-redux";
import {
  getWpRSections,
  updateWpRSection,
  createWpRSection,
} from "../../../redux/actions/AdminWpRAction";

import { toast } from "react-toastify";

const AdminWpRSection = () => {
  const dispatch = useDispatch();
  const { sections } = useSelector((state) => state.wprSections);

  const [waterPark, setWaterPark] = useState({});
  const [resort, setResort] = useState({});

  const [waterExists, setWaterExists] = useState(false);
  const [resortExists, setResortExists] = useState(false);

  useEffect(() => {
    dispatch(getWpRSections());
  }, [dispatch]);

  useEffect(() => {
    if (sections?.length) {
      const wp = sections.find((s) => s.id === 1);
      const rs = sections.find((s) => s.id === 2);

      if (wp) {
        setWaterPark(wp);
        setWaterExists(true);
      }

      if (rs) {
        setResort(rs);
        setResortExists(true);
      }
    }
  }, [sections]);

  const getImagePreview = (image) => {
    if (!image) return null;
    if (image instanceof File) return URL.createObjectURL(image);
    return image;
  };

  const handleChange = (e, type) => {
    const { name, value, files } = e.target;
    const val = files ? files[0] : value;

    if (type === "water") {
      setWaterPark({ ...waterPark, [name]: val });
    } else {
      setResort({ ...resort, [name]: val });
    }
  };

  /* ===== IMAGE CHANGE HELPER ===== */
  const isImageChanged = (original, current) => {
    if (current instanceof File) return true;
    return original !== current;
  };

  /* ===== CHANGE DETECTION ===== */
  const isWaterChanged = () => {
    const original = sections?.find((s) => s.id === 1);
    if (!original) return false;

    return (
      original.contact_no !== waterPark.contact_no ||
      original.section_heading !== waterPark.section_heading ||
      original.section_text !== waterPark.section_text ||
      isImageChanged(original.front_image, waterPark.front_image) ||
      isImageChanged(original.background_image, waterPark.background_image)
    );
  };

  const isResortChanged = () => {
    const original = sections?.find((s) => s.id === 2);
    if (!original) return false;

    return (
      original.contact_no !== resort.contact_no ||
      original.section_heading !== resort.section_heading ||
      original.section_text !== resort.section_text ||
      isImageChanged(original.front_image, resort.front_image) ||
      isImageChanged(original.background_image, resort.background_image)
    );
  };

  /* ===== SUBMIT ===== */
  const handleSubmit = async (type) => {
    try {
      if (type === "water") {
        const payload = { ...waterPark, name: "water_park" };

        if (!waterExists) {
          if (
            !payload.contact_no?.trim() ||
            !payload.section_heading?.trim() ||
            !payload.section_text?.trim() ||
            !payload.front_image ||
            !payload.background_image
          ) {
            return toast.error("All fields are required for Water Park");
          }

          const res = await dispatch(createWpRSection(payload));
          console.log("✅ Water Create Response:", res);

          toast.success("Water Park created successfully");
        } else {
          if (!isWaterChanged()) {
            return toast.info("No changes to update");
          }

          const res = await dispatch(updateWpRSection(1, payload));
          console.log("✅ Water Update Response:", res);

          toast.success("Water Park updated successfully");
        }
      } else {
        const payload = { ...resort, name: "resort" };

        if (!resortExists) {
          if (
            !payload.contact_no?.trim() ||
            !payload.section_heading?.trim() ||
            !payload.section_text?.trim() ||
            !payload.front_image ||
            !payload.background_image
          ) {
            return toast.error("All fields are required for Resort");
          }

          const res = await dispatch(createWpRSection(payload));
          console.log("✅ Resort Create Response:", res);

          toast.success("Resort created successfully");
        } else {
          if (!isResortChanged()) {
            return toast.info("No changes to update");
          }

          const res = await dispatch(updateWpRSection(2, payload));
          console.log("✅ Resort Update Response:", res);

          toast.success("Resort updated successfully");
        }
      }
    } catch (err) {
      console.error("❌ API Error:", err);
      toast.error(err || "Something went wrong");
    }
  };
  return (
    <div className="admin-wpr-container">
      <h2 className="admin-wpr-title">Water Park & Resort Sections</h2>

      <div className="admin-wpr-grid">
        {/* ================= WATER PARK ================= */}
        <div className="admin-wpr-wp-card">
          <h3 className="admin-wpr-wp-title">Water Park</h3>

          <div className="admin-wpr-wp-form">
            <div className="admin-wpr-input-div-name-contact">
              <div className="admin-wpr-input-div">
                <label className="admin-wpr-wp-label">Name</label>
                <input
                  className="admin-wpr-wp-input"
                  value="water_park"
                  disabled
                />
              </div>

              <div className="admin-wpr-input-div">
                <label className="admin-wpr-wp-label">Contact No</label>
                <input
                  className="admin-wpr-wp-input"
                  name="contact_no"
                  value={waterPark.contact_no || ""}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 10) {
                      handleChange(
                        { target: { name: "contact_no", value } },
                        "water"
                      );
                    }
                  }}
                />
              </div>
            </div>

            <div className="admin-wpr-input-div">
              <label className="admin-wpr-wp-label">Heading</label>
              <input
                className="admin-wpr-wp-input"
                name="section_heading"
                value={waterPark.section_heading || ""}
                onChange={(e) => handleChange(e, "water")}
                maxLength={45}
              />
            </div>

            <div className="admin-wpr-input-div">
              <label className="admin-wpr-wp-label">Text</label>
              <textarea
                className="admin-wpr-wp-input admin-wpr-textarea"
                name="section_text"
                value={waterPark.section_text || ""}
                onChange={(e) => handleChange(e, "water")}
                maxLength={220}
              />
              <div className="admin-wpr-char-count">
                {(waterPark.section_text || "").length}/220
              </div>
            </div>

            <div className="admin-wpr-wp-img-grid">
              <div className="admin-wpr-wp-img-box">
                <label className="admin-wpr-wp-label">Front Image</label>
                <div className="admin-wpr-wp-img-wrapper">
                  {getImagePreview(waterPark.front_image) && (
                    <img
                      src={getImagePreview(waterPark.front_image)}
                      alt=""
                      className="admin-wpr-wp-img"
                    />
                  )}
                </div>
                <label className="admin-wpr-wp-file-label">
                  Change Image
                  <input
                    type="file"
                    name="front_image"
                    onChange={(e) => handleChange(e, "water")}
                    hidden
                  />
                </label>
              </div>

              <div className="admin-wpr-wp-img-box">
                <label className="admin-wpr-wp-label">Background Image</label>
                <div className="admin-wpr-wp-img-wrapper">
                  {getImagePreview(waterPark.background_image) && (
                    <img
                      src={getImagePreview(waterPark.background_image)}
                      alt=""
                      className="admin-wpr-wp-img"
                    />
                  )}
                </div>
                <label className="admin-wpr-wp-file-label">
                  Change Image
                  <input
                    type="file"
                    name="background_image"
                    onChange={(e) => handleChange(e, "water")}
                    hidden
                  />
                </label>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleSubmit("water")}
            className="admin-wpr-wp-btn"
            disabled={waterExists && sections?.length && !isWaterChanged()}
          >
            {waterExists ? "Update Water Park" : "Create Water Park"}
          </button>
        </div>

        {/* ================= RESORT ================= */}
        <div className="admin-wpr-r-card">
          <h3 className="admin-wpr-r-title">Resort</h3>

          <div className="admin-wpr-r-form">
            <div className="admin-wpr-input-div-name-contact">
              <div className="admin-wpr-input-div">
                <label className="admin-wpr-r-label">Name</label>
                <input className="admin-wpr-r-input" value="resort" disabled />
              </div>

              <div className="admin-wpr-input-div">
                <label className="admin-wpr-r-label">Contact No</label>
                <input
                  className="admin-wpr-r-input"
                  name="contact_no"
                  value={resort.contact_no || ""}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 10) {
                      handleChange(
                        { target: { name: "contact_no", value } },
                        "resort"
                      );
                    }
                  }}
                />
              </div>
            </div>

            <div className="admin-wpr-input-div">
              <label className="admin-wpr-r-label">Heading</label>
              <input
                className="admin-wpr-r-input"
                name="section_heading"
                value={resort.section_heading || ""}
                onChange={(e) => handleChange(e, "resort")}
                maxLength={45}
              />
            </div>

            <div className="admin-wpr-input-div">
              <label className="admin-wpr-r-label">Text</label>
              <textarea
                className="admin-wpr-r-input admin-wpr-textarea"
                name="section_text"
                value={resort.section_text || ""}
                onChange={(e) => handleChange(e, "resort")}
                maxLength={220}
              />
              <div className="admin-wpr-char-count">
                {(resort.section_text || "").length}/220
              </div>
            </div>

            <div className="admin-wpr-r-img-grid">
              <div className="admin-wpr-r-img-box">
                <label className="admin-wpr-r-label">Front Image</label>
                <div className="admin-wpr-r-img-wrapper">
                  {getImagePreview(resort.front_image) && (
                    <img
                      src={getImagePreview(resort.front_image)}
                      alt=""
                      className="admin-wpr-r-img"
                    />
                  )}
                </div>
                <label className="admin-wpr-r-file-label">
                  Change Image
                  <input
                    type="file"
                    name="front_image"
                    onChange={(e) => handleChange(e, "resort")}
                    hidden
                  />
                </label>
              </div>

              <div className="admin-wpr-r-img-box">
                <label className="admin-wpr-r-label">Background Image</label>
                <div className="admin-wpr-r-img-wrapper">
                  {getImagePreview(resort.background_image) && (
                    <img
                      src={getImagePreview(resort.background_image)}
                      alt=""
                      className="admin-wpr-r-img"
                    />
                  )}
                </div>
                <label className="admin-wpr-r-file-label">
                  Change Image
                  <input
                    type="file"
                    name="background_image"
                    onChange={(e) => handleChange(e, "resort")}
                    hidden
                  />
                </label>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleSubmit("resort")}
            className="admin-wpr-r-btn"
            disabled={resortExists && sections?.length && !isResortChanged()}
          >
            {resortExists ? "Update Resort" : "Create Resort"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminWpRSection;

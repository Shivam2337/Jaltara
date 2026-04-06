import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Profile.css";

import {
  fetchMyProfile,
  patchMyProfile,
  resetProfileUpdate,
} from "../../redux/UserActions";

// ─── Django media base URL ────────────────────────────────────
const MEDIA_BASE = "http://127.0.0.1:8000";

// Resolve a photo URL — if it's already absolute (blob:// or http)
// leave it alone; otherwise prepend the Django base URL.
const resolvePhoto = (url) => {
  if (!url) return "";
  if (url.startsWith("blob:") || url.startsWith("http")) return url;
  return `${MEDIA_BASE}${url}`;
};

export default function Profile() {
  const dispatch = useDispatch();

  // ─── Redux state ─────────────────────────────────────────────
  const { loading: fetchLoading, profile, error: fetchError } = useSelector(
    (state) => state.profileFetch ?? {}
  );
  const {
    loading: updateLoading,
    success: updateSuccess,
    error: updateError,
  } = useSelector((state) => state.profileUpdate ?? {});

  // ─── Local form state ─────────────────────────────────────────
  const [formData, setFormData] = useState({
    email:         "",
    phone:         "",
    profile_photo: null,
    imagePreview:  "",
    // address:       "",
    // city:          "",
    // country:       "",
  });
  const [isChanged, setIsChanged] = useState(false);

  // ─── On mount: load profile from API ─────────────────────────
  useEffect(() => {
    dispatch(fetchMyProfile());
  }, [dispatch]);

  // ─── Sync Redux profile into form once loaded ─────────────────
  useEffect(() => {
    if (profile) {
      const nested = profile.profile || {};
      setFormData((prev) => {
        const newPreview = prev.profile_photo
          ? prev.imagePreview                       // user picked new file → keep blob URL
          : resolvePhoto(profile.profile_photo);    // server URL → prepend base

        return {
          email:         profile.email  || "",
          phone:         profile.phone  || "",
          profile_photo: null,
          imagePreview:  newPreview,
          // address:       nested.address || "",
          // city:          nested.city    || "",
          // country:       nested.country || "",
        };
      });
    }
  }, [profile]);

  // ─── Re-fetch profile after successful save ───────────────────
  useEffect(() => {
    if (updateSuccess) {
      dispatch(fetchMyProfile());
    }
  }, [updateSuccess, dispatch]);

  // ─── Detect unsaved changes ───────────────────────────────────
  useEffect(() => {
    if (!profile) return;
    const nested = profile.profile || {};
    const changed =
      formData.email         !== (profile.email    || "") ||
      formData.phone         !== (profile.phone    || "") ||
      // formData.address       !== (nested.address   || "") ||
      // formData.city          !== (nested.city      || "") ||
      // formData.country       !== (nested.country   || "") ||
      formData.profile_photo !== null;
    setIsChanged(changed);
  }, [formData, profile]);

  // ─── Auto-reset success/error after 3 s ──────────────────────
  useEffect(() => {
    if (updateSuccess || updateError) {
      const t = setTimeout(() => dispatch(resetProfileUpdate()), 3000);
      return () => clearTimeout(t);
    }
  }, [updateSuccess, updateError, dispatch]);

  // ─── Handlers ─────────────────────────────────────────────────
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData({
      ...formData,
      profile_photo: file,
      imagePreview:  URL.createObjectURL(file), // blob URL — resolvePhoto leaves this as-is
    });
  };

  const handleSave = () => {
    const payload = new FormData();
    payload.append("email",   formData.email);
    payload.append("phone",   formData.phone);
    // payload.append("address", formData.address);
    // payload.append("city",    formData.city);
    // payload.append("country", formData.country);
    if (formData.profile_photo) {
      payload.append("profile_photo", formData.profile_photo);
    }
    dispatch(patchMyProfile(payload));
  };

  // ─── Derived display values ───────────────────────────────────
  const avatarLetter = (profile?.username || profile?.email || "?")
    .charAt(0)
    .toUpperCase();

  // ─── Render ───────────────────────────────────────────────────
  if (fetchLoading && !profile) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
        <style>{`@keyframes pspin { to { transform: rotate(360deg); } }`}</style>
        <div
          aria-label="Loading profile"
          style={{
            width: 34,
            height: 34,
            border: "3px solid #e5e7eb",
            borderTopColor: "#339af0",
            borderRadius: "50%",
            animation: "pspin 0.8s linear infinite",
          }}
        />
      </div>
    );
  }
  if (fetchError) {
    return <p className="myacc-status error">Error: {fetchError}</p>;
  }
  if (!profile) {
    return <p className="myacc-status">No profile data</p>;
  }

  return (
    <div className="myacc-profile-container">
      {/* HEADER */}
      <div className="myacc-profile-header">
        <label className="myacc-profile-avatar" title="Change photo">
          {formData.imagePreview ? (
            <img
              src={formData.imagePreview}
              alt={profile?.username || ""}
              className="myacc-profile-avatar-img"
            />
          ) : (
            <span className="myacc-profile-avatar-text">{avatarLetter}</span>
          )}
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
        </label>

        <div className="myacc-profile-header-info">
          <h2 className="myacc-profile-name">{profile?.username || ""}</h2>
          <p className="myacc-profile-email">{formData.email}</p>
        </div>
      </div>

      {/* SUCCESS / ERROR BANNER */}
      {updateSuccess && (
        <p className="myacc-status success">✓ Profile updated successfully!</p>
      )}
      {updateError && (
        <p className="myacc-status error">
          ✕ {typeof updateError === "string" ? updateError : "Update failed."}
        </p>
      )}

      {/* FORM */}
      <div className="myacc-profile-card">
        <div className="myacc-profile-row">
          <span className="myacc-profile-label">Email</span>
          <input
            className="myacc-profile-input"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="myacc-profile-row">
          <span className="myacc-profile-label">Phone</span>
          <input
            className="myacc-profile-input"
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        {/* <div className="myacc-profile-row">
          <span className="myacc-profile-label">Address</span>
          <input
            className="myacc-profile-input"
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div className="myacc-profile-row">
          <span className="myacc-profile-label">City</span>
          <input
            className="myacc-profile-input"
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
        </div>

        <div className="myacc-profile-row">
          <span className="myacc-profile-label">Country</span>
          <input
            className="myacc-profile-input"
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
          />
        </div> */}

        <button
          className={`myacc-profile-save-btn ${isChanged ? "active" : "disabled"}`}
          onClick={handleSave}
          disabled={!isChanged || updateLoading}
        >
          {updateLoading ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

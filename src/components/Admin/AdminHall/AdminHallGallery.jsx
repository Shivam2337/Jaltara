import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getHallGalleryAction,
  createHallGalleryAction,
  deleteHallGalleryAction,
} from "../../../redux/actions/AdminHallAction";

// ✅ CHANGE 1 — Import getHallsAction to fetch hall names
import { getHallsAction } from "../../../redux/actions/AdminHallAction";
import "./HallGalleryAdmin.css";

const HallGalleryAdmin = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef();

  const { gallery, galleryLoading, galleryError } = useSelector(
    (state) => state.hall
  );

  // ✅ CHANGE 2 — Get halls list from Redux for dropdown
  const { halls } = useSelector((state) => state.hall);

  const [title, setTitle] = useState("");
  const [hall, setHall] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    dispatch(getHallGalleryAction());
    // ✅ CHANGE 3 — Fetch halls for dropdown
    dispatch(getHallsAction());
  }, [dispatch]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please select image");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("hall", hall);
    formData.append("image", image);

    await dispatch(createHallGalleryAction(formData));

    setTitle("");
    setHall("");
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const deleteHandler = (id) => {
    if (window.confirm("Delete this image?")) {
      dispatch(deleteHallGalleryAction(id));
    }
  };

  const getImageUrl = (imgPath) => {
    if (!imgPath) return "";
    if (imgPath.startsWith("http")) return imgPath;
    return `https://api.jaltara.techsofast.com${imgPath}`;
  };

  return (
    <div className="hall-page">
      <h2>Hall Gallery Management</h2>

      <form className="hall-form" onSubmit={submitHandler}>

        {/* ✅ CHANGE 4 — Replaced Hall ID input with dropdown showing hall names */}
        <select
          value={hall}
          onChange={(e) => setHall(e.target.value)}
          required
        >
          <option value="">Select Hall</option>
          {halls?.map((h) => (
            // ✅ value is hall ID but display is hall title/name
            <option key={h.id} value={h.id}>
              {h.title || h.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Image Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => setImage(e.target.files[0])}
          accept="image/*"
          required
        />

        <button type="submit">Upload Image</button>
      </form>

      {galleryLoading && <p>Loading images...</p>}
      {galleryError && <p className="error">{galleryError}</p>}

      <div className="gallery-grid">
        {gallery.length === 0 && !galleryLoading && (
          <p>No images uploaded yet</p>
        )}

        {gallery.map((img) => (
          <div className="gallery-card" key={img.id}>
            <img src={getImageUrl(img.image)} alt={img.title} />
            <h4>{img.title}</h4>
            <button onClick={() => deleteHandler(img.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HallGalleryAdmin;
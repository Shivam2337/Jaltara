import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getHallGalleryAction,
  createHallGalleryAction,
  deleteHallGalleryAction,
  getHallsAction,
} from "../../../redux/actions/AdminHallAction";
import { toast } from "react-toastify";

const HallGalleryAdmin = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef();

  const { gallery, galleryLoading, galleryError, halls } = useSelector((state) => state.hall);

  const [title, setTitle] = useState("");
  const [hall, setHall] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    dispatch(getHallGalleryAction());
    dispatch(getHallsAction());
  }, [dispatch]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!image) { toast.warn("Please select an image"); return; }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("hall", hall);
    formData.append("image", image);
    try {
      await dispatch(createHallGalleryAction(formData));
      setTitle(""); setHall(""); setImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) { console.error("Gallery upload error:", err); }
  };

  const deleteHandler = (id) => {
    if (window.confirm("Delete this image?")) dispatch(deleteHallGalleryAction(id));
  };

  const getImageUrl = (imgPath) => {
    if (!imgPath) return "";
    if (imgPath.startsWith("http")) return imgPath;
    return `https://api.jaltara.techsofast.com${imgPath}`;
  };

  const inputCls = "px-[10px] py-[10px] border border-[#ccc] rounded-lg text-sm outline-none focus:border-[#2563eb] w-full sm:w-auto";

  return (
    <div className="p-6">
      <h2 className="text-[20px] font-semibold text-[#1f2937] mb-5">Hall Gallery Management</h2>

      {/* FORM */}
      <form onSubmit={submitHandler} className="flex flex-col sm:flex-row flex-wrap gap-3 mb-8">
        <select value={hall} onChange={(e) => setHall(e.target.value)} required className={inputCls}>
          <option value="">Select Hall</option>
          {halls?.map((h) => (
            <option key={h.id} value={h.id}>{h.title || h.name}</option>
          ))}
        </select>

        <input type="text" placeholder="Image Title" value={title}
          onChange={(e) => setTitle(e.target.value)} required className={inputCls} />

        <input type="file" ref={fileInputRef} onChange={(e) => setImage(e.target.files[0])}
          accept="image/*" required className="text-sm" />

        <button type="submit"
          className="bg-[#0d6efd] hover:bg-[#0b5ed7] text-white px-5 py-[10px] rounded-lg border-none cursor-pointer text-sm transition-colors">
          Upload Image
        </button>
      </form>

      {galleryLoading && <p className="text-sm text-[#666]">Loading images...</p>}
      {galleryError && <p className="text-sm text-red-500">{galleryError}</p>}

      {/* GALLERY GRID */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
        {gallery.length === 0 && !galleryLoading && (
          <p className="text-sm text-[#9ca3af]">No images uploaded yet</p>
        )}
        {gallery.map((img) => (
          <div key={img.id} className="bg-white rounded-xl p-[10px] shadow-[0_0_10px_rgba(0,0,0,0.1)] text-center">
            <img src={getImageUrl(img.image)} alt={img.title}
              className="w-full h-[150px] object-cover rounded-xl" />
            <h4 className="text-sm font-medium mt-2 mb-2 text-[#374151]">{img.title}</h4>
            <button onClick={() => deleteHandler(img.id)}
              className="bg-red-500 hover:bg-red-600 text-white border-none px-3 py-[6px] rounded-md text-sm cursor-pointer transition-colors">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HallGalleryAdmin;

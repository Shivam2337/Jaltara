import React, { useEffect, useState } from "react";
import AdminGallaryImgSection from "./AdminGallaryImgSection";
import { useDispatch, useSelector } from "react-redux";
import {
  getGallaryCategories, createGallaryCategory,
  updateGallaryCategory, createGallaryImage,
} from "../../../redux/actions/AdminGallaryAction";
import { toast } from "react-toastify";
import { FaEdit, FaCheck, FaTimes } from "react-icons/fa";

export default function AdminGallary() {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.gallary);

  const [name, setName]                     = useState("");
  const [editId, setEditId]                 = useState(null);
  const [editName, setEditName]             = useState("");
  const [uploading, setUploading]           = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [imageFile, setImageFile]           = useState(null);

  const handleImageUpload = async () => {
    if (!selectedCategory) return toast.error("Please select a category");
    if (!imageFile)        return toast.error("Please choose an image");
    if (uploading)         return;
    setUploading(true);
    try {
      const res = await dispatch(createGallaryImage({ category: selectedCategory.id, title: imageFile.name, media_type: "photo", is_active: true, image: imageFile }));
      if (res) { toast.success("Image added successfully"); setImageFile(null); }
      else toast.error("Unable to upload image");
    } catch { toast.error("Unable to upload image"); }
    finally { setUploading(false); }
  };

  useEffect(() => { dispatch(getGallaryCategories()); }, [dispatch]);

  useEffect(() => {
    if (categories?.length && !selectedCategory) setSelectedCategory({ id: "all", name: "All Photos" });
  }, [categories]);

  const handleAddCategory = async () => {
    if (!name.trim()) return toast.error("Category name is required");
    try {
      const res = await dispatch(createGallaryCategory({ name }));
      if (res) { toast.success("Category added successfully"); setName(""); }
      else toast.error("Unable to add category");
    } catch { toast.error("Unable to add category"); }
  };

  const handleEditStart = (cat) => { setEditId(cat.id); setEditName(cat.name); };
  const handleCancel    = ()    => { setEditId(null); setEditName(""); };

  const handleUpdate = async (id, oldName) => {
    if (!editName.trim())          return toast.error("Category name is required");
    if (editName.trim() === oldName) return toast.info("No changes made");
    try {
      const res = await dispatch(updateGallaryCategory(id, { name: editName }));
      if (res) { toast.success("Category updated successfully"); setEditId(null); }
      else toast.error("Unable to update category");
    } catch { toast.error("Unable to update category"); }
  };

  return (
    <div className="p-5 bg-[#f8fafc] min-h-screen transition-all duration-200">

      {/* HEADING + ADD CATEGORY */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-[22px] font-semibold font-[Playfair_Display]">Gallery Management</h2>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center h-max">
          <input
            type="text"
            placeholder="Enter category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-[8px] py-[8px] rounded-lg border border-[#ccc] outline-none text-base focus:border-[#007bff] transition-all w-full sm:w-auto"
          />
          <button
            onClick={handleAddCategory}
            className="px-3 py-3 border-none rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm cursor-pointer transition-all w-full sm:w-auto"
          >
            Add Category
          </button>
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="flex flex-row flex-wrap gap-5 w-full mb-0">

        {/* All Photos */}
        <div
          onClick={() => setSelectedCategory({ id: "all", name: "All Photos" })}
          className={`text-[#333] rounded-lg border border-[#ccc] flex gap-5 capitalize cursor-pointer
            ${selectedCategory?.id === "all" ? "bg-[#cae3ff]" : ""}`}
        >
          <div className="flex gap-5 items-center text-base px-[8px] py-[8px] rounded-lg">
            <span className="text-base whitespace-nowrap">All Photos</span>
          </div>
        </div>

        {categories?.map((cat) => (
          <div
            key={cat.id}
            className={`text-[#333] rounded-lg border border-[#ccc] flex gap-5 capitalize
              ${selectedCategory?.id === cat.id ? "bg-[#cae3ff]" : ""}`}
          >
            {editId === cat.id ? (
              <div className="flex">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="text-base px-[8px] py-[8px] rounded-lg min-w-max border border-transparent outline-none capitalize focus:border-transparent transition-all"
                />
                <div className="flex items-center justify-center">
                  <button
                    onClick={() => handleUpdate(cat.id, cat.name)}
                    className="border-none h-full bg-[#007bff] text-white px-[10px] rounded-lg cursor-pointer"
                  >
                    <FaCheck />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="border-none h-full bg-[#ff5959] text-white px-[10px] rounded-lg cursor-pointer"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-5 items-center text-base px-[8px] py-[8px] rounded-lg">
                <span
                  onClick={() => setSelectedCategory(cat)}
                  className="text-base whitespace-nowrap cursor-pointer"
                >
                  {cat.name}
                </span>
                <FaEdit className="cursor-pointer" onClick={() => handleEditStart(cat)} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* IMAGE UPLOAD */}
      <div className="mt-5 p-4 rounded-lg">
        {selectedCategory && selectedCategory.id !== "all" ? (
          <>
            <p className="text-base font-light mb-[10px]">
              Add Image to <span className="capitalize font-medium">{selectedCategory.name}</span>
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-3">
              <label className="px-4 py-2 bg-[#cdcdcd] hover:bg-[#e2e8f0] rounded-md cursor-pointer text-sm transition-all">
                Choose Image
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} hidden />
              </label>
              {imageFile && <span className="text-sm text-[#555]">{imageFile.name}</span>}
              <button
                onClick={handleImageUpload}
                disabled={uploading}
                className="px-4 py-2 bg-[#007bff] text-white border-none rounded-md cursor-pointer text-sm disabled:opacity-60 transition-all"
              >
                {uploading ? "Uploading..." : "Upload Image"}
              </button>
            </div>
          </>
        ) : (
          <p className="text-sm text-[#555]">Select a category to upload images</p>
        )}
      </div>

      <AdminGallaryImgSection selectedCategory={selectedCategory} />
    </div>
  );
}

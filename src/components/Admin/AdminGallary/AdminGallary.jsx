import React, { useEffect, useState } from "react";
import "./AdminGallary.css";
import AdminGallaryImgSection from "./AdminGallaryImgSection";
import { useDispatch, useSelector } from "react-redux";
import {
  getGallaryCategories,
  createGallaryCategory,
  updateGallaryCategory,
  createGallaryImage,
} from "../../../redux/actions/AdminGallaryAction";

import { toast } from "react-toastify";
import { FaEdit, FaCheck, FaTimes } from "react-icons/fa";

export default function AdminGallary() {
  const dispatch = useDispatch();

  const { categories, loading } = useSelector((state) => state.gallary);

  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [imageFile, setImageFile] = useState(null);
  const handleImageUpload = async () => {
    if (!selectedCategory) {
      return toast.error("Please select a category");
    }

    if (!imageFile) {
      return toast.error("Please choose an image");
    }

    if (uploading) return;

    setUploading(true);

    try {
      const res = await dispatch(
        createGallaryImage({
          category: selectedCategory.id,
          title: imageFile.name,
          media_type: "photo",
          is_active: true,
          image: imageFile,
        })
      );

      if (res) {
        toast.success("Image added successfully");
        setImageFile(null);
      } else {
        toast.error("Unable to upload image");
      }
    } catch {
      toast.error("Unable to upload image");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    dispatch(getGallaryCategories());
  }, [dispatch]);

  useEffect(() => {
    if (categories?.length && !selectedCategory) {
      setSelectedCategory({ id: "all", name: "All Photos" });
    }
  }, [categories]);

  /* ================= CREATE ================= */
  const handleAddCategory = async () => {
    if (!name.trim()) {
      return toast.error("Category name is required");
    }

    try {
      const res = await dispatch(createGallaryCategory({ name }));

      if (res) {
        toast.success("Category added successfully");
        setName("");
      } else {
        toast.error("Unable to add category");
      }
    } catch {
      toast.error("Unable to add category");
    }
  };

  /* ================= EDIT ================= */
  const handleEditStart = (cat) => {
    setEditId(cat.id);
    setEditName(cat.name);
  };

  const handleCancel = () => {
    setEditId(null);
    setEditName("");
  };

  /* ================= UPDATE ================= */
  const handleUpdate = async (id, oldName) => {
    if (!editName.trim()) {
      return toast.error("Category name is required");
    }

    if (editName.trim() === oldName) {
      return toast.info("No changes made");
    }

    try {
      const res = await dispatch(updateGallaryCategory(id, { name: editName }));

      if (res) {
        toast.success("Category updated successfully");
        setEditId(null);
      } else {
        toast.error("Unable to update category");
      }
    } catch {
      toast.error("Unable to update category");
    }
  };

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
  };

  return (
    <div className="admin-gallary-contaier">
      <div className="admin-gallary-heading-box">
        <h2 className="admin-gallary-heading">Gallery Management</h2>

        <div className="admin-gallary-add-category-box">
          <input
            type="text"
            placeholder="Enter category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="admin-gallary-add-category-input"
          />

          <button
            onClick={handleAddCategory}
            className="admin-gallary-add-category-btn"
          >
            Add Category
          </button>
        </div>
      </div>

      <div className="admin-gallary-categories-box">
        <div
          className={`admin-gallary-category-item ${
            selectedCategory?.id === "all"
              ? "admin-gallary-category-item-active"
              : ""
          }`}
          onClick={() => setSelectedCategory({ id: "all", name: "All Photos" })}
        >
          <div className="admin-gallary-category-row">
            <span className="admin-gallary-category-name">All Photos</span>
          </div>
        </div>

        {categories?.map((cat) => (
          <div
            key={cat.id}
            className={`admin-gallary-category-item ${
              selectedCategory?.id === cat.id
                ? "admin-gallary-category-item-active"
                : ""
            }`}
          >
            {editId === cat.id ? (
              <div className="admin-gallary-category-item-edit-box">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="admin-gallary-category-item-edit-input"
                />
                <div className="admin-gallary-category-item-edit-btn-box">
                  <button
                    onClick={() => handleUpdate(cat.id, cat.name)}
                    className="admin-gallary-category-item-edit-save-btn"
                  >
                    <FaCheck />
                  </button>

                  <button
                    onClick={handleCancel}
                    className="admin-gallary-category-item-edit-cancel-btn"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
            ) : (
              <div className="admin-gallary-category-row">
                <span
                  onClick={() => handleSelectCategory(cat)}
                  className="admin-gallary-category-name"
                >
                  {cat.name}
                </span>

                <FaEdit
                  className="admin-gallary-edit-icon"
                  onClick={() => handleEditStart(cat)}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="admin-gallary-image-upload-box">
        {selectedCategory && selectedCategory.id !== "all" ? (
          <>
            <p className="admin-gallary-selected-title">
              Add Image to <span>{selectedCategory.name}</span>
            </p>

            <div className="admin-gallary-file-box">
              <label className="admin-gallary-file-label">
                Choose Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  hidden
                />
              </label>

              {imageFile && (
                <span className="admin-gallary-file-name">
                  {imageFile.name}
                </span>
              )}

              <button
                onClick={handleImageUpload}
                className="admin-gallary-image-upload-btn"
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload Image"}
              </button>
            </div>
          </>
        ) : (
          <p className="admin-gallary-selected-placeholder">
            Select a category to upload images
          </p>
        )}
      </div>

      <AdminGallaryImgSection selectedCategory={selectedCategory} />
    </div>
  );
}

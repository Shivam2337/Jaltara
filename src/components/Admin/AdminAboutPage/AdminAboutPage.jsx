import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAboutPage,
  updateAbout,
  createAbout,
} from "../../../redux/actions/AdminAboutAction";
import "./AdminAboutPage.css";
import { toast } from "react-toastify";
import AdminAboutPageCards from "./AdminAboutPageCards";

export default function AdminAboutPage() {
  const dispatch = useDispatch();

  const { loading, error, about } = useSelector(
    (state) => state.AboutPage || {}
  );

  const [formData, setFormData] = useState({
    title: "",
    desc1: "",
    desc2: "",
    desc3: "",
    image: null,
    preview: "",
  });

  const [originalData, setOriginalData] = useState({
    title: "",
    desc1: "",
    desc2: "",
    desc3: "",
    image: null,
    preview: "",
  });

  useEffect(() => {
    dispatch(getAboutPage());
  }, [dispatch]);

  useEffect(() => {
    if (about?.length > 0) {
      const item = about[0];

      const parts = item?.description
        ?.split(/\r?\n\r?\n/)
        .concat(["", "", ""])
        .slice(0, 3);
      const data = {
        title: item?.title || "",
        desc1: parts[0],
        desc2: parts[1],
        desc3: parts[2],
        image: null,
        preview: item?.main_image || "",
      };

      setFormData(data);
      setOriginalData(data);
    } else {
      const emptyData = {
        title: "",
        desc1: "",
        desc2: "",
        desc3: "",
        image: null,
        preview: "",
      };

      setFormData(emptyData);
      setOriginalData(emptyData);
    }
  }, [about]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
        preview: URL.createObjectURL(file),
      });
    }
  };

  const isChanged =
    JSON.stringify({
      ...formData,
      image: formData.image ? "changed" : null,
      preview: "",
    }) !==
    JSON.stringify({
      ...originalData,
      image: null,
      preview: "",
    });
  const isCreateValid =
    formData.title.trim() &&
    (formData.desc1.trim() || formData.desc2.trim() || formData.desc3.trim()) &&
    (formData.image || formData.preview);

  const handleSubmit = async () => {
    const finalDescription = [
      formData.desc1,
      formData.desc2,
      formData.desc3,
    ].join("\n\n");

    const sendData = new FormData();
    sendData.append("title", formData.title);
    sendData.append("description", finalDescription);

    if (formData.image) {
      sendData.append("main_image", formData.image);
    }

    let res;

    if (about?.length > 0) {
      res = await dispatch(updateAbout(about[0].id, sendData));
      if (res?.success) {
        toast.success("Updated successfully");
      } else {
        toast.error(res?.error || "Something went wrong");
      }
    } else {
      res = await dispatch(createAbout(sendData));
      if (res?.success) {
        toast.success("Created successfully");
      } else {
        toast.error(res?.error || "Something went wrong");
      }
    }
  };
  return (
    <div className="Admin-about-container">
      <h2 className="Admin-about-page-heading">Admin About Page</h2>

      <div className="Admin-about-info-div">
        <div className="admin-about-info-group">
          <label className="admin-about-info-label">Title</label>

          <input
            className="admin-about-info-input"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            maxLength={35}
            placeholder="Title"
          />

          <div className="admin-about-char-count">
            {(formData.title || "").length}/35
          </div>
        </div>

        <div className="Admin-about-des-box">
          <div className="Admin-about-des-group">
            <label className="Admin-about-des-label">Description line 1</label>

            <textarea
              className="admin-about-des-textarea"
              name="desc1"
              value={formData.desc1}
              onChange={handleChange}
              maxLength={140}
            />

            <div className="admin-about-char-count">
              {(formData.desc1 || "").length}/140
            </div>
          </div>

          <div className="Admin-about-des-group">
            <label className="Admin-about-des-label">Description line 2</label>

            <textarea
              className="admin-about-des-textarea"
              name="desc2"
              value={formData.desc2}
              onChange={handleChange}
              maxLength={140}
            />

            <div className="admin-about-char-count">
              {(formData.desc2 || "").length}/140
            </div>
          </div>

          <div className="Admin-about-des-group">
            <label className="Admin-about-des-label">Description line 3</label>

            <textarea
              className="admin-about-des-textarea"
              name="desc3"
              value={formData.desc3}
              onChange={handleChange}
              maxLength={140}
            />

            <div className="admin-about-char-count">
              {(formData.desc3 || "").length}/140
            </div>
          </div>
        </div>

        <div className="Admin-about-info-div-img-box">
          <div className="Admin-about-info-div-img-wrapper">
            {formData.preview && (
              <img
                className="Admin-about-info-div-img"
                src={formData.preview}
                alt="preview"
              />
            )}
          </div>

          <div className="Admin-about-info-div-img-btn-box">
            <label className="Admin-about-file-label">
              Choose Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                hidden
              />
            </label>

            {formData.image && (
              <span className="Admin-about-file-name">
                {formData.image.name}
              </span>
            )}
          </div>
        </div>
        <button
          className="admin-about-top-btn-create"
          onClick={handleSubmit}
          disabled={about?.length > 0 ? !isChanged : !isCreateValid}
        >
          {about?.length > 0 ? "Update Information" : "Create New Information"}
        </button>
      </div>
      <hr className="admin-about-card-seperator" />
      <h3 className="Admin-about-cards-heading">All Card details Below</h3>

      <AdminAboutPageCards />
    </div>
  );
}

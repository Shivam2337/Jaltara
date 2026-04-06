import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createAboutCard,
  updateAboutCard,
} from "../../../redux/actions/AdminAboutAction";
import AdminAboutPageFeatures from "./AdminAboutPageFeatures";
import { toast } from "react-toastify";

export default function AdminAboutPageCards() {
  const dispatch = useDispatch();

  const { about } = useSelector((state) => state.AboutPage || {});

  const cards = about?.[0]?.cards || [];

  const [forms, setForms] = useState([]);
  const [originalForms, setOriginalForms] = useState([]);

  useEffect(() => {
    if (cards.length > 0) {
      const mapped = cards.map((card) => ({
        id: card.id,
        title: card.title || "",
        header: card.header || "",
        image: null,
        preview: card.image || "",
        isNew: false,
      }));

      setForms(mapped);
      //   setOriginalForms(mapped);
      setOriginalForms(JSON.parse(JSON.stringify(mapped)));
    }
  }, [cards]);

  const handleChange = (index, e) => {
    const newForms = [...forms];
    newForms[index][e.target.name] = e.target.value;
    setForms(newForms);
  };

  const handleImage = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const newForms = [...forms];
      newForms[index].image = file;
      newForms[index].preview = URL.createObjectURL(file);
      setForms(newForms);
    }
  };

  const isCardChanged = (index) => {
    const current = forms[index];
    const original = originalForms[index];

    if (!original) return true;

    return (
      current.title !== original.title ||
      current.header !== original.header ||
      current.image !== null
    );
  };
  const isCreateValid = (card) => {
    return (
      card.title.trim() && card.header.trim() && (card.image || card.preview)
    );
  };
  const handleUpdate = async (index, id) => {
    const card = forms[index];

    const sendData = new FormData();
    sendData.append("title", card.title);
    sendData.append("header", card.header);

    if (card.image) {
      sendData.append("image", card.image);
    }

    const res = await dispatch(updateAboutCard(id, sendData));

    if (res?.success) {
      toast.success("Card updated successfully");
    } else {
      toast.error(res?.error || "Something went wrong");
    }
  };

  const handleAddForm = () => {
    setForms([
      ...forms,
      {
        id: null,
        title: "",
        header: "",
        image: null,
        preview: "",
        isNew: true,
      },
    ]);
  };

  const handleCreate = async (index) => {
    const card = forms[index];

    const sendData = new FormData();
    sendData.append("title", card.title);
    sendData.append("header", card.header);

    if (card.image) {
      sendData.append("image", card.image);
    }

    sendData.append("about", about?.[0]?.id || 1);

    const res = await dispatch(createAboutCard(sendData));

    if (res?.success) {
      toast.success("Card created successfully");
    } else {
      toast.error(res?.error || "Something went wrong");
    }
  };
  return (
    <div className="Admin-about-cards-div">
      {forms.map((card, index) => (
        <div
          className="Admin-about-card"
          //   key={card.id || index}
          key={`${card.id || "new"}-${index}`}
          data-id={card.id}
        >
          <p className="Admin-about-card-numbering">card no. {card.id}</p>

          <div className="Admin-about-card-group-box">
            <div className="Admin-about-card-group">
              <label className="Admin-about-card-label">Title</label>
              <input
                className="Admin-about-card-input"
                type="text"
                name="title"
                value={card.title}
                onChange={(e) => handleChange(index, e)}
                placeholder="Title"
                maxLength={25}
              />
              <div className="admin-about-char-count">
                {card.title.length}/25
              </div>
            </div>

            <div className="Admin-about-card-group">
              <label className="Admin-about-card-label">Text</label>

              <input
                className="Admin-about-card-input"
                type="text"
                name="header"
                value={card.header}
                onChange={(e) => handleChange(index, e)}
                placeholder="Header"
                maxLength={60}
              />
              <div className="admin-about-char-count">
                {(card.header || "").length}/60
              </div>
            </div>
          </div>

          <div className="Admin-about-card-img-wrapper-box">
            <div className="Admin-about-card-img-wrapper">
              {card.preview && (
                <img
                  src={card.preview}
                  className="Admin-about-card-img"
                  alt="card"
                />
              )}
            </div>

            <div className="Admin-about-card-img-btn-box">
              <label className="Admin-about-card-file-label">
                Choose Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImage(index, e)}
                  hidden
                />
              </label>

              {card.image && (
                <span className="Admin-about-card-file-name">
                  {card.image.name}
                </span>
              )}
            </div>
          </div>
          <AdminAboutPageFeatures cardId={card.id} />

          {card.isNew ? (
            <button
              className="Admin-about-card-update-create-btn"
              onClick={() => handleCreate(index)}
              disabled={!isCreateValid(card)}
            >
              Create Card {index + 1}
            </button>
          ) : (
            <button
              className="Admin-about-card-update-create-btn"
              onClick={() => handleUpdate(index, card.id)}
              disabled={!isCardChanged(index)}
            >
              Update Card {card.id}
            </button>
          )}

          <hr className="admin-about-card-seperator" />
        </div>
      ))}

      {forms.length < 4 && (
        <button
          onClick={handleAddForm}
          className="Admin-about-card-update-create-btn"
        >
          Add Card
        </button>
      )}
    </div>
  );
}

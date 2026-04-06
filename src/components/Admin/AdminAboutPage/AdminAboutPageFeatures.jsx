import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createFeature,
  updateFeature,
} from "../../../redux/actions/AdminAboutAction";
import { toast } from "react-toastify";
import { Label } from "recharts";

export default function AdminAboutPageFeatures({ cardId }) {
  const dispatch = useDispatch();

  const { about } = useSelector((state) => state.AboutPage || {});

  const cards = about?.[0]?.cards || [];

  const [features, setFeatures] = useState([]);
  const [originalFeatures, setOriginalFeatures] = useState([]);

  useEffect(() => {
    const card = cards.find((c) => c.id === cardId);
    const existing = card?.features || [];

    const filled = [];

    for (let i = 0; i < 4; i++) {
      if (existing[i]) {
        filled.push({
          id: existing[i].id,
          title: existing[i].title || "",
          icon: existing[i].icon || "flower",
          card: card?.id,
          isNew: false,
        });
      } else {
        filled.push({
          id: null,
          title: "",
          icon: "flower",
          card: card?.id,
          isNew: true,
        });
      }
    }

    // 🔥 IMPORTANT: prevent unnecessary updates
    if (JSON.stringify(filled) !== JSON.stringify(features)) {
      setFeatures(filled);
      setOriginalFeatures(JSON.parse(JSON.stringify(filled)));
    }
  }, [cards, cardId]);
  const handleChange = (index, e) => {
    const newData = [...features];
    newData[index][e.target.name] = e.target.value;
    setFeatures(newData);
  };

  const isChanged = (index) => {
    const current = features[index];
    const original = originalFeatures[index];

    if (!original) return true;

    return current.title !== original.title;
  };
  const handleUpdate = async (index) => {
    const feature = features[index];

    const sendData = new FormData();
    sendData.append("title", feature.title);
    sendData.append("card", feature.card);

    const res = await dispatch(updateFeature(feature.id, sendData));

    if (res?.success) {
      toast.success("Feature updated successfully");
    } else {
      toast.error(res?.error || "Something went wrong");
    }
  };
  const isCreateValid = (feature) => {
    // return feature.title.trim();
    return feature.title.trim() && feature.card;
  };
  const handleCreate = async (index) => {
    const feature = features[index];

    const sendData = new FormData();
    sendData.append("title", feature.title);
    sendData.append("card", feature.card);

    const res = await dispatch(createFeature(sendData));

    if (res?.success) {
      toast.success("Feature created successfully");
    } else {
      toast.error(res?.error || "Something went wrong");
    }
  };

  return (
    <div className="Admin-about-features-box">
      {features.map((feature, index) => (
        // <div key={feature.id || index}>
        <div
          className="Admin-about-feature"
          key={`${feature.id || "new"}-${index}`}
        >
          <label className="Admin-about-feature-label">
            Feature {index + 1}
          </label>
          <input
            type="text"
            name="title"
            className="Admin-about-feature-input"
            value={feature.title}
            onChange={(e) => handleChange(index, e)}
            placeholder="Feature Title"
          />

          {feature.isNew ? (
            <button
              onClick={() => handleCreate(index)}
              disabled={!isCreateValid(feature)}
              className="Admin-about-feature-create-btn"
            >
              Create
            </button>
          ) : (
            <button
              onClick={() => handleUpdate(index)}
              disabled={!isChanged(index)}
              className="Admin-about-feature-update-btn"
            >
              Update
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

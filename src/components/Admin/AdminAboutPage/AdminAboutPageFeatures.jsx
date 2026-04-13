import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createFeature, updateFeature } from "../../../redux/actions/AdminAboutAction";
import { toast } from "react-toastify";

export default function AdminAboutPageFeatures({ cardId }) {
  const dispatch = useDispatch();
  const { about } = useSelector((state) => state.AboutPage || {});
  const cards = about?.[0]?.cards || [];

  const [features, setFeatures]               = useState([]);
  const [originalFeatures, setOriginalFeatures] = useState([]);

  useEffect(() => {
    const card     = cards.find((c) => c.id === cardId);
    const existing = card?.features || [];
    const filled   = [];

    for (let i = 0; i < 4; i++) {
      if (existing[i]) {
        filled.push({ id: existing[i].id, title: existing[i].title || "", icon: existing[i].icon || "flower", card: card?.id, isNew: false });
      } else {
        filled.push({ id: null, title: "", icon: "flower", card: card?.id, isNew: true });
      }
    }

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
    const current  = features[index];
    const original = originalFeatures[index];
    if (!original) return true;
    return current.title !== original.title;
  };

  const handleUpdate = async (index) => {
    const feature  = features[index];
    const sendData = new FormData();
    sendData.append("title", feature.title);
    sendData.append("card", feature.card);
    const res = await dispatch(updateFeature(feature.id, sendData));
    if (res?.success) toast.success("Feature updated successfully"); else toast.error(res?.error || "Something went wrong");
  };

  const isCreateValid = (feature) => feature.title.trim() && feature.card;

  const handleCreate = async (index) => {
    const feature  = features[index];
    const sendData = new FormData();
    sendData.append("title", feature.title);
    sendData.append("card", feature.card);
    const res = await dispatch(createFeature(sendData));
    if (res?.success) toast.success("Feature created successfully"); else toast.error(res?.error || "Something went wrong");
  };

  return (
    <div className="flex flex-col gap-5 mb-8">
      {features.map((feature, index) => (
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 sm:items-center" key={`${feature.id || "new"}-${index}`}>
          <label className="text-base w-max shrink-0">Feature {index + 1}</label>
          <input
            type="text"
            name="title"
            className="text-base px-[8px] py-[8px] rounded-lg border border-[#ccc] outline-none focus:border-[#007bff] transition-all capitalize w-full sm:w-[400px]"
            value={feature.title}
            onChange={(e) => handleChange(index, e)}
            placeholder="Feature Title"
          />
          {feature.isNew ? (
            <button onClick={() => handleCreate(index)} disabled={!isCreateValid(feature)}
              className="block px-4 py-2 rounded-lg border-none bg-[#007bff] text-white text-sm font-medium cursor-pointer disabled:opacity-50 transition-all w-max">
              Create
            </button>
          ) : (
            <button onClick={() => handleUpdate(index)} disabled={!isChanged(index)}
              className="block px-4 py-2 rounded-lg border-none bg-[#007bff] text-white text-sm font-medium cursor-pointer disabled:opacity-50 transition-all w-max">
              Update
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

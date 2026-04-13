import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createAboutCard, updateAboutCard } from "../../../redux/actions/AdminAboutAction";
import AdminAboutPageFeatures from "./AdminAboutPageFeatures";
import { toast } from "react-toastify";

const inputCls = "text-base px-[8px] py-[8px] rounded-lg border border-[#ccc] outline-none focus:border-[#007bff] transition-all capitalize w-full";
const btnCls   = "block mx-auto mb-8 px-4 py-2 rounded-lg border-none bg-[#007bff] text-white text-sm font-medium cursor-pointer disabled:opacity-50 transition-all";

export default function AdminAboutPageCards() {
  const dispatch = useDispatch();
  const { about } = useSelector((state) => state.AboutPage || {});
  const cards = about?.[0]?.cards || [];

  const [forms, setForms]               = useState([]);
  const [originalForms, setOriginalForms] = useState([]);

  useEffect(() => {
    if (cards.length > 0) {
      const mapped = cards.map((card) => ({ id: card.id, title: card.title || "", header: card.header || "", image: null, preview: card.image || "", isNew: false }));
      setForms(mapped);
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
      newForms[index].image   = file;
      newForms[index].preview = URL.createObjectURL(file);
      setForms(newForms);
    }
  };

  const isCardChanged = (index) => {
    const current  = forms[index];
    const original = originalForms[index];
    if (!original) return true;
    return current.title !== original.title || current.header !== original.header || current.image !== null;
  };

  const isCreateValid = (card) => card.title.trim() && card.header.trim() && (card.image || card.preview);

  const handleUpdate = async (index, id) => {
    const card = forms[index];
    const sendData = new FormData();
    sendData.append("title", card.title);
    sendData.append("header", card.header);
    if (card.image) sendData.append("image", card.image);
    const res = await dispatch(updateAboutCard(id, sendData));
    if (res?.success) toast.success("Card updated successfully"); else toast.error(res?.error || "Something went wrong");
  };

  const handleAddForm = () => {
    setForms([...forms, { id: null, title: "", header: "", image: null, preview: "", isNew: true }]);
  };

  const handleCreate = async (index) => {
    const card = forms[index];
    const sendData = new FormData();
    sendData.append("title", card.title);
    sendData.append("header", card.header);
    if (card.image) sendData.append("image", card.image);
    sendData.append("about", about?.[0]?.id || 1);
    const res = await dispatch(createAboutCard(sendData));
    if (res?.success) toast.success("Card created successfully"); else toast.error(res?.error || "Something went wrong");
  };

  return (
    <div>
      {forms.map((card, index) => (
        <div className="flex flex-col gap-5" key={`${card.id || "new"}-${index}`} data-id={card.id}>

          <p className="text-[18px] capitalize font-medium">card no. {card.id}</p>

          {/* TITLE + HEADER */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[50px]">
            <div className="flex flex-col gap-3">
              <label className="text-base">Title</label>
              <input className={inputCls} type="text" name="title" value={card.title} onChange={(e) => handleChange(index, e)} placeholder="Title" maxLength={25} />
              <div className="ml-auto text-sm">{card.title.length}/25</div>
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-base">Text</label>
              <input className={inputCls} type="text" name="header" value={card.header} onChange={(e) => handleChange(index, e)} placeholder="Header" maxLength={60} />
              <div className="ml-auto text-sm">{(card.header || "").length}/60</div>
            </div>
          </div>

          {/* IMAGE */}
          <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center mb-8">
            <div className="w-full sm:w-[300px] h-[200px] rounded-xl overflow-hidden border border-[#e5e7eb] bg-[#cdcdcd]">
              {card.preview && <img src={card.preview} className="w-full h-full object-cover" alt="card" />}
            </div>
            <div className="flex items-center gap-3">
              <label className="px-4 py-2 bg-[#cdcdcd] hover:bg-[#e2e8f0] text-[#333] rounded-md cursor-pointer text-sm transition-all">
                Choose Image
                <input type="file" accept="image/*" onChange={(e) => handleImage(index, e)} hidden />
              </label>
              {card.image && (
                <span className="text-[13px] text-[#555] max-w-[180px] whitespace-nowrap overflow-hidden text-ellipsis">
                  {card.image.name}
                </span>
              )}
            </div>
          </div>

          <AdminAboutPageFeatures cardId={card.id} />

          {card.isNew ? (
            <button className={btnCls} onClick={() => handleCreate(index)} disabled={!isCreateValid(card)}>
              Create Card {index + 1}
            </button>
          ) : (
            <button className={btnCls} onClick={() => handleUpdate(index, card.id)} disabled={!isCardChanged(index)}>
              Update Card {card.id}
            </button>
          )}

          <hr className="border-none h-px bg-[#cdcdcd] my-4" />
        </div>
      ))}

      {forms.length < 4 && (
        <button onClick={handleAddForm} className={btnCls}>Add Card</button>
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAboutPage, updateAbout, createAbout } from "../../../redux/actions/AdminAboutAction";
import { toast } from "react-toastify";
import AdminAboutPageCards from "./AdminAboutPageCards";

const inputCls    = "text-base px-[8px] py-[8px] rounded-lg border border-[#ccc] outline-none focus:border-[#007bff] transition-all capitalize w-full sm:w-[400px]";
const textareaCls = "text-base px-[8px] py-[8px] rounded-lg border border-[#ccc] outline-none focus:border-[#007bff] transition-all resize-none overflow-hidden min-h-[100px] leading-[1.5] w-full";

export default function AdminAboutPage() {
  const dispatch = useDispatch();
  const { loading, error, about } = useSelector((state) => state.AboutPage || {});

  const emptyData = { title: "", desc1: "", desc2: "", desc3: "", image: null, preview: "" };
  const [formData, setFormData]       = useState(emptyData);
  const [originalData, setOriginalData] = useState(emptyData);

  useEffect(() => { dispatch(getAboutPage()); }, [dispatch]);

  useEffect(() => {
    if (about?.length > 0) {
      const item  = about[0];
      const parts = item?.description?.split(/\r?\n\r?\n/).concat(["", "", ""]).slice(0, 3);
      const data  = { title: item?.title || "", desc1: parts[0], desc2: parts[1], desc3: parts[2], image: null, preview: item?.main_image || "" };
      setFormData(data); setOriginalData(data);
    } else { setFormData(emptyData); setOriginalData(emptyData); }
  }, [about]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) setFormData({ ...formData, image: file, preview: URL.createObjectURL(file) });
  };

  const isChanged = JSON.stringify({ ...formData, image: formData.image ? "changed" : null, preview: "" }) !==
    JSON.stringify({ ...originalData, image: null, preview: "" });

  const isCreateValid = formData.title.trim() &&
    (formData.desc1.trim() || formData.desc2.trim() || formData.desc3.trim()) &&
    (formData.image || formData.preview);

  const handleSubmit = async () => {
    const finalDescription = [formData.desc1, formData.desc2, formData.desc3].join("\n\n");
    const sendData = new FormData();
    sendData.append("title", formData.title);
    sendData.append("description", finalDescription);
    if (formData.image) sendData.append("main_image", formData.image);
    let res;
    if (about?.length > 0) {
      res = await dispatch(updateAbout(about[0].id, sendData));
      if (res?.success) toast.success("Updated successfully"); else toast.error(res?.error || "Something went wrong");
    } else {
      res = await dispatch(createAbout(sendData));
      if (res?.success) toast.success("Created successfully"); else toast.error(res?.error || "Something went wrong");
    }
  };

  return (
    <div className="p-5 bg-[#f8fafc] min-h-screen text-[#333]">
      <h2 className="text-[22px] font-semibold font-[Playfair_Display] mb-8">Admin About Page</h2>

      <div className="flex flex-col gap-5">

        {/* TITLE */}
        <div className="flex flex-col gap-3 w-max">
          <label className="text-base">Title</label>
          <input className={inputCls} type="text" name="title" value={formData.title} onChange={handleChange} maxLength={35} placeholder="Title" />
          <div className="ml-auto text-sm">{(formData.title || "").length}/35</div>
        </div>

        {/* DESCRIPTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[["desc1","Description line 1"],["desc2","Description line 2"],["desc3","Description line 3"]].map(([name, label]) => (
            <div key={name} className="flex flex-col gap-3">
              <label className="text-base">{label}</label>
              <textarea className={textareaCls} name={name} value={formData[name]} onChange={handleChange} maxLength={140} />
              <div className="ml-auto text-sm">{(formData[name] || "").length}/140</div>
            </div>
          ))}
        </div>

        {/* IMAGE */}
        <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
          <div className="w-full sm:w-[300px] h-[200px] rounded-lg overflow-hidden bg-[#cdcdcd]">
            {formData.preview && <img className="w-full h-full object-cover" src={formData.preview} alt="preview" />}
          </div>
          <div className="flex items-center gap-5">
            <label className="px-4 py-2 bg-[#cdcdcd] hover:bg-[#e2e8f0] rounded-md cursor-pointer text-sm transition-all inline-block w-fit">
              Choose Image
              <input type="file" accept="image/*" onChange={handleImage} hidden />
            </label>
            {formData.image && <span className="text-sm text-[#555] ml-5">{formData.image.name}</span>}
          </div>
        </div>

        <button onClick={handleSubmit} disabled={about?.length > 0 ? !isChanged : !isCreateValid}
          className="block mx-auto mb-8 px-4 py-2 rounded-lg border-none bg-[#007bff] text-white text-sm font-medium cursor-pointer disabled:opacity-50 transition-all">
          {about?.length > 0 ? "Update Information" : "Create New Information"}
        </button>
      </div>

      <hr className="border-none h-px bg-[#cdcdcd] my-4" />
      <h3 className="text-[22px] font-semibold font-[Playfair_Display] mb-8">All Card details Below</h3>
      <AdminAboutPageCards />
    </div>
  );
}

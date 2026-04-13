import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWpRSections, updateWpRSection, createWpRSection } from "../../../redux/actions/AdminWpRAction";
import { toast } from "react-toastify";

const inputCls = "px-[8px] py-[8px] rounded-md border border-[#ccc] outline-none text-sm focus:border-[#007bff] transition-all w-full";

const AdminWpRSection = () => {
  const dispatch = useDispatch();
  const { sections } = useSelector((state) => state.wprSections);

  const [waterPark, setWaterPark] = useState({});
  const [resort, setResort] = useState({});
  const [waterExists, setWaterExists] = useState(false);
  const [resortExists, setResortExists] = useState(false);

  useEffect(() => { dispatch(getWpRSections()); }, [dispatch]);

  useEffect(() => {
    if (sections?.length) {
      const wp = sections.find((s) => s.id === 1);
      const rs = sections.find((s) => s.id === 2);
      if (wp) { setWaterPark(wp); setWaterExists(true); }
      if (rs) { setResort(rs); setResortExists(true); }
    }
  }, [sections]);

  const getImagePreview = (image) => {
    if (!image) return null;
    if (image instanceof File) return URL.createObjectURL(image);
    return image;
  };

  const handleChange = (e, type) => {
    const { name, value, files } = e.target;
    const val = files ? files[0] : value;
    if (type === "water") setWaterPark({ ...waterPark, [name]: val });
    else setResort({ ...resort, [name]: val });
  };

  const isImageChanged = (original, current) => current instanceof File || original !== current;

  const isWaterChanged = () => {
    const original = sections?.find((s) => s.id === 1);
    if (!original) return false;
    return original.contact_no !== waterPark.contact_no || original.section_heading !== waterPark.section_heading || original.section_text !== waterPark.section_text || isImageChanged(original.front_image, waterPark.front_image) || isImageChanged(original.background_image, waterPark.background_image);
  };

  const isResortChanged = () => {
    const original = sections?.find((s) => s.id === 2);
    if (!original) return false;
    return original.contact_no !== resort.contact_no || original.section_heading !== resort.section_heading || original.section_text !== resort.section_text || isImageChanged(original.front_image, resort.front_image) || isImageChanged(original.background_image, resort.background_image);
  };

  const handleSubmit = async (type) => {
    try {
      if (type === "water") {
        const payload = { ...waterPark, name: "water_park" };
        if (!waterExists) {
          if (!payload.contact_no?.trim() || !payload.section_heading?.trim() || !payload.section_text?.trim() || !payload.front_image || !payload.background_image) return toast.error("All fields are required for Water Park");
          await dispatch(createWpRSection(payload));
          toast.success("Water Park created successfully");
        } else {
          if (!isWaterChanged()) return toast.info("No changes to update");
          await dispatch(updateWpRSection(1, payload));
          toast.success("Water Park updated successfully");
        }
      } else {
        const payload = { ...resort, name: "resort" };
        if (!resortExists) {
          if (!payload.contact_no?.trim() || !payload.section_heading?.trim() || !payload.section_text?.trim() || !payload.front_image || !payload.background_image) return toast.error("All fields are required for Resort");
          await dispatch(createWpRSection(payload));
          toast.success("Resort created successfully");
        } else {
          if (!isResortChanged()) return toast.info("No changes to update");
          await dispatch(updateWpRSection(2, payload));
          toast.success("Resort updated successfully");
        }
      }
    } catch (err) { toast.error(err || "Something went wrong"); }
  };

  const SectionCard = ({ title, data, type }) => (
    <div className="bg-[#f8fafc] rounded-xl p-5 shadow-[0_0_4px_1px_rgba(0,0,0,0.08)]">
      <h3 className="text-[18px] font-semibold text-center mb-4">{title}</h3>
      <div className="flex flex-col gap-[10px]">
        <div className="grid grid-cols-2 gap-5">
          <div className="flex flex-col gap-2 mb-3">
            <label className="text-sm font-medium">Name</label>
            <input className={inputCls} value={type === "water" ? "water_park" : "resort"} disabled />
          </div>
          <div className="flex flex-col gap-2 mb-3">
            <label className="text-sm font-medium">Contact No</label>
            <input className={inputCls} name="contact_no" value={data.contact_no || ""}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                if (value.length <= 10) handleChange({ target: { name: "contact_no", value } }, type);
              }} />
          </div>
        </div>
        <div className="flex flex-col gap-2 mb-3">
          <label className="text-sm font-medium">Heading</label>
          <input className={inputCls} name="section_heading" value={data.section_heading || ""} onChange={(e) => handleChange(e, type)} maxLength={45} />
        </div>
        <div className="flex flex-col gap-2 mb-3">
          <label className="text-sm font-medium">Text</label>
          <textarea className={`${inputCls} resize-none overflow-hidden min-h-[100px] leading-[1.5]`} name="section_text" value={data.section_text || ""} onChange={(e) => handleChange(e, type)} maxLength={220} />
          <div className="text-sm text-right">{(data.section_text || "").length}/220</div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {["front_image", "background_image"].map((imgKey) => (
            <div key={imgKey} className="flex flex-col gap-3 mb-6">
              <label className="text-sm font-medium capitalize">{imgKey.replace("_", " ")}</label>
              <div className="w-full h-[150px] rounded-lg overflow-hidden bg-[#f5f5f5] flex items-center justify-center">
                {getImagePreview(data[imgKey]) && (
                  <img src={getImagePreview(data[imgKey])} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <label className="bg-[#f1f1f1] hover:bg-[#ddd] px-[8px] py-[8px] text-center rounded-md cursor-pointer text-sm transition-all w-max">
                Change Image
                <input type="file" name={imgKey} onChange={(e) => handleChange(e, type)} hidden />
              </label>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={() => handleSubmit(type)}
        disabled={type === "water" ? (waterExists && sections?.length && !isWaterChanged()) : (resortExists && sections?.length && !isResortChanged())}
        className="block mx-auto px-3 py-3 border-none rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold cursor-pointer transition-all disabled:opacity-50"
      >
        {type === "water" ? (waterExists ? "Update Water Park" : "Create Water Park") : (resortExists ? "Update Resort" : "Create Resort")}
      </button>
    </div>
  );

  return (
    <div className="p-5 bg-[#f8fafc]">
      <h2 className="text-[22px] font-semibold font-[Playfair_Display] mb-4">Water Park & Resort Sections</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[30px] ">
        <SectionCard title="Water Park" data={waterPark} type="water" />
        <SectionCard title="Resort" data={resort} type="resort" />
      </div>
    </div>
  );
};

export default AdminWpRSection;

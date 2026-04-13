import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTerms, createTerms, updateTerms } from "../../../redux/actions/AdminPrivacyTermsAction";
import { toast } from "react-toastify";

const parseTerms = (body) => {
  if (!body) return { intro: "", points: [] };
  const parts = body.split("\n\n");
  const intro = parts[0] || "";
  const points = parts.slice(1).map((item) => {
    const lines = item.split("\n");
    return { heading: lines[0]?.replace(/^\d+\.\s*/, ""), text: lines.slice(1).join(" ") };
  });
  return { intro, points };
};

const inputCls  = "text-base px-[8px] py-[8px] rounded-lg border border-[#ccc] outline-none focus:border-[#007bff] transition-all capitalize w-full";
const taCls     = "text-base px-[8px] py-[8px] rounded-lg border border-[#ccc] outline-none focus:border-[#007bff] transition-all resize-none overflow-hidden min-h-[100px] leading-[1.5] w-full";
const ptInputCls = "text-base px-[8px] py-[8px] rounded-lg h-max border border-[#ccc] outline-none focus:border-[#007bff] transition-all capitalize w-[200px]";
const ptTaCls   = "text-base px-[8px] py-[8px] rounded-lg border border-[#ccc] outline-none focus:border-[#007bff] transition-all resize-none overflow-hidden min-h-[80px] leading-[1.5] w-full";
const btnBlue   = "px-[8px] py-[8px] rounded-lg border-none bg-[#007bff] text-white text-sm cursor-pointer transition-all";
const btnRed    = "px-[8px] py-[8px] rounded-lg border-none bg-[#ff5959] text-white text-sm cursor-pointer transition-all";
const btnGray   = "px-[8px] py-[8px] rounded-lg border-none bg-[#cdcdcd] text-sm cursor-pointer transition-all";

export default function AdminTerms() {
  const dispatch = useDispatch();
  const { terms, loading } = useSelector((state) => state.AdminPrivacyTerms || {});

  const [title, setTitle] = useState("");
  const [intro, setIntro] = useState("");
  const [points, setPoints] = useState([]);
  const [isChanged, setIsChanged] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [newPoint, setNewPoint] = useState({ heading: "", text: "" });

  useEffect(() => { dispatch(getTerms()); }, [dispatch]);

  useEffect(() => {
    if (terms) {
      const parsed = parseTerms(terms.body);
      setTitle(terms.title || "");
      setIntro(parsed.intro);
      setPoints(parsed.points);
    }
  }, [terms]);

  const handlePointChange = (index, key, value) => {
    const updated = [...points];
    updated[index][key] = value;
    setPoints(updated);
    setIsChanged(true);
  };

  const confirmDelete = (index) => {
    setPoints(points.filter((_, i) => i !== index));
    setDeleteIndex(null);
    setIsChanged(true);
  };

  const handleSubmit = async () => {
    const body = intro + "\n\n" + points.map((p, i) => `${i + 1}. ${p.heading}\n${p.text}`).join("\n\n");
    const payload = { title, body, slug: "terms-and-conditions" };
    try {
      let res;
      if (terms?.id) { res = await dispatch(updateTerms(terms.id, payload)); }
      else { res = await dispatch(createTerms(payload)); }
      if (res) { toast.success(terms?.id ? "Terms updated successfully" : "Terms created successfully"); }
      else { toast.error("Something went wrong"); }
    } catch (err) { toast.error(err || "Something went wrong"); }
  };

  return (
    <div className="mb-20">
      <h5 className="text-[24px] font-medium text-center mb-8">Terms & Conditions</h5>

      {/* TITLE + INTRO */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-10 mb-6">
        <div className="flex flex-col">
          <label className="text-base mb-3">Title</label>
          <input value={title} onChange={(e) => { setTitle(e.target.value); setIsChanged(true); }} className={inputCls} />
        </div>
        <div className="flex flex-col">
          <label className="text-base mb-3">Introduction Text</label>
          <textarea value={intro} onChange={(e) => { setIntro(e.target.value); setIsChanged(true); }} rows={4} className={taCls} />
        </div>
      </div>

      {/* POINTS */}
      <div className="flex flex-col gap-5">
        <h3>Points</h3>
        {points.map((p, i) => (
          <div key={i} className="flex flex-col sm:grid gap-3 sm:gap-5 mb-5 p-3 sm:p-0 bg-white sm:bg-transparent rounded-lg sm:rounded-none border sm:border-none border-[#eee]"
            style={{ gridTemplateColumns: "50px 200px 5fr 1fr" }}>
            <p className="text-base font-semibold sm:text-center sm:px-[8px] sm:py-[8px]">{i + 1}.</p>
            <input value={p.heading} placeholder="Point Heading" onChange={(e) => handlePointChange(i, "heading", e.target.value)} className={`${ptInputCls} sm:w-[200px] w-full`} />
            <textarea value={p.text} placeholder="Point Description" onChange={(e) => handlePointChange(i, "text", e.target.value)} rows={3} className={ptTaCls} />
            <div className="flex flex-row sm:flex-col gap-2 sm:gap-[10px]">
              {deleteIndex === i ? (
                <>
                  <button onClick={() => confirmDelete(i)} className={btnRed}>Confirm Remove</button>
                  <button onClick={() => setDeleteIndex(null)} className={btnGray}>Cancel</button>
                </>
              ) : (
                <button onClick={() => setDeleteIndex(i)} className={btnRed}>Remove</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ADD POINT */}
      <div className="flex flex-col gap-5 mb-8">
        {isAdding ? (
          <div className="flex flex-col sm:grid gap-3 sm:gap-5 p-3 sm:p-0 bg-white sm:bg-transparent rounded-lg sm:rounded-none border sm:border-none border-[#eee]"
            style={{ gridTemplateColumns: "50px 200px 5fr 1fr" }}>
            <p className="text-[#007bff] capitalize font-semibold sm:px-[8px] sm:py-[8px]">new</p>
            <input placeholder="New Heading" value={newPoint.heading} onChange={(e) => setNewPoint({ ...newPoint, heading: e.target.value })} className={`${ptInputCls} sm:w-[200px] w-full`} />
            <textarea placeholder="New Description" value={newPoint.text} onChange={(e) => setNewPoint({ ...newPoint, text: e.target.value })} rows={3} className={ptTaCls} />
            <div className="flex flex-row sm:flex-col gap-2 sm:gap-[10px]">
              <button onClick={() => { setPoints([...points, newPoint]); setNewPoint({ heading: "", text: "" }); setIsAdding(false); setIsChanged(true); }} className={btnBlue}>Confirm Add</button>
              <button onClick={() => setIsAdding(false)} className={btnGray}>Cancel Add</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setIsAdding(true)}
            className="px-4 py-2 rounded-lg border-none bg-[#007bff] text-white text-base font-medium cursor-pointer transition-all w-max ml-auto mr-[50px]">
            + Add Point
          </button>
        )}
      </div>

      {/* SUBMIT */}
      <button onClick={handleSubmit} disabled={loading || !isChanged}
        className="block mx-auto px-4 py-2 rounded-lg border-none bg-[#007bff] text-white text-base font-medium cursor-pointer disabled:opacity-70 transition-all w-max">
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}

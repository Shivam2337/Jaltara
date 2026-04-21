import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getFaqList, createFaq, updateFaq } from "../../../redux/actions/AdminFaqAction";

const inputCls = "text-base px-[8px] py-[8px] rounded-lg h-max border border-[#ccc] outline-none focus:border-[#007bff] transition-all capitalize w-full";
const textareaCls = "text-base px-[8px] py-[8px] rounded-lg border border-[#ccc] outline-none focus:border-[#007bff] transition-all resize-none overflow-hidden min-h-[80px] leading-[1.5] w-full";
const orderCls = "text-base px-[8px] py-[8px] rounded-lg border border-[#ccc] outline-none focus:border-[#007bff] transition-all text-center w-full sm:w-[60px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

/* RowGrid defined OUTSIDE to prevent remount on every keystroke */
const RowGrid = ({ children }) => (
  <div className="flex flex-col sm:grid gap-3 sm:gap-5 mb-5 p-3 sm:p-0 bg-white sm:bg-transparent rounded-lg sm:rounded-none border sm:border-none border-[#eee]"
    style={{ gridTemplateColumns: "4fr 6fr 60px auto auto" }}>
    {children}
  </div>
);

export default function AdminFaq() {
  const dispatch = useDispatch();
  const { faqs } = useSelector((state) => state.Faq);

  const [showAdd, setShowAdd] = useState(false);
  const [newFaq, setNewFaq] = useState({ question: "", answer: "", order: "" });
  const [editFaqs, setEditFaqs] = useState([]);

  useEffect(() => { dispatch(getFaqList()); }, [dispatch]);
  useEffect(() => { if (faqs) setEditFaqs(faqs); }, [faqs]);

  const handleCreate = async () => {
    if (!newFaq.question || !newFaq.answer) return;
    const res = await dispatch(createFaq(newFaq));
    if (res?.success) { toast.success("FAQ added successfully"); setNewFaq({ question: "", answer: "", order: "" }); setShowAdd(false); }
    else toast.error(res?.error || "Failed to add FAQ");
  };

  const handleUpdate = async (id, faq) => {
    const original = faqs.find((f) => f.id === id);
    const isChanged = original.question !== faq.question || original.answer !== faq.answer || Number(original.order) !== Number(faq.order);
    if (!isChanged) return;
    const res = await dispatch(updateFaq(id, faq));
    if (res?.success) toast.success("FAQ updated successfully");
    else toast.error(res?.error || "Failed to update FAQ");
  };

  const handleToggle = async (faq) => {
    const res = await dispatch(updateFaq(faq.id, { ...faq, is_active: !faq.is_active }));
    if (res?.success) toast.success("Status updated");
    else toast.error(res?.error || "Failed to update status");
  };

  const handleChange = (id, field, value) => {
    setEditFaqs(editFaqs.map((faq) => faq.id === id ? { ...faq, [field]: value } : faq));
  };

  const sortedFaqs = [...editFaqs].sort((a, b) => Number(a.order) - Number(b.order));
  const isAddDisabled = !newFaq.question || !newFaq.answer || newFaq.order === "";

  return (
    <div className="p-5 bg-[#f8fafc] min-h-screen text-[#333]">
      <h2 className="text-[22px] font-semibold font-[Playfair_Display] mb-8">FAQ Page Manager</h2>

      {/* HEADING ROW — desktop only */}
      <div className="hidden sm:grid gap-5 mb-5" style={{ gridTemplateColumns: "4fr 6fr 60px auto auto" }}>
        {["Question", "Answer", "Order", "Update", "Visible"].map((h) => (
          <p key={h} className="text-sm capitalize px-4 py-2">{h}</p>
        ))}
      </div>

      {/* FAQ ROWS */}
      {sortedFaqs.map((faq) => {
        const original = faqs.find((f) => f.id === faq.id);
        const isChanged = original?.question !== faq.question || original?.answer !== faq.answer || Number(original?.order) !== Number(faq.order);
        return (
          <RowGrid key={faq.id}>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#888] sm:hidden">Question</label>
              <input className={inputCls} type="text" value={faq.question} onChange={(e) => handleChange(faq.id, "question", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#888] sm:hidden">Answer</label>
              <textarea className={textareaCls} value={faq.answer} onChange={(e) => handleChange(faq.id, "answer", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#888] sm:hidden">Order</label>
              <input className={orderCls} type="number" value={faq.order} onChange={(e) => handleChange(faq.id, "order", e.target.value)} />
            </div>
            <button onClick={() => handleUpdate(faq.id, faq)} disabled={!isChanged}
              className="px-4 py-2 rounded-lg border-none bg-[#007bff] text-white text-sm font-medium h-max cursor-pointer disabled:opacity-70 transition-all">
              Update
            </button>
            <button onClick={() => handleToggle(faq)}
              className={`px-4 py-2 rounded-lg border-none text-white text-sm h-max cursor-pointer transition-all ${faq.is_active ? "bg-[#ff5959]" : "bg-[#007bff]"}`}>
              {faq.is_active ? "Hide" : "Show"}
            </button>
          </RowGrid>
        );
      })}

      {/* ADD ROW */}
      {showAdd && (
        <RowGrid>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[#888] sm:hidden">Question</label>
            <input className={inputCls} type="text" placeholder="Question" value={newFaq.question} onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[#888] sm:hidden">Answer</label>
            <textarea className={textareaCls} placeholder="Answer" value={newFaq.answer} onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[#888] sm:hidden">Order</label>
            <input className={orderCls} type="number" placeholder="Order" value={newFaq.order} onChange={(e) => setNewFaq({ ...newFaq, order: e.target.value })} />
          </div>
          <button onClick={handleCreate} disabled={isAddDisabled}
            className="px-4 py-2 rounded-lg border-none bg-[#007bff] text-white text-sm h-max cursor-pointer disabled:opacity-70 transition-all">
            Save
          </button>
          <div />
        </RowGrid>
      )}

      {/* ADD / CANCEL BUTTON */}
      <button onClick={() => setShowAdd(!showAdd)}
        className={`block mx-auto px-4 py-2 rounded-lg border-none text-base font-semibold h-max cursor-pointer transition-all
          ${showAdd ? "bg-[#cdcdcd] text-[#333]" : "bg-[#007bff] text-white"}`}>
        {showAdd ? "Cancel" : "Add FAQ"}
      </button>
    </div>
  );
}

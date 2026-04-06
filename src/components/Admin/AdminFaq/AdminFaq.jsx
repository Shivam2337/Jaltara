import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  getFaqList,
  createFaq,
  updateFaq,
} from "../../../redux/actions/AdminFaqAction";
import "./AdminFaq.css";

export default function AdminFaq() {
  const dispatch = useDispatch();

  const { faqs } = useSelector((state) => state.Faq);

  const [showAdd, setShowAdd] = useState(false);
  const [newFaq, setNewFaq] = useState({
    question: "",
    answer: "",
    order: "",
  });

  const [editFaqs, setEditFaqs] = useState([]);

  useEffect(() => {
    dispatch(getFaqList());
  }, [dispatch]);

  useEffect(() => {
    if (faqs) {
      setEditFaqs(faqs);
    }
  }, [faqs]);

  const handleCreate = async () => {
    if (!newFaq.question || !newFaq.answer) return;

    const res = await dispatch(createFaq(newFaq));

    if (res?.success) {
      toast.success("FAQ added successfully");
      setNewFaq({ question: "", answer: "", order: "" });
      setShowAdd(false);
    } else {
      toast.error(res?.error || "Failed to add FAQ");
    }
  };

  const handleUpdate = async (id, faq) => {
    const original = faqs.find((f) => f.id === id);

    const isChanged =
      original.question !== faq.question ||
      original.answer !== faq.answer ||
      Number(original.order) !== Number(faq.order);

    if (!isChanged) return;

    const res = await dispatch(updateFaq(id, faq));

    if (res?.success) {
      toast.success("FAQ updated successfully");
    } else {
      toast.error(res?.error || "Failed to update FAQ");
    }
  };

  const handleToggle = async (faq) => {
    const updatedFaq = {
      ...faq,
      is_active: !faq.is_active,
    };

    const res = await dispatch(updateFaq(faq.id, updatedFaq));

    if (res?.success) {
      toast.success("Status updated");
    } else {
      toast.error(res?.error || "Failed to update status");
    }
  };

  const handleChange = (id, field, value) => {
    const updated = editFaqs.map((faq) =>
      faq.id === id ? { ...faq, [field]: value } : faq
    );
    setEditFaqs(updated);
  };

  const sortedFaqs = [...editFaqs].sort(
    (a, b) => Number(a.order) - Number(b.order)
  );

  const isAddDisabled =
    !newFaq.question || !newFaq.answer || newFaq.order === "";

  return (
    <div className="admin-faq-container">
      <h2 className="admin-faq-title">FAQ Page Manger</h2>

      <div className="admin-faq-box-heading">
        <p>Question</p>
        <p>answer</p>
        <p>order</p>
        <p>update</p>
        <p>visible</p>
      </div>
      {/* <hr className="admin-faq-seperator" /> */}
      {sortedFaqs.map((faq) => {
        const original = faqs.find((f) => f.id === faq.id);

        const isChanged =
          original?.question !== faq.question ||
          original?.answer !== faq.answer ||
          Number(original?.order) !== Number(faq.order);

        return (
          <div key={faq.id} className="admin-faq-box">
            <input
              className="admin-faq-input"
              type="text"
              value={faq.question}
              onChange={(e) => handleChange(faq.id, "question", e.target.value)}
            />

            <textarea
              className="admin-faq-textarea"
              type="text"
              value={faq.answer}
              onChange={(e) => handleChange(faq.id, "answer", e.target.value)}
            />

            <input
              className="admin-faq-order"
              type="number"
              value={faq.order}
              onChange={(e) => handleChange(faq.id, "order", e.target.value)}
            />

            <button
              className="admin-faq-update-button"
              onClick={() => handleUpdate(faq.id, faq)}
              disabled={!isChanged}
            >
              Update
            </button>

            <button
              className={`admin-faq-show-button ${
                faq.is_active ? "admin-faq-show-button-hide" : ""
              }`}
              onClick={() => handleToggle(faq)}
            >
              {faq.is_active ? "Hide" : "Show"}
            </button>
          </div>
        );
      })}

      {showAdd && (
        <div className="admin-faq-box">
          <input
            className="admin-faq-input"
            type="text"
            placeholder="Question"
            value={newFaq.question}
            onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
          />

          <textarea
            className="admin-faq-textarea"
            type="text"
            placeholder="Answer"
            value={newFaq.answer}
            onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
          />

          <input
            className="admin-faq-order"
            type="number"
            placeholder="Order"
            value={newFaq.order}
            onChange={(e) => setNewFaq({ ...newFaq, order: e.target.value })}
          />

          <button
            className="admin-faq-save-button"
            onClick={handleCreate}
            disabled={isAddDisabled}
          >
            Save
          </button>
        </div>
      )}

      <button
        className={`admin-faq-add-button ${
          showAdd ? "admin-faq-add-button-cancel" : ""
        }`}
        onClick={() => setShowAdd(!showAdd)}
      >
        {showAdd ? "Cancel" : "Add FAQ"}
      </button>
    </div>
  );
}

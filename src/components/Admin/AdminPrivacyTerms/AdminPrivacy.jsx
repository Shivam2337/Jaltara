import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getPrivacy,
  createPrivacy,
  updatePrivacy,
} from "../../../redux/actions/AdminPrivacyTermsAction";

/* ================= PARSE FUNCTION ================= */

const parseTerms = (body) => {
  if (!body) return { intro: "", points: [] };

  const parts = body.split("\n\n");

  const intro = parts[0] || "";

  const points = parts.slice(1).map((item) => {
    const lines = item.split("\n");

    return {
      heading: lines[0]?.replace(/^\d+\.\s*/, ""),
      text: lines.slice(1).join(" "),
    };
  });

  return { intro, points };
};

/* ================= COMPONENT ================= */

export default function AdminPrivacy() {
  const dispatch = useDispatch();

  const { privacy, loading, error } = useSelector(
    (state) => state.AdminPrivacyTerms || {}
  );

  const [title, setTitle] = useState("");
  const [intro, setIntro] = useState("");
  const [points, setPoints] = useState([]);
  const [isChanged, setIsChanged] = useState(false);

  const [isAdding, setIsAdding] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const [newPoint, setNewPoint] = useState({
    heading: "",
    text: "",
  });

  useEffect(() => {
    dispatch(getPrivacy());
  }, [dispatch]);

  useEffect(() => {
    if (privacy && privacy.body) {
      const parsed = parseTerms(privacy.body);

      setTitle(privacy.title || "");
      setIntro(parsed.intro || "");
      setPoints(parsed.points || []);
    }
  }, [privacy]);

  const handlePointChange = (index, key, value) => {
    const updated = [...points];
    updated[index][key] = value;
    setPoints(updated);
    setIsChanged(true);
  };

  const confirmDelete = (index) => {
    const updated = points.filter((_, i) => i !== index);
    setPoints(updated);
    setDeleteIndex(null);
    setIsChanged(true);
  };

  const handleSubmit = async () => {
    const body =
      intro +
      "\n\n" +
      points.map((p, i) => `${i + 1}. ${p.heading}\n${p.text}`).join("\n\n");

    const payload = {
      title,
      body,
      slug: "privacy-policy",
    };

    try {
      if (privacy?.id) {
        await dispatch(updatePrivacy(privacy.id, payload));
      } else {
        await dispatch(createPrivacy(payload));
      }
    } catch (err) {
      console.error(err);
    }

    setIsChanged(false);
  };

  return (
    <div className="admin-terms-div">
      <h5 className="admin-terms-title">Privacy Policy</h5>

      {/* ERROR */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* TITLE */}
      <div className="admin-terms-title-box">
        <div className="admin-terms-title-box-group">
          <label className="admin-terms-title-box-label">Title</label>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setIsChanged(true);
            }}
            className="admin-terms-title-box-input"
          />
        </div>

        {/* INTRO */}
        <div className="admin-terms-title-box-group">
          <label className="admin-terms-title-box-label">
            Introduction Text
          </label>
          <textarea
            value={intro}
            onChange={(e) => {
              setIntro(e.target.value);
              setIsChanged(true);
            }}
            rows={4}
            className="admin-terms-title-box-textarea"
          />
        </div>
      </div>

      {/* POINTS */}
      <div className="admin-terms-points-div">
        <h3 className="admin-terms-points-title">Points</h3>

        {points.map((p, i) => (
          <div key={i} className="admin-terms-point-box">
            <p className="admin-terms-point-box-bullet">{i + 1}.</p>

            <input
              value={p.heading}
              placeholder="Point Heading"
              onChange={(e) => handlePointChange(i, "heading", e.target.value)}
              className="admin-terms-point-box-input"
            />

            <textarea
              value={p.text}
              placeholder="Point Description"
              onChange={(e) => handlePointChange(i, "text", e.target.value)}
              rows={3}
              className="admin-terms-point-box-textarea"
            />

            <div className="admin-terms-point-remove-box">
              {deleteIndex === i ? (
                <>
                  <button
                    onClick={() => confirmDelete(i)}
                    className="admin-terms-point-remove-btn-confirm"
                  >
                    Confirm Remove
                  </button>
                  <button
                    onClick={() => setDeleteIndex(null)}
                    className="admin-terms-point-remove-btn-cancel"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  className="admin-terms-point-remove-btn"
                  onClick={() => setDeleteIndex(i)}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ADD POINT */}
      <div className="admin-terms-point-add-box">
        {isAdding ? (
          <div className="admin-terms-point-add-box-point">
            <p>new</p>

            <input
              placeholder="New Heading"
              value={newPoint.heading}
              onChange={(e) =>
                setNewPoint({ ...newPoint, heading: e.target.value })
              }
              className="admin-terms-point-add-box-point-input"
            />

            <textarea
              placeholder="New Description"
              value={newPoint.text}
              onChange={(e) =>
                setNewPoint({ ...newPoint, text: e.target.value })
              }
              rows={3}
              className="admin-terms-point-add-box-point-textarea"
            />

            <div className="admin-terms-point-add-btn-box">
              <button
                onClick={() => {
                  setPoints([...points, newPoint]);
                  setNewPoint({ heading: "", text: "" });
                  setIsAdding(false);
                  setIsChanged(true);
                }}
                className="admin-terms-point-add-box-point-confirmAdd"
              >
                Confirm Add
              </button>

              <button
                onClick={() => setIsAdding(false)}
                className="admin-terms-point-add-box-point-cancelAdd"
              >
                Cancel Add
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="admin-terms-point-add-box-point-Add"
          >
            + Add Point
          </button>
        )}
      </div>

      {/* SUBMIT */}
      <button
        onClick={handleSubmit}
        disabled={loading || !isChanged}
        className="admin-terms-save-btn"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}

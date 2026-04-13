import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getHallFeaturesAction,
  createHallFeatureAction,
  updateHallFeatureAction,
  deleteHallFeatureAction,
  getHallsAction,
} from "../../../redux/actions/AdminHallAction";
import { toast } from "react-toastify";

const HallFeaturesAdmin = () => {
  const dispatch = useDispatch();

  const { features, featureLoading, featureError, halls } = useSelector((state) => state.hall);

  const [hall, setHall] = useState("");
  const [name, setName] = useState("");
  const [featureType, setFeatureType] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    dispatch(getHallFeaturesAction());
    dispatch(getHallsAction());
  }, [dispatch]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const data = { hall, name, feature_type: featureType };
    try {
      if (editId) {
        await dispatch(updateHallFeatureAction(editId, data));
        setEditId(null);
      } else {
        await dispatch(createHallFeatureAction(data));
      }
      setHall(""); setName(""); setFeatureType("");
    } catch (err) { console.error("Feature submit error:", err); }
  };

  const editHandler = (item) => {
    setEditId(item.id); setHall(item.hall); setName(item.name); setFeatureType(item.feature_type);
  };

  const deleteHandler = (id) => {
    if (window.confirm("Delete this feature?")) dispatch(deleteHallFeatureAction(id));
  };

  const inputCls = "px-[10px] py-[10px] border border-[#ccc] rounded-lg text-sm outline-none focus:border-[#2563eb] w-full sm:w-auto";

  return (
    <div className="p-6">
      <h2 className="text-[20px] font-semibold text-[#1f2937] mb-5">Hall Features Management</h2>

      {/* FORM */}
      <form onSubmit={submitHandler} className="flex flex-col sm:flex-row flex-wrap gap-3 mb-8">
        <select value={hall} onChange={(e) => setHall(e.target.value)} required className={inputCls}>
          <option value="">Select Hall</option>
          {halls?.map((h) => (
            <option key={h.id} value={h.id}>{h.title || h.name}</option>
          ))}
        </select>

        <input type="text" placeholder="Feature Name" value={name}
          onChange={(e) => setName(e.target.value)} required className={inputCls} />

        <select value={featureType} onChange={(e) => setFeatureType(e.target.value)} required className={inputCls}>
          <option value="">Select Feature Type</option>
          <option value="FACILITY">FACILITY</option>
          <option value="EVENT">EVENT</option>
        </select>

        <button type="submit"
          className="bg-[#198754] hover:bg-[#157347] text-white px-5 py-[10px] rounded-lg border-none cursor-pointer text-sm transition-colors">
          {editId ? "Update Feature" : "Add Feature"}
        </button>
      </form>

      {featureLoading && <p className="text-sm text-[#666]">Loading features...</p>}
      {featureError && <p className="text-sm text-red-500">{featureError}</p>}

      {/* TABLE */}
      <div className="bg-white rounded-xl overflow-x-auto shadow-[0_0_10px_rgba(0,0,0,0.1)]">
        <table className="w-full border-collapse min-w-[400px]">
          <thead className="bg-[#f1f5f9]">
            <tr>
              {["Hall","Name","Type","Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-center text-sm font-semibold text-[#374151] border-b border-[#eee]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.length === 0 && !featureLoading && (
              <tr><td colSpan="4" className="text-center py-6 text-sm text-[#9ca3af]">No features added yet</td></tr>
            )}
            {features.map((f) => (
              <tr key={f.id} className="border-b border-[#eee] hover:bg-[#f9fafb]">
                <td className="px-4 py-3 text-sm text-center text-[#374151]">
                  {halls?.find((h) => h.id === f.hall)?.title || halls?.find((h) => h.id === f.hall)?.name || f.hall}
                </td>
                <td className="px-4 py-3 text-sm text-center text-[#374151]">{f.name}</td>
                <td className="px-4 py-3 text-sm text-center text-[#374151]">{f.feature_type}</td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => editHandler(f)}
                    className="bg-orange-400 hover:bg-orange-500 text-white border-none px-[10px] py-[6px] rounded text-sm cursor-pointer mr-2 transition-colors">
                    Edit
                  </button>
                  <button onClick={() => deleteHandler(f.id)}
                    className="bg-red-500 hover:bg-red-600 text-white border-none px-[10px] py-[6px] rounded text-sm cursor-pointer transition-colors">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HallFeaturesAdmin;

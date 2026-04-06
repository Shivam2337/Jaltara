import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getHallFeaturesAction,
  createHallFeatureAction,
  updateHallFeatureAction,
  deleteHallFeatureAction,
  // ✅ CHANGE 1 — Import getHallsAction
  getHallsAction,
} from "../../../redux/actions/AdminHallAction";
import "./HallFeaturesAdmin.css";

const HallFeaturesAdmin = () => {
  const dispatch = useDispatch();

  const { features, featureLoading, featureError } = useSelector(
    (state) => state.hall
  );

  // ✅ CHANGE 2 — Get halls from Redux for dropdown
  const { halls } = useSelector((state) => state.hall);

  const [hall, setHall] = useState("");
  const [name, setName] = useState("");
  const [featureType, setFeatureType] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    dispatch(getHallFeaturesAction());
    // ✅ CHANGE 3 — Fetch halls for dropdown
    dispatch(getHallsAction());
  }, [dispatch]);

  const submitHandler = async (e) => {
    e.preventDefault();

    const data = {
      hall,
      name,
      feature_type: featureType,
    };

    if (editId) {
      await dispatch(updateHallFeatureAction(editId, data));
      setEditId(null);
    } else {
      await dispatch(createHallFeatureAction(data));
    }

    setHall("");
    setName("");
    setFeatureType("");
  };

  const editHandler = (item) => {
    setEditId(item.id);
    setHall(item.hall);
    setName(item.name);
    setFeatureType(item.feature_type);
  };

  const deleteHandler = (id) => {
    if (window.confirm("Delete this feature?")) {
      dispatch(deleteHallFeatureAction(id));
    }
  };

  return (
    <div className="feature-page">
      <h2>Hall Features Management</h2>

      <form className="feature-form" onSubmit={submitHandler}>

        {/* ✅ CHANGE 4 — Replaced Hall ID input with dropdown */}
        <select
          value={hall}
          onChange={(e) => setHall(e.target.value)}
          required
        >
          <option value="">Select Hall</option>
          {halls?.map((h) => (
            <option key={h.id} value={h.id}>
              {h.title || h.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Feature Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <select
          value={featureType}
          onChange={(e) => setFeatureType(e.target.value)}
          required
        >
          <option value="">Select Feature Type</option>
          <option value="FACILITY">FACILITY</option>
          <option value="EVENT">EVENT</option>
        </select>

        <button type="submit">
          {editId ? "Update Feature" : "Add Feature"}
        </button>
      </form>

      {featureLoading && <p>Loading features...</p>}
      {featureError && <p className="error">{featureError}</p>}

      <table className="feature-table">
        <thead>
          <tr>
            <th>Hall</th>
            <th>Name</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {features.length === 0 && !featureLoading && (
            <tr>
              <td colSpan="4">No features added yet</td>
            </tr>
          )}
          {features.map((f) => (
            <tr key={f.id}>
              {/* ✅ CHANGE 5 — Show hall name instead of hall ID */}
              <td>
                {halls?.find((h) => h.id === f.hall)?.title ||
                  halls?.find((h) => h.id === f.hall)?.name ||
                  f.hall}
              </td>
              <td>{f.name}</td>
              <td>{f.feature_type}</td>
              <td>
                <button className="edit" onClick={() => editHandler(f)}>
                  Edit
                </button>
                <button className="delete" onClick={() => deleteHandler(f.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HallFeaturesAdmin;
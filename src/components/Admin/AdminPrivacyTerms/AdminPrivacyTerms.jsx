import "./AdminPrivacyTerms.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getAllPages } from "../../../redux/actions/AdminPrivacyTermsAction";

import AdminTerms from "./AminTerms";
import AdminPrivacy from "./AdminPrivacy";

export default function AdminPrivacyTerms() {
  const dispatch = useDispatch();

  const { pages, loading, error } = useSelector(
    (state) => state.AdminPrivacyTerms
  );

  //get all cms
  useEffect(() => {
    dispatch(getAllPages());
  }, [dispatch]);

  useEffect(() => {
    if (pages) {
      console.log("ALL CMS  ", pages);
    }
  }, [pages]);

  return (
    <div className="Admin-pt-container">
      <div className="admin-pt-heading-box">
        <h2 className="admin-pt-heading">Manage Privacy And Terms here</h2>
      </div>

      <AdminTerms />
      <hr className="admin-pt-section-devider" />
      <AdminPrivacy />
    </div>
  );
}

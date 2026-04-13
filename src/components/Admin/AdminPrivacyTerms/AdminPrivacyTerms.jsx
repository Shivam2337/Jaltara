import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPages } from "../../../redux/actions/AdminPrivacyTermsAction";
import AdminTerms from "./AminTerms";
import AdminPrivacy from "./AdminPrivacy";

export default function AdminPrivacyTerms() {
  const dispatch = useDispatch();
  const { pages, loading, error } = useSelector((state) => state.AdminPrivacyTerms);

  useEffect(() => { dispatch(getAllPages()); }, [dispatch]);
  useEffect(() => { if (pages) console.log("ALL CMS  ", pages); }, [pages]);

  return (
    <div className="p-5 bg-[#f8fafc] min-h-screen transition-all duration-200">
      <div className="flex justify-between mb-6">
        <h2 className="text-[22px] font-semibold font-[Playfair_Display] mb-4">
          Manage Privacy And Terms here
        </h2>
      </div>

      <AdminTerms />
      <hr className="mb-20 border-t border-[#ccc]" />
      <AdminPrivacy />
    </div>
  );
}

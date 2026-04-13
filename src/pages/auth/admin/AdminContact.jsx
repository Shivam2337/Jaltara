import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEye } from "react-icons/fa";
import { AdminContactAction } from "../../../redux/actions/AdminContactAction";

const AdminContact = () => {
  const dispatch = useDispatch();
  const { loading, error, contacts } = useSelector((state) => state.adminContactList);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => { dispatch(AdminContactAction()); }, [dispatch]);

  return (
    <div className="p-[30px] bg-[#f5f7fb] min-h-screen">

      <div className="flex justify-between items-center mb-5">
        <h2 className="text-[26px] font-semibold">Contact Enquiries</h2>
      </div>

      <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-x-auto">
        {loading ? (
          <p className="p-5 text-sm text-[#6b7280]">Loading...</p>
        ) : error ? (
          <p className="p-5 text-sm text-red-500">{error}</p>
        ) : (
          <table className="w-full border-collapse min-w-[600px]">
            <thead className="bg-[#f1f5f9]">
              <tr>
                {["ID","Name","Email","Phone","Message","Date","Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-sm font-semibold text-[#374151] border-t border-[#eee]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {contacts && contacts.length > 0 ? (
                contacts.map((item) => (
                  <tr key={item.id} className="border-t border-[#eee] hover:bg-[#f9fafb]">
                    <td className="px-4 py-3 text-sm text-[#374151] align-middle">{item.id}</td>
                    <td className="px-4 py-3 text-sm text-[#374151] align-middle">{item.name}</td>
                    <td className="px-4 py-3 text-sm text-[#374151] align-middle">{item.email}</td>
                    <td className="px-4 py-3 text-sm text-[#374151] align-middle">{item.phone}</td>
                    <td className="px-4 py-3 text-sm text-[#374151] align-middle max-w-[220px] whitespace-nowrap overflow-hidden text-ellipsis">{item.message}</td>
                    <td className="px-4 py-3 text-[13px] text-[#6b7280] text-center align-middle">{new Date(item.created_at).toLocaleString()}</td>
                    <td className="px-4 py-3 align-middle">
                      <div className="flex gap-3 items-center">
                        <FaEye className="text-[#2563eb] cursor-pointer text-base hover:text-[#1d4ed8] transition-colors" onClick={() => setSelectedMessage(item.message)} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="7" className="text-center py-6 text-sm text-[#9ca3af]">No enquiries found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {selectedMessage && (
        <div className="fixed inset-0 bg-black/35 flex justify-center items-center z-[1000] px-4">
          <div className="bg-white w-full max-w-[420px] p-6 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)]">
            <h3 className="text-lg font-semibold mb-4">Full Message</h3>
            <p className="text-sm leading-[1.6] text-[#374151]">{selectedMessage}</p>
            <button onClick={() => setSelectedMessage(null)}
              className="mt-4 bg-[#2563eb] hover:bg-[#1d4ed8] text-white border-none px-4 py-2 rounded-md text-sm cursor-pointer transition-colors">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContact;

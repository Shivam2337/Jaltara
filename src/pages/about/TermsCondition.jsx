import React, { useEffect } from "react";
import "./TermsConditions.css";

import { useDispatch, useSelector } from "react-redux";
import { getUserTermsAction } from "../../redux/UserActions";

const TermsConditions = () => {
  const dispatch = useDispatch();

  const { loading, error, list } = useSelector((state) => state.userTermsAndConditions || {});

  useEffect(() => {
    dispatch(getUserTermsAction());
  }, [dispatch]);

  const data = list;
  console.log(data);
  let intro = "";
  let formattedData = [];

  if (data?.body) {
    const sections = data.body.split("\n\n");

    // ✅ First = intro
    intro = sections[0];

    // ✅ Rest = proper parsing
    formattedData = sections.slice(1).map((section) => {
      const [titleRaw, ...descParts] = section.split("\n");

      const title = titleRaw.replace(/^\d+\.\s*/, "");
      const desc = descParts.join(" ");

      return { title, desc };
    });
  }
  return (
    <div className="terms-page">
      <div className="terms-container">
        <h1>Terms & Conditions</h1>

        {loading && <p>Loading...</p>}
        {!loading && error && <p>Something went wrong</p>}
        {!loading && !error && !data?.body && <p>No terms available</p>}

        {!loading && !error && data?.body && <p className="terms-intro">{intro}</p>}

        {!loading && !error && data?.body && <h2>Booking Rules & Policies</h2>}

        {!loading && !error && formattedData.length > 0 && (
          <table className="terms-table">
            <tbody>
              {formattedData.map((item, index) => (
                <tr key={index}>
                  <td>
                    <strong>{item.title}</strong>
                  </td>
                  <td>{item.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* <h2>General Terms</h2>

        <ul className="terms-list">
          <li>
            Management reserves the right to refuse entry without providing
            reasons.
          </li>
          <li>All guests must comply with park safety rules.</li>
          <li>Outside food and beverages are not permitted.</li>
          <li>Park management is not responsible for lost or stolen items.</li>
          <li>
            Guests must follow dress code guidelines inside water attractions.
          </li>
        </ul>

        <p className="terms-footer">
          By booking tickets, you confirm that you have read and agreed to all
          the above terms and conditions.
        </p> */}
      </div>
    </div>
  );
};

export default TermsConditions;

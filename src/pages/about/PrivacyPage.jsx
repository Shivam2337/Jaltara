import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserPrivacyAction } from "../../redux/UserActions";

import "./PricacyPage.css";

const PrivacyPolicy = () => {
  const dispatch = useDispatch();

  const privacyState = useSelector((state) => state.userPrivacyPolicy || {});

  const { loading, error, list } = privacyState;
  
  const data = list || {};
  useEffect(() => {
    dispatch(getUserPrivacyAction());
  }, [dispatch]);


  return (
    <div className="privacy-page-container">
      <h3 className="privacy-page-heading">Privacy Policy</h3>

      {loading && <p>Loading...</p>}
      {!loading && error && <p>No privacy policy available</p>}
      {!loading && !error && !data?.body && <p>No privacy policy available</p>}

      {!loading && !error && data && data.body && (
        <div className="privacy-page-point-body">
          {data.body?.split("\n").map((para, index) => {
            const text = para.trim();

            const isHeading = /^\d+\.\s/.test(text);

            if (!text) return null;

            return (
              <p
                key={index}
                className={
                  isHeading
                    ? "privacy-page-point-heading"
                    : "privacy-page-point-text"
                }
              >
                {text}
              </p>
            );
          })}
        </div>
      )}
    </div>
  );
};
 
export default PrivacyPolicy;


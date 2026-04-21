import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserPrivacyAction } from "../../redux/UserActions";

const PrivacyPolicy = () => {
  const dispatch = useDispatch();
  const privacyState = useSelector((state) => state.userPrivacyPolicy || {});
  const { loading, error, list } = privacyState;
  const data = list || {};

  useEffect(() => { dispatch(getUserPrivacyAction()); }, [dispatch]);

  return (
        <div className="px-4 sm:px-[50px] md:px-[80px] lg:px-[140px] xl:px-[170px] pt-[90px] sm:pt-[100px] md:pt-[120px] lg:pt-[140px] font-[Outfit]">

      <h3 className="text-[22px] sm:text-[26px] md:text-[28px] lg:text-[32px] font-bold mb-5 text-black text-center font-[Playfair_Display]">
        Privacy Policy
      </h3>

      {loading && <p>Loading...</p>}
      {!loading && error && <p>No privacy policy available</p>}
      {!loading && !error && !data?.body && <p>No privacy policy available</p>}

      {!loading && !error && data && data.body && (
        <div className="mt-[10px]">
          {data.body?.split("\n").map((para, index) => {
            const text = para.trim();
            const isHeading = /^\d+\.\s/.test(text);
            if (!text) return null;
            return (
              <p
                key={index}
                className={
                  isHeading
                    ? "text-[15px] sm:text-[17px] md:text-[18px] lg:text-[20px] font-semibold mt-6"
                    : "text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] leading-[1.7] sm:leading-[1.8] mb-4 font-[Outfit]"
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

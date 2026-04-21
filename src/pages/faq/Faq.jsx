import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserFaqAction } from "../../redux/UserActions";

const wrapperCls = "px-4 sm:px-[50px] md:px-[80px] lg:px-[140px] xl:px-[170px] pt-[90px] sm:pt-[100px] md:pt-[120px] lg:pt-[140px]  font-[Outfit]";
const h1Cls      = "text-[22px] sm:text-[24px] md:text-[26px] lg:text-[28px] xl:text-[32px] font-bold mb-5 text-black text-center font-[Playfair_Display]";
const h3Cls      = "text-[15px] sm:text-[16px] md:text-[17px] lg:text-[18px] xl:text-[20px] font-semibold mt-6";
const pCls       = "text-[13px] sm:text-[14px] md:text-[14px] lg:text-[15px] xl:text-[16px] leading-[1.7] sm:leading-[1.8] mb-4 font-[Outfit]";

export default function FAQ() {
  const dispatch = useDispatch();
  const { list: faqList, loading, error } = useSelector((state) => state.userFaq);

  useEffect(() => { dispatch(getUserFaqAction()); }, [dispatch]);

  if (loading) {
    return (
      <div className={wrapperCls}>
        <h1 className={h1Cls}>Frequently Asked Questions</h1>
        <p className={pCls}>Loading FAQs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={wrapperCls}>
        <h1 className={h1Cls}>Frequently Asked Questions</h1>
        <p className={pCls}>Failed to load FAQs</p>
      </div>
    );
  }

  if (!faqList || faqList.length === 0) {
    return (
      <div className={wrapperCls}>
        <h1 className={h1Cls}>Frequently Asked Questions</h1>
        <p className={pCls}>No FAQs available</p>
      </div>
    );
  }

  return (
    <div className={wrapperCls}>
      <h1 className={h1Cls}>Frequently Asked Questions</h1>

      {faqList.map((faq, index) => (
        <div key={faq.id || index}>
          <h3 className={h3Cls}>{index + 1}. {faq.question}</h3>
          <p className={pCls}>{faq.answer}</p>
        </div>
      ))}
    </div>
  );
}

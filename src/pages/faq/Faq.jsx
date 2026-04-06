import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserFaqAction } from "../../redux/UserActions";
import "./Faq.css";

export default function FAQ() {
  const dispatch = useDispatch();
  const { list: faqList, loading, error } = useSelector((state) => state.userFaq);

  useEffect(() => {
    dispatch(getUserFaqAction());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="faq-page-wrapper">
        <h1>Frequently Asked Questions</h1>
        <p>Loading FAQs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="faq-page-wrapper">
        <h1>Frequently Asked Questions</h1>
        <p>Failed to load FAQs</p>
      </div>
    );
  }

  if (!faqList || faqList.length === 0) {
    return (
      <div className="faq-page-wrapper">
        <h1>Frequently Asked Questions</h1>
        <p>No FAQs available</p>
      </div>
    );
  }

  return (
    <div className="faq-page-wrapper">
      <h1>Frequently Asked Questions</h1>

      {faqList.map((faq, index) => (
        <div key={faq.id || index}>
          <h3>{index + 1}. {faq.question}</h3>
          <p>{faq.answer}</p>
        </div>
      ))}
    </div>
  );
}

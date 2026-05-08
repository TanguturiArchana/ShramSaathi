import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./Faq.css";

const Faq = () => {
  const { t } = useTranslation("faq");
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = t("faqs", { returnObjects: true }) || [];

  return (
    <section className="faq-section">
      <div className="faq-header">
        <h2>{t("title")}</h2>
        <p>{t("subtitle")}</p>
      </div>

      <div className="faq-list">
        {faqs.map((item, i) => {
          const isOpen = openIndex === i;

          return (
            <article key={i} className={`faq-item ${isOpen ? "open" : ""}`}>
              <button
                className="faq-question"
                onClick={() => setOpenIndex(isOpen ? -1 : i)}
                type="button"
              >
                <span>{item.question}</span>
                <span className="faq-icon">{isOpen ? "−" : "+"}</span>
              </button>

              {isOpen && (
                <p className="faq-answer">{item.answer}</p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default Faq;
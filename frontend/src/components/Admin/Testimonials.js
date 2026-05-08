import React from "react";
import "./Testimonials.css";
import { useTranslation } from "react-i18next";

const Testimonials = () => {
  const { t } = useTranslation("testimonal");

  const testimonials = t("testimonials.list", { returnObjects: true });

  return (
    <section className="testimonials-section">
      <h2>{t("testimonials.title")}</h2>

      <div className="testimonials-container">
        {testimonials.map((item) => (
          <div key={item.id} className="testimonial-card">
            <p className="testimonial-text">“{item.text}”</p>
            <p className="testimonial-name">— {item.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;

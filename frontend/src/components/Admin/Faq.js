// import React from "react";
// import "./Faq.css";

// const Faq = () => {
//   const questions = [
//     "How do I register as a worker?",
//     "How do employers post jobs?",
//     "Is there a service fee?",
//     "How can I contact support?",
//   ];

//   return (
//     <section className="faq-section">
//       <h2>FAQs</h2>
//       <ul>
//         {questions.map((q, i) => (
//           <li key={i}> {q}</li>
//         ))}
//       </ul>
//     </section>
//   );
// };

// export default Faq;
import React from "react";
import "./Faq.css";
import { useTranslation } from "react-i18next";

const Faq = () => {
  const { t } = useTranslation("faq");

  const questions = t("faq.questions", { returnObjects: true });

  return (
    <section className="faq-section">
      <h2>{t("faq.title")}</h2>
      <ul>
        {questions.map((q, i) => (
          <li key={i}>{q}</li>
        ))}
      </ul>
    </section>
  );
};

export default Faq;

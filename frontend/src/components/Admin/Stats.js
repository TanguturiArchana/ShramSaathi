// import React from "react";
// import "./Stats.css";

// const Stats = () => {
//   const data = [
//     { label: "Total no. of owners registered", value: "20" },
//     { label: "Total no. of workers registered", value: "140" },
//     { label: "Total jobs posted", value: "60" },
//     { label: "Total Active Jobs", value: "45" },
//   ];

//   return (
//     <section className="stats-section">
//       {data.map((item, i) => (
//         <div key={i} className="stat-card">
//           <p className="stat-label">{item.label}</p>
//           <p className="stat-value">{item.value}</p>
//         </div>
//       ))}
//     </section>
//   );
// };

// export default Stats;
import React from "react";
import "./Stats.css";
import { useTranslation } from "react-i18next";

const Stats = () => {
  const { t } = useTranslation("stats"); // or "stats" namespace if separate

  const data = [
    { label: t("stats.owners_registered"), value: "20" },
    { label: t("stats.workers_registered"), value: "140" },
    { label: t("stats.jobs_posted"), value: "60" },
    { label: t("stats.active_jobs"), value: "45" },
  ];

  return (
    <section className="stats-section">
      {data.map((item, i) => (
        <div key={i} className="stat-card">
          <p className="stat-label">{item.label}</p>
          <p className="stat-value">{item.value}</p>
        </div>
      ))}
    </section>
  );
};

export default Stats;

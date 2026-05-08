import React, { useEffect, useState } from "react";
import "./Stats.css";
import axios from "axios";
import { useTranslation } from "react-i18next";

const Stats = () => {
  const { t } = useTranslation("stats");

  const [data, setData] = useState([]);
  const [displayedValues, setDisplayedValues] = useState({});

  useEffect(() => {
    axios.get("http://localhost:8083/api/stats")
      .then(res => {
        const statsData = [
          { 
            label: t("labels.owners"), 
            value: res.data.totalOwners,
            icon: "👔",
            bgGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          },
          { 
            label: t("labels.workers"), 
            value: res.data.totalWorkers,
            icon: "🛠️",
            bgGradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
          },
          { 
            label: t("labels.jobs"), 
            value: res.data.totalJobs,
            icon: "📋",
            bgGradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
          },
          { 
            label: t("labels.active"), 
            value: res.data.activeJobs,
            icon: "⚡",
            bgGradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
          }
        ];

        setData(statsData);

        statsData.forEach((stat, idx) => {
          animateCounter(idx, stat.value);
        });
      })
      .catch(err => console.error(err));
  }, [t]);

  const animateCounter = (index, finalValue) => {
    let currentValue = 0;
    const increment = Math.ceil(finalValue / 50);

    const interval = setInterval(() => {
      currentValue += increment;

      if (currentValue >= finalValue) {
        currentValue = finalValue;
        clearInterval(interval);
      }

      setDisplayedValues(prev => ({
        ...prev,
        [index]: currentValue
      }));
    }, 30);
  };

  return (
    <section className="stats-section">
      <div className="stats-header">
        <h2 className="stats-title">{t("title")}</h2>
        <p className="stats-subtitle">{t("subtitle")}</p>
      </div>
      
      <div className="stats-grid">
        {data.map((item, i) => (
          <div key={i} className="stat-card" style={{ backgroundImage: item.bgGradient }}>
            <div className="stat-icon">{item.icon}</div>
            <div className="stat-content">
              <p className="stat-label">{item.label}</p>
              <p className="stat-value">
                {displayedValues[i] !== undefined
                  ? displayedValues[i].toLocaleString()
                  : 0}
              </p>
            </div>
            <div className="stat-accent"></div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;
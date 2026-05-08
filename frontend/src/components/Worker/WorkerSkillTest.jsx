import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import API from "../../services/api";
import "./WorkerSkillTest.css";

const WorkerSkillTest = ({ workerId }) => {
  const { t } = useTranslation("skillTest");

  const [skill, setSkill] = useState("carpentry");
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const questions = t(`questions.${skill}`, { returnObjects: true }) || [];

  const submit = async () => {
    setLoading(true);
    try {
      const res = await API.post(`/skill-tests/submit`, {
        workerId: Number(workerId),
        skill,
        answers,
      });
      setResult(res.data);
    } catch {
      alert("Error submitting test");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="skill-test-wrap">
  <div className="skill-test-card">

    <div className="skill-test-head">
      <h3>{t("title")}</h3>
      <p>{t("subtitle")}</p>
    </div>

    <div className="skill-controls">
      <label>{t("skill_track")}</label>
      <select value={skill} onChange={(e) => setSkill(e.target.value)}>
        <option value="carpentry">{t("carpentry")}</option>
        <option value="building">{t("building")}</option>
        <option value="general">{t("general")}</option>
      </select>
    </div>

    {loading ? (
      <p className="skill-loading">{t("loading")}</p>
    ) : (
      <div className="skill-questions">
        {questions.map((q, i) => (
          <div key={q.id} className="skill-question">
            <p className="skill-q-title">{i + 1}. {q.question}</p>

            <div className="skill-options">
              {q.options.map((opt, idx) => (
                <label key={idx} className="skill-option">
                  <input
                    type="radio"
                    checked={answers[q.id] === idx}
                    onChange={() =>
                      setAnswers({ ...answers, [q.id]: idx })
                    }
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    )}

    <div className="skill-actions">
      <button className="skill-submit" onClick={submit}>
        {loading ? t("submitting") : t("submit")}
      </button>
    </div>

    {result && (
      <p className="skill-result">
        {t("score")} <strong>{result.score}%</strong> | {t("level")} <strong>{result.level}</strong>
      </p>
    )}

    <div className="skill-profiles">
      <h4>{t("my_skills")}</h4>
      {profiles.length === 0 ? (
        <p>{t("no_profiles")}</p>
      ) : (
        profiles.map((p) => (
          <div key={p.skill} className="skill-profile-item">
            <strong>{p.skill}</strong>
            <span>{p.level}</span>
            <span>{p.score}%</span>
          </div>
        ))
      )}
    </div>

  </div>
</div>
  )
};

export default WorkerSkillTest;

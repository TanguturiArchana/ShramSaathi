import React, { useState, useEffect } from "react";
import "./Opening.css";
import Popup from "./Popup";
import { useTranslation } from "react-i18next";

const skillImageMap = {
  carpentry:
    "https://images.pexels.com/photos/159306/construction-site-build-construction-work-159306.jpeg",
  electrician:
    "https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg",
  plumbing:
    "https://images.pexels.com/photos/5691642/pexels-photo-5691642.jpeg",
  building:
    "https://images.pexels.com/photos/834892/pexels-photo-834892.jpeg",
  default:
    "https://images.pexels.com/photos/162539/architecture-building-amsterdam-blue-sky-162539.jpeg"
};

const Opening = () => {
  const { t } = useTranslation("opening");

  const [jobs, setJobs] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [expandedComments, setExpandedComments] = useState({});

  useEffect(() => {
    fetch("http://localhost:8083/api/jobs/recent")
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error(err));
  }, []);

  const toggleLike = (jobId) => {
    setLikes(prev => ({
      ...prev,
      [jobId]: !prev[jobId]
    }));
  };

  const addComment = (jobId) => {
    if (!newComment[jobId]?.trim()) return;

    setComments(prev => ({
      ...prev,
      [jobId]: [
        ...(prev[jobId] || []),
        {
          id: Date.now(),
          text: newComment[jobId],
          timestamp: new Date().toLocaleTimeString()
        }
      ]
    }));

    setNewComment(prev => ({
      ...prev,
      [jobId]: ""
    }));
  };

  const deleteComment = (jobId, commentId) => {
    setComments(prev => ({
      ...prev,
      [jobId]: prev[jobId].filter(c => c.id !== commentId)
    }));
  };

  const shareJob = (job) => {
    const text = t("share_text", {
      title: job.title,
      pay: job.pay
    });

    if (navigator.share) {
      navigator.share({ title: job.title, text });
    } else {
      alert(text);
    }
  };

  return (
    <section className="opening-section">
      <div className="opening-header">
        <h2 className="opening-title">{t("title")}</h2>
        <p className="opening-subtitle">{t("subtitle")}</p>
      </div>

      <div className="opening-grid">
        {jobs.map((job) => (
          <div key={job.id} className="modern-job-card">
            <div className="job-cover">
              <img
                src={
                  skillImageMap[(job.skillNeeded || "").toLowerCase()] ||
                  skillImageMap.default
                }
                alt={job.title}
              />
              <span className="job-type">{t("live_hiring")}</span>
            </div>

            <div className="job-card-header">
              <div className="job-title-section">
                <h3 className="job-title">{job.title}</h3>
                <span className="job-skill-chip">
                  {job.skillNeeded || t("general_work")}
                </span>
              </div>
            </div>

            <div className="job-details-section">
              <div className="detail-item">
                <span>📍</span>
                <span>{job.location}</span>
              </div>
              <div className="detail-item">
                <span>💰</span>
                <span>
                  {t("currency")} {job.pay} / {t("per_month")}
                </span>
              </div>
            </div>

            <div className="engagement-bar">
              <button
                className={`engagement-btn like-btn ${likes[job.id] ? "active" : ""}`}
                onClick={() => toggleLike(job.id)}
              >
                {likes[job.id] ? "❤️" : "🤍"} {t("interest")}
              </button>

              <button
                className="engagement-btn comment-btn"
                onClick={() =>
                  setExpandedComments(prev => ({
                    ...prev,
                    [job.id]: !prev[job.id]
                  }))
                }
              >
                💬 {comments[job.id]?.length || 0}
              </button>

              <button
                className="engagement-btn share-btn"
                onClick={() => shareJob(job)}
              >
                🔗 {t("share")}
              </button>
            </div>

            {expandedComments[job.id] && (
              <div className="comments-section-card">
                <div className="comments-list-card">
                  {comments[job.id]?.length ? (
                    comments[job.id].map((comment) => (
                      <div key={comment.id}>
                        <span>{comment.timestamp}</span>
                        <button onClick={() => deleteComment(job.id, comment.id)}>✕</button>
                        <p>{comment.text}</p>
                      </div>
                    ))
                  ) : (
                    <p>{t("no_comments")}</p>
                  )}
                </div>

                <div className="comment-input-card">
                  <input
                    type="text"
                    placeholder={t("add_comment")}
                    value={newComment[job.id] || ""}
                    onChange={(e) =>
                      setNewComment(prev => ({
                        ...prev,
                        [job.id]: e.target.value
                      }))
                    }
                    onKeyPress={(e) => {
                      if (e.key === "Enter") addComment(job.id);
                    }}
                  />
                  <button onClick={() => addComment(job.id)}>
                    {t("send")}
                  </button>
                </div>
              </div>
            )}

            <button
              className="apply-btn-modern"
              onClick={() => setShowPopup(true)}
            >
              {t("apply")}
            </button>
          </div>
        ))}
      </div>

      {showPopup && <Popup onClose={() => setShowPopup(false)} />}
    </section>
  );
};

export default Opening;
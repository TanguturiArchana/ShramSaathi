import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { connect as wsConnect, disconnect as wsDisconnect, send as wsSend, subscribe as wsSubscribe } from "../../services/socketService";
import ChatModal from "./ChatModal";
import RouteMap from "./RouteMap";
import "./WorkerDashboard.css";
import WorkerNotifications from "./WorkerNotification";
import WorkerSkillTest from "./WorkerSkillTest";


const API_BASE = "http://localhost:8083/api";

const WorkerDashboard = () => {
  const { t } = useTranslation("workerDashboard");
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const state =
    location.state || JSON.parse(localStorage.getItem("workerState"));

  const workerId = state?.id;

  useEffect(() => {
    if (location.state) {
      localStorage.setItem("workerState", JSON.stringify(location.state));
      
    }
  }, [location.state]);

  useEffect(() => {
    if (!state) navigate("/");
  }, [state, navigate]);

const [jobLikes, setJobLikes] = useState({});
const [jobLikeCounts, setJobLikeCounts] = useState({});
const [jobComments, setJobComments] = useState({});
const [newJobComment, setNewJobComment] = useState({});
const [expandedJobComments, setExpandedJobComments] = useState({});
  
    
  const [jobs, setJobs] = useState([]);
  const [activeTab, setActiveTab] = useState("jobs");
  const [message, setMessage] = useState("");
  const [chatApplication, setChatApplication] = useState(null);
   const [routeTarget, setRouteTarget] = useState(null); // [lat, lng]
  const [showRoute, setShowRoute] = useState(false);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeLoadingJobId, setRouteLoadingJobId] = useState(null);
  const [routeOrigin, setRouteOrigin] = useState(null);
  const [routeOriginInfo, setRouteOriginInfo] = useState(null);
  const [routeDestInfo, setRouteDestInfo] = useState(null);
  const [routeKey, setRouteKey] = useState(null);
  const [isSharing, setIsSharing] = useState(false);
  const [watchId, setWatchId] = useState(null);
   const [workerProfile, setWorkerProfile] = useState({
      name: "",
      skill: "",
      workType: "",
      location: "",
      contact: "",
      area: "",
      colony: "",
    state: "",
    pincode: "",
    age: "",
    experienceYears: "",
  });
  useEffect(() => {
  if (!workerId) return;
  axios
    .get(`${API_BASE}/users/${workerId}`)
    .then((res) => {
      const profile = res.data || {};
      setWorkerProfile({
        name: profile.name || "",
        skill: profile.skill || profile.workType || "",
        workType: profile.workType || profile.skill || "",
        location: profile.address || profile.location || "",
        contact: profile.phone || profile.contact || "",
        area: profile.area || "",
        colony: profile.colony || "",
        state: profile.state || "",
        pincode: profile.pincode || "",
        age: profile.age || "",
        experienceYears: profile.experienceYears || profile.experience || "",
      });
    })
    .catch((err) => {
      console.error("Failed to load worker profile:", err);
    });
}, [workerId]);


  const { data: jobsData = [], isLoading: jobsLoading } = useQuery({
    queryKey: ["worker-jobs", workerId],
    queryFn: async () => {
      const [jobsRes, applicationsRes] = await Promise.all([
        axios.get(`${API_BASE}/jobs/${workerId}`),
        axios.get(`${API_BASE}/applications/worker/${workerId}`)
      ]);

      const appliedIds = new Set(
        applicationsRes.data.map((app) => app.jobId)
      );

      return jobsRes.data.map((job) => ({
        ...job,
        alreadyApplied: appliedIds.has(job.id),
        applicationStatus:
          applicationsRes.data.find((app) => app.jobId === job.id)?.status ||
          null
      }));
    },
    enabled: !!workerId,
    staleTime: 1000 * 60 * 10
  });


  useEffect(() => {
  setJobs(jobsData);
}, [jobsData]);

  const geocodeLocation = async ({ area, colony, state, pincode, text }) => {
    const base = "https://nominatim.openstreetmap.org/search";
    const cleanP = pincode ? String(pincode).trim() : "";

    const queries = [];

    if (area || colony || cleanP || state) {
      let parts = [];
      if (area) parts.push(area);
      if (colony) parts.push(colony);
      if (cleanP) parts.push(cleanP);
      if (state) parts.push(state);
      parts.push("India");
      queries.push(parts.filter(Boolean).join(", "));
    }
   
    if (cleanP) queries.push(`${cleanP}, India`);
    
    if (text) queries.push(`${text} India`);
  
    if (cleanP) queries.push(cleanP);

    try {
      for (const q of queries) {
        const params = { format: "json", limit: 1, addressdetails: 1, q, countrycodes: "in" };
        const res = await axios.get(base, { params });
        if (res.data && res.data.length > 0) {
          const r = res.data[0];
          const lat = parseFloat(r.lat);
          const lon = parseFloat(r.lon);
          
          if (lat >= 6 && lat <= 38 && lon >= 68 && lon <= 98) {
            return [lat, lon];
          }
          
          if (r.address && r.address.country_code && r.address.country_code.toLowerCase() === "in") {
            return [lat, lon];
          }
         
        }
      }
      return null;
    } catch (err) {
      console.error("Geocode error", err);
      return null;
    }
  };
  const applyEngagementSnapshot = (snapshot) => {
  if (!snapshot || !snapshot.jobId) return;

  setJobLikes((prev) => ({
    ...prev,
    [snapshot.jobId]: !!snapshot.likedByCurrentWorker
  }));

  setJobLikeCounts((prev) => ({
    ...prev,
    [snapshot.jobId]: snapshot.likeCount || 0
  }));

  setJobComments((prev) => ({
    ...prev,
    [snapshot.jobId]: snapshot.comments || []
  }));
};

const fetchEngagement = async (jobIds) => {
  try {
    const responses = await Promise.all(
      jobIds.map((id) =>
        axios.get(`${API_BASE}/engagement/jobs/${id}`, { params: { workerId } })
      )
    );
    responses.forEach((res) => applyEngagementSnapshot(res.data));
  } catch (err) {
    console.error(err);
  }
};

const toggleJobLike = (jobId) => {
  axios.post(`${API_BASE}/engagement/jobs/${jobId}/likes`, { workerId })
    .then(res => applyEngagementSnapshot(res.data))
    .catch(err => console.error(err));
};

const addJobComment = (jobId) => {
  if (!newJobComment[jobId]?.trim()) return;

  axios.post(`${API_BASE}/engagement/jobs/${jobId}/comments`, {
  workerId,
  comment: newJobComment[jobId]
})
    .then(res => applyEngagementSnapshot(res.data))
    .catch(err => console.error(err));

  setNewJobComment(prev => ({ ...prev, [jobId]: "" }));
};

const deleteJobComment = (jobId, commentId) => {
  axios.delete(`${API_BASE}/engagement/comments/${commentId}`, {
  params: { workerId }
})
    .then(res => applyEngagementSnapshot(res.data))
    .catch(err => console.error(err));
};

useEffect(() => {
  if (!jobsData.length) return;

  const subs = jobsData.map(job =>
    wsSubscribe(`/topic/engagement/job/${job.id}`, (snap) => {
      applyEngagementSnapshot(snap);
    })
  );

  return () => subs.forEach(s => s?.unsubscribe());
}, [jobsData]);
 

  const { data: applications = [], isLoading: appsLoading } = useQuery({
    queryKey: ["worker-applications", workerId],
    queryFn: async () => {
      const [applicationsRes, jobsRes] = await Promise.all([
        axios.get(`${API_BASE}/applications/worker/${workerId}`),
        axios.get(`${API_BASE}/jobs/${workerId}`)
      ]);

      const jobsById = {};
      jobsRes.data.forEach((job) => (jobsById[job.id] = job));

      return applicationsRes.data.map((app) => {
        const relatedJob = jobsById[app.jobId] || {};
        return {
          ...app,
          jobTitle: relatedJob.title || `Job #${app.jobId}`,
          location: relatedJob.location || "Unknown",
          pay: relatedJob.pay || "",
          ownerId: relatedJob.ownerId
        };
      });
    },
    enabled: !!workerId && activeTab === "applications",
    staleTime: 1000 * 60 * 10,
    onSuccess: (data) => {
  fetchEngagement(data.map(j => j.id));
}
  });

   useEffect(() => {
    if (!workerId) return;
    
    try { wsConnect(); } catch (e) {}
    
  }, [workerId]);
  

  const applyMutation = useMutation({
    mutationFn: (job) =>
      axios.post(`${API_BASE}/applications`, {
        jobId: job.id,
        workerId,
        status: "pending"
      }),
    onSuccess: () => {
      setMessage(t("messages.apply_success"));

      queryClient.invalidateQueries(["worker-jobs", workerId]);
      queryClient.invalidateQueries(["worker-applications", workerId]);

      setTimeout(() => setMessage(""), 3000);
    },
    onError: (error) => {
      if (error.response?.status === 409)
        setMessage(t("messages.already_applied"));
      else setMessage(t("messages.apply_failed"));

      setTimeout(() => setMessage(""), 3000);
    }
  });

   useEffect(() => {
    const sub = wsSubscribe(`/topic/location/${workerId}`, (msg) => {
      try {
        const body = msg; 
        if (body && body.lat && body.lon) {
          setRouteOrigin([body.lat, body.lon]);
          
          setRouteKey(Date.now());
        }
      } catch (e) {}
    });
    return () => { if (sub) sub.unsubscribe(); };
  }, [workerId]);
 

  return (
    <div className="worker-dashboard">
      <header className="worker-header">
        <h1>{t("header.title")}</h1>
        <p>{t("header.subtitle")}</p>
      </header>

      
      {message && <div className="alert-msg">{message}</div>}

      
      <div className="tabs">
        <button
          className={activeTab === "jobs" ? "tab active" : "tab"}
          onClick={() => setActiveTab("jobs")}
        >
          🔍 {t("tabs.available_jobs")} 
 
        </button>
        <button
          className={activeTab === "applications" ? "tab active" : "tab"}
          onClick={() => setActiveTab("applications")}
        >
          📄 {t("tabs.my_applications")}
        </button>
        <button
          className={activeTab === "skills" ? "tab active" : "tab"}
          onClick={() => setActiveTab("skills")}
        >
          🧠 {t("skill test")}
        </button>
        <button
          className={activeTab === "notifications" ? "tab active" : "tab"}
          onClick={() => setActiveTab("notifications")}
        >
          🔔{t("notifications")} 
        </button>
      <button
      className={activeTab === "profile" ? "tab active" : "tab"}
      onClick={() => navigate("/WorkerProfile", { state: { id: workerId } })}>
      👤 {t("tabs.my_profile")}
      </button>

      </div>

      
      {activeTab === "jobs" && (
        <div className="jobs-container">
          {!workerProfile.workType && !workerProfile.skill && (
            <div className="alert-msg" style={{ marginBottom: "1rem" }}>
              {t("complete")}
              <button
                style={{ marginLeft: 10 }}
                className="send-comment-btn"
                onClick={() => setActiveTab("skills")}
              >
                {t("take")}
              </button>
            </div>
          )}
          {jobs.length === 0 ? (
            <p className="empty-msg">{t("jobs.no_jobs")}</p>
          ) : (
            <div className="jobs-grid">
              {jobs.map((job) => (
                <div key={job.id} className="job-card">
                  <div className="job-card-header">
                    <div className="job-title-section">
                      <h3 className="job-title">{job.title}</h3>
                      <p className="job-skill">
                        <span className="skill-badge">🛠️ {job.skillNeeded}</span>
                      </p>
                    </div>
                    <span className={`job-status ${job.alreadyApplied ? t("jobs.already_applied") : t("jobs.available")}}`}>
                      {job.alreadyApplied ? ` ${job.applicationStatus || t("jobs.already_applied")}` : t("jobs.available")}
                      
                    </span>
                  </div>

                  
                  <div className="job-card-details">
                    <div className="detail-item">
                      <span className="detail-icon">📍</span>
                      <div className="detail-content">
                        <strong>{t("jobs.table.location")}</strong>
                        <p>{job.location}</p>
                        {job.area && <small>Area: {job.area}</small>}
                        {job.colony && <small> • Colony: {job.colony}</small>}
                      </div>
                    </div>
                    
                    <div className="detail-row">
                      <div className="detail-item-inline">
                        <span className="detail-icon">💰</span>
                        <strong>₹{job.pay}</strong>
                      </div>
                      <div className="detail-item-inline">
                        <span className="detail-icon">⏱️</span>
                        <strong>{job.duration} {t("days")}</strong>
                      </div>
                    </div>
                  </div>

                  
                  <div className="job-engagement">
                    <button 
                      className={`like-btn ${jobLikes[job.id] ? 'liked' : ''}`}
                      onClick={() => toggleJobLike(job.id)}
                      title="Like this job"
                    >
                      {jobLikes[job.id] ? '❤️' : '🤍'} {jobLikeCounts[job.id] || 0}
                    </button>
                    
                    <button 
                      className="comments-toggle-btn"
                      onClick={() => setExpandedJobComments(prev => ({...prev, [job.id]: !prev[job.id]}))}
                      title="View comments"
                    >
                      💬 {jobComments[job.id]?.length || 0} {t("comments")}
                    </button>
                  </div>

                 
                  {expandedJobComments[job.id] && (
                    <div className="comments-section">
                      <div className="comments-list">
                        {jobComments[job.id]?.length ? (
                          jobComments[job.id].map(comment => (
                            <div key={comment.id} className="comment-item">
                              <div className="comment-header">
                                <span className="comment-time">
                                  {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : ""}
                                </span>
                                <button 
                                  className="delete-comment-btn"
                                  onClick={() => deleteJobComment(job.id, comment.id)}
                                  title="Delete comment"
                                >
                                  ✕
                                </button>
                              </div>
                              <p className="comment-text">{comment.comment}</p>
                            </div>
                          ))
                        ) : (
                          <p className="no-comments">{t("no comments")}</p>
                        )}
                      </div>
                      <div className="comment-input-wrapper">
                        <input
                          type="text"
                          placeholder="Share your thoughts about this job..."
                          className="comment-input"
                          value={newJobComment[job.id] || ''}
                          onChange={(e) => setNewJobComment(prev => ({...prev, [job.id]: e.target.value}))}
                         onKeyDown={(e) => {if (e.key === 'Enter') addJobComment(job.id);}}
                        />
                        <button 
                          className="send-comment-btn"
                          onClick={() => addJobComment(job.id)}
                          disabled={!newJobComment[job.id]?.trim()}
                        >
                          {t("send")}
                        </button>
                      </div>
                    </div>
                  )}

                  
                  <div className="job-card-actions">
                    {job.alreadyApplied ? (
                      <button className="applied-btn" disabled>
                        {t("jobs.already_applied")}
                        
                      </button>
                    ) : (
                      <button
                        className="apply-btn"
                        onClick={() => applyMutation.mutate(job)}

                      >
                        {t("jobs.apply") }
                      </button>
                    )}
                    
                    <button
                      className="route-btn"
                      onClick={async () => {
                        const ownerPcode = job.pincode || job.postalCode || job.zip || job.postalcode;
                        let destCoords = null;
                        try {
                          setRouteLoading(true);
                          if (ownerPcode) destCoords = await geocodeLocation({ area: job.area, colony: job.colony, state: job.state, pincode: ownerPcode, text: job.location });
                          else {
                            const entered = window.prompt("Enter owner pincode / postal code (e.g. 500081)");
                            if (entered) destCoords = await geocodeLocation({ pincode: entered, text: entered });
                          }

                          if (!destCoords) {
                            const fallbackDest = [job.location, job.area, job.colony, job.state, ownerPcode]
                              .filter(Boolean)
                              .join(", ");
                            const fallbackOrigin = [workerProfile.location, workerProfile.area, workerProfile.colony, workerProfile.state, workerProfile.pincode]
                              .filter(Boolean)
                              .join(", ");
                            const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
                              fallbackOrigin || "Current Location"
                            )}&destination=${encodeURIComponent(fallbackDest || "Owner Location")}`;
                            window.open(mapsUrl, "_blank", "noopener,noreferrer");
                            return;
                          }

                          const workerPcode = workerProfile.pincode || window.prompt("Enter your pincode (worker)");
                          if (!workerPcode) {
                            alert("Worker pincode required to show route.");
                            return;
                          }

                          const originCoords = await geocodeLocation({ area: workerProfile.area, colony: workerProfile.colony, state: workerProfile.state, pincode: workerPcode, text: workerProfile.location });
                          if (!originCoords) {
                            alert("Could not resolve your pincode to coordinates.");
                            return;
                          }

                          setRouteOrigin(originCoords);
                          setRouteTarget(destCoords);
                          setRouteKey(Date.now());
                          setRouteOriginInfo({
                            area: workerProfile.area || "",
                            colony: workerProfile.colony || "",
                            state: workerProfile.state || "",
                            pincode: workerPcode,
                          });
                          setRouteDestInfo({
                            area: job.area || "",
                            colony: job.colony || "",
                            state: job.state || "",
                            pincode: ownerPcode,
                          });
                          setShowRoute(true);
                        } finally {
                          setRouteLoading(false);
                        }
                      }}
                    >
                      {routeLoading ? t("jobs.loading_route") : t("route")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "applications" && (
        <div className="applications-container">
          {applications.length === 0 ? (
            <p className="empty-msg">{t("applications.no_applications")}</p>
          ) : (
            <table className="applications-table">
              <thead>
                <tr>
                  <th>{t("applications.table.job_title")}</th>
                  <th>{t("applications.table.location")}</th>
                  <th>{t("applications.table.pay")}</th>
                  <th>{t("applications.table.status")}</th>
                  <th>{t("applications.table.applied_on")}</th> 
                  <th>{t("applications.table.action")}</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td>{app.jobTitle || `Job #${app.jobId}`}</td>
                    <td>{app.location}</td>
                    <td>{app.pay}</td>
                    <td>
                      <span
                        className={`status ${
                          app.status.toLowerCase() === "accepted"
                            ? "accepted"
                            : app.status.toLowerCase() === "rejected"
                            ? "rejected"
                            : "pending"
                        }`}
                      >
                         {t(`status.${app.status.toLowerCase()}`)}
                      </span>
                    </td>
                    <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                    <td>
                      {app.status && app.status.toLowerCase() === "accepted" && (
                        <div className="action-buttons">
                          <button
                            className="chat-btn"
                            onClick={() => {
                              console.log("Opening chat for application:", app); // For debugging
                              if (!app.ownerId) {
                                setMessage("⚠️ Unable to start chat - This job's owner information is not available");
                                setTimeout(() => setMessage(""), 3000);
                                return;
                              }
                              setChatApplication(app);
                            }}
                            title={app.ownerId ? "Click to chat with job owner" : "Owner information not available"}
                          >
                            {app.ownerId ? t("applications.chat_owner") : t("applications.chat_unavailable")}
                          </button>
                          <button
                            className="route-btn"
                            style={{ marginLeft: 8 }}
                              onClick={async () => {
                                const pcode = app.ownerPincode || app.ownerPostalCode || app.ownerZip || app.pincode || app.postalCode;
                                let destCoords = null;
                                try {
                                  setRouteLoading(true);
                                  if (pcode) destCoords = await geocodeLocation({ area: app.ownerArea || app.area, colony: app.ownerColony || app.colony, state: app.ownerState || app.state, pincode: pcode, text: app.location || app.jobTitle });
                                  else {
                                    const entered = window.prompt("Enter owner pincode / postal code (e.g. 500081)");
                                    if (entered) destCoords = await geocodeLocation({ pincode: entered, text: entered });
                                  }

                                  if (!destCoords) {
                                    const fallbackDest = [app.location, app.ownerArea, app.ownerColony, app.ownerState, pcode]
                                      .filter(Boolean)
                                      .join(", ");
                                    const fallbackOrigin = [workerProfile.location, workerProfile.area, workerProfile.colony, workerProfile.state, workerProfile.pincode]
                                      .filter(Boolean)
                                      .join(", ");
                                    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
                                      fallbackOrigin || "Current Location"
                                    )}&destination=${encodeURIComponent(fallbackDest || "Owner Location")}`;
                                    window.open(mapsUrl, "_blank", "noopener,noreferrer");
                                    return;
                                  }

                                  const workerPcode = workerProfile.pincode || window.prompt("Enter your pincode (worker)");
                                  if (!workerPcode) {
                                    alert("Worker pincode required to show route.");
                                    return;
                                  }

                                  const originCoords = await geocodeLocation({ area: workerProfile.area, colony: workerProfile.colony, state: workerProfile.state, pincode: workerPcode, text: workerProfile.location });
                                  if (!originCoords) {
                                    alert("Could not resolve your pincode to coordinates.");
                                    return;
                                  }

                                  setRouteOrigin(originCoords);
                                  setRouteTarget(destCoords);
                                 
                                  setRouteKey(Date.now());
                                  setRouteOriginInfo({
                                    area: workerProfile.area || "",
                                    colony: workerProfile.colony || "",
                                    state: workerProfile.state || "",
                                    pincode: workerPcode,
                                  });
                                  setRouteDestInfo({
                                    area: app.ownerArea || app.area || "",
                                    colony: app.ownerColony || app.colony || "",
                                    state: app.ownerState || app.state || "",
                                    pincode: pcode,
                                  });
                                  setShowRoute(true);
                                } finally {
                                  setRouteLoading(false);
                                }
                              }}
                          >
                            {t("applications.route_owner")}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === "skills" && (
        <WorkerSkillTest
          workerId={workerId}
          defaultSkill={workerProfile.workType || workerProfile.skill || "general"}
        />
      )}

      {activeTab === "notifications" && <WorkerNotifications workerId={workerId} />}

      {chatApplication && (
        <ChatModal
          applicationId={chatApplication.id}
          workerId={workerId}
          ownerId={chatApplication.ownerId}
          onClose={() => setChatApplication(null)}
        />
      )}

      {showRoute && routeTarget && (
        <div className="route-overlay">
          <div className="route-content">
            <RouteMap
              key={routeKey || `${(routeOrigin||[17.385,78.4867]).join(',')}_${(routeTarget||[0,0]).join(',')}`}
              origin={routeOrigin || [17.385, 78.4867]}
              destination={routeTarget}
              originInfo={routeOriginInfo}
              destinationInfo={routeDestInfo}
              onClose={() => setShowRoute(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerDashboard;

import axios from "axios";
import { useState, useMemo,useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import "./ApplicationsPanel.css";
import Chat from "./Chat";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";

const API_BASE = "http://localhost:8083/api";

const ApplicationsPanel = () => {
  const { t } = useTranslation("application");
  const state = useOutletContext();
  const queryClient = useQueryClient();

  const [selectedJobId, setSelectedJobId] = useState(null);
  const [openChatFor, setOpenChatFor] = useState(null);
  const [message, setMessage] = useState("");

  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [minExperience, setMinExperience] = useState("");
  const [maxExperience, setMaxExperience] = useState("");
  const [filterPincode, setFilterPincode] = useState("");

  const fetchJobs = async () => {
    const res = await axios.get(`${API_BASE}/jobs/owner/${state.id}`);
    const jobs = res.data;

    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        try {
          const appRes = await axios.get(
            `${API_BASE}/applications/job/${job.id}`
          );
          return { ...job, applicationCount: appRes.data.length };
        } catch {
          return { ...job, applicationCount: 0 };
        }
      })
    );

    return jobsWithCounts;
  };

  const { data: jobs = [] } = useQuery({
    queryKey: ["ownerJobsWithCounts", state?.id],
    queryFn: fetchJobs,
    enabled: !!state?.id,
  });
  useEffect(() => {
  if (jobs.length > 0 && !selectedJobId) {
    setSelectedJobId(jobs[0].id);
  }
}, [jobs, selectedJobId]);


  const fetchApplications = async () => {
    const res = await axios.get(
      `${API_BASE}/applications/job/${selectedJobId}`
    );
    const apps = res.data || [];

    const workerIds = [...new Set(apps.map((a) => a.workerId))];
    const workers = {};

    await Promise.all(
      workerIds.map(async (id) => {
        try {
          const u = await axios.get(`${API_BASE}/users/${id}`);
          workers[id] = u.data;
        } catch {
          workers[id] = null;
        }
      })
    );

    return apps.map((a) => ({
      ...a,
      workerProfile: workers[a.workerId] || null,
    }));
  };

  const { data: applications = [],isLoading} = useQuery({
    queryKey: ["applicationsByJob", selectedJobId],
    queryFn: fetchApplications,
    enabled: !!selectedJobId
  });


  const updateMutation = useMutation({
    mutationFn: ({ id, status }) =>
      axios.put(`${API_BASE}/applications/${id}/status?status=${status}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["applicationsByJob", selectedJobId]);
      queryClient.invalidateQueries(["ownerJobsWithCounts", state?.id]);
    }
  });

  const updateStatus = (id, status) => {
    updateMutation.mutate(
      { id, status },
      {
        onSuccess: () => {
          setMessage(status === "ACCEPTED" ? "✅ Accepted" : "❌ Rejected");
          setTimeout(() => setMessage(""), 2000);
        },
        onError: () => {
          setMessage("❌ Failed");
        }
      }
    );
  };

 
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      const p = app.workerProfile;
      console.log("Selected Job ID:", selectedJobId);
console.log("Applications from React Query:", applications);
      if (!p) return true;
      
      const ageOk =
        (!minAge || p.age >= Number(minAge)) &&
        (!maxAge || p.age <= Number(maxAge));

      const expOk =
  (!minExperience || p.experienceYears >= Number(minExperience)) &&
  (!maxExperience || p.experienceYears <= Number(maxExperience));

      const pinOk =
        !filterPincode || String(p.pincode) === filterPincode;

      return ageOk && expOk && pinOk;
    });
  }, [
    applications,
    minAge,
    maxAge,
    minExperience,
    maxExperience,
    filterPincode
  ]);

  return (
    <div className="applications-container">
      <h2 className="title">📩 {t("title")}</h2>
      <p className="subtitle">{t("subtitle")}</p>

      {message && <div className="message">{message}</div>}

      <div className="job-selector">
        <label>{t("select_job")}:</label>
        <select
          value={selectedJobId}
          onChange={(e) => setSelectedJobId(Number(e.target.value))}
        >
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title} ({job.applicationCount})
            </option>
          ))}
        </select>
      </div>

  
      <div className="filter-row">
        <label>{t("filters")}:</label>
        <input
          type="number"
          placeholder={t("min_age")}
          value={minAge}
          onChange={(e) => setMinAge(e.target.value)}
        />
        <input
          type="number"
          placeholder={t("max_age")}
          value={maxAge}
          onChange={(e) => setMaxAge(e.target.value)}
        />
        <input
          type="number"
          placeholder={t("min_exp")}
          value={minExperience}
          onChange={(e) => setMinExperience(e.target.value)}
        />
        <input
          type="number"
          placeholder={t("max_exp")}
          value={maxExperience}
          onChange={(e) => setMaxExperience(e.target.value)}
        />
        <input
          type="text"
          placeholder={t("pincode")}
          value={filterPincode}
          onChange={(e) => setFilterPincode(e.target.value)}
        />
      </div>

     
      {isLoading ? (
        <p>{t("loading")}</p>
      ) : filteredApps.length === 0 ? (
        <p className="empty-msg">{t("no_results")}</p>
      ) : (
        <table className="applications-table">
          <thead>
            <tr>
              <th>{t("table.worker_name")}</th>
              <th>{t("table.skill")}</th>
              <th>{t("table.applied_on")}</th>
              <th>{t("table.status")}</th>
              <th>{t("table.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {filteredApps.map((app) => (
              <tr key={app.id}>
                <td>{app.workerProfile?.name || "—"}</td>
                <td>{app.workerProfile?.workType || "—"}</td>
                <td>
                 {app.appliedAt? new Date(app.appliedAt).toLocaleDateString(): "—"}
                </td>
                <td>{app.status}</td>
                <td>
                  <button onClick={() => updateStatus(app.id, "ACCEPTED")}>
                    {t("accept")}
                  </button>
                  <button onClick={() => updateStatus(app.id, "REJECTED")}>
                    {t("reject")}
                  </button>
                  {app.status === "ACCEPTED" && (
                    <button onClick={() => setOpenChatFor(app)}>
                      {t("chat")}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

    
      {openChatFor && (
        <Chat
          applicationId={openChatFor.id}
          ownerId={state.id}
          workerId={openChatFor.workerId}
          onClose={() => setOpenChatFor(null)}
        />
      )}
    </div>
  );
};

export default ApplicationsPanel;

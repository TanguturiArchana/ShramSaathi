// import { useEffect, useState } from "react";
// import { jobService } from "../../services/jobService";
// import { workerService } from "../../services/workerService";
// import { useOutletContext } from "react-router-dom";

// import AddJobModal from "./AddJobModal";
// import "./JobManager.css";
// import OwnerHeader from "./OwnerHeader";
// import axios from "axios";
// const API_BASE = "http://localhost:8083/api";

// const JobManager = () => {
//   const [jobs, setJobs] = useState([]);
//   const [workers, setWorkers] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedView, setSelectedView] = useState('jobs');

//   const state = useOutletContext();
 
//   const fetchJobs = async () => {
//     console.log("jobManager",state.id);
//     const res = await axios.get(`${API_BASE}/jobs/owner/${state.id}`);
//     setJobs(res.data);
//   };

//   const fetchWorkers = async () => {
//     const data = await workerService.getAllWorkers();
//     setWorkers(data);
//   };

//   useEffect(() => {
//     fetchJobs();
//     fetchWorkers();
//   }, []);

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this job?")) {
//       await jobService.deleteJob(id);
//       fetchJobs();
//     }
//   };
//   return (
   
//     <div className="job-manager-container">
//       {/* Header */}
//       <OwnerHeader
//         title="Owner Dashboard"
//         subtitle="Manage job postings and track worker applications"
//       />

//       <div className="header-row">
//         <div className="view-selector">
//           <button 
//             className={`view-button ${selectedView === 'jobs' ? 'active' : ''}`}
//             onClick={() => setSelectedView('jobs')}
//           >
//             🏢 Jobs
//           </button>
//           <button 
//             className={`view-button ${selectedView === 'workers' ? 'active' : ''}`}
//             onClick={() => setSelectedView('workers')}
//           >
//             👷 All Workers
//           </button>
//         </div>
//         {selectedView === 'jobs' && (
//           <button className="add-job-btn" onClick={() => setShowModal(true)}>
//             + Add New Job
//           </button>
//         )}
//       </div>

//       {/* Job/Worker Tables */}
//       <div className="table-container">
//         {selectedView === 'jobs' ? (
//           <table className="job-table">
//             <thead>
//               <tr>
//                 <th>Title</th>
//                 <th>Skill Needed</th>
//                 <th>Location</th>
//                 <th>Pay</th>
//                 <th>Duration</th>
//                 <th>Status</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {jobs.length === 0 ? (
//                 <tr>
//                   <td colSpan="7" className="no-jobs">
//                     No jobs posted yet.
//                   </td>
//                 </tr>
//               ) : (
//                 jobs.map((job) => (
//                   <tr key={job.id}>
//                     <td>{job.title}</td>
//                     <td>{job.skillNeeded}</td>
//                     <td>{job.location}</td>
//                     <td>{job.pay}</td>
//                     <td>{job.duration}</td>
//                     <td>
//                       <span
//                         className={
//                           job.status === "active"
//                             ? "status-active"
//                             : "status-closed"
//                         }
//                       >
//                         {job.status}
//                       </span>
//                     </td>
//                     <td>
//                       <button
//                         className="delete-btn"
//                         onClick={() => handleDelete(job.id)}
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         ) : (
//           <table className="worker-table">
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>Skill</th>
//                 <th>Contact</th>
//                 <th>Location</th>
//                 <th>Area/Colony</th>
//                 <th>Pincode</th>
//               </tr>
//             </thead>
//             <tbody>
//               {workers.length === 0 ? (
//                 <tr>
//                   <td colSpan="6" className="no-workers">
//                     No workers registered yet.
//                   </td>
//                 </tr>
//               ) : (
//                 workers.map((worker) => (
//                   <tr key={worker.id}>
//                     <td>{worker.name || "Unnamed"}</td>
//                     <td>{worker.workType || worker.skill || "N/A"}</td>
//                     <td>{worker.phone || "No contact"}</td>
//                     <td>{worker.address || "N/A"}</td>
//                     <td>
//                       {(worker.area || worker.colony) ? 
//                         `${worker.area || ''}${worker.colony ? `, ${worker.colony}` : ''}` : 
//                         'N/A'
//                       }
//                     </td>
//                     <td>{worker.pincode || "N/A"}</td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* Modal Popup */}
//       {showModal && (
//         <div className="modal-overlay">
//           <AddJobModal
//             closeModal={() => setShowModal(false)}
//             onJobAdded={fetchJobs}
//             id={state.id}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default JobManager;
import { useEffect, useState } from "react";
import { jobService } from "../../services/jobService";
import { workerService } from "../../services/workerService";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";

import AddJobModal from "./AddJobModal";
import "./JobManager.css";
import OwnerHeader from "./OwnerHeader";
import axios from "axios";

const API_BASE = "http://localhost:8083/api";

const JobManager = () => {
  const { t } = useTranslation("jobManager");

  const [jobs, setJobs] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedView, setSelectedView] = useState("jobs");

  const state = useOutletContext();

  const fetchJobs = async () => {
    const res = await axios.get(`${API_BASE}/jobs/owner/${state.id}`);
    setJobs(res.data);
  };

  const fetchWorkers = async () => {
    const data = await workerService.getAllWorkersByOwnerID(state.id);
    setWorkers(data);
  };

  useEffect(() => {
    fetchJobs();
    fetchWorkers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm(t("confirm_delete"))) {
      await jobService.deleteJob(id);
      fetchJobs();
    }
  };

  return (
    <div className="job-manager-container">
      {/* Header */}
      <OwnerHeader
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <div className="header-row">
        <div className="view-selector">
          <button
            className={`view-button ${selectedView === "jobs" ? "active" : ""}`}
            onClick={() => setSelectedView("jobs")}
          >
            {t("tabs.jobs")}
          </button>
          <button
            className={`view-button ${selectedView === "workers" ? "active" : ""}`}
            onClick={() => setSelectedView("workers")}
          >
            {t("tabs.workers")}
          </button>
        </div>

        {selectedView === "jobs" && (
          <button className="add-job-btn" onClick={() => setShowModal(true)}>
            {t("add_job")}
          </button>
        )}
      </div>

      <div className="table-container">
        {selectedView === "jobs" ? (
          <table className="job-table">
            <thead>
              <tr>
                <th>{t("jobs_table.title")}</th>
                <th>{t("jobs_table.skill")}</th>
                <th>{t("jobs_table.location")}</th>
                <th>{t("jobs_table.pay")}</th>
                <th>{t("jobs_table.duration")}</th>
                <th>{t("jobs_table.status")}</th>
                <th>{t("jobs_table.action")}</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-jobs">
                    {t("jobs_table.empty")}
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id}>
                    <td>{job.title}</td>
                    <td>{job.skillNeeded}</td>
                    <td>{job.location}</td>
                    <td>{job.pay}</td>
                    <td>{job.duration}</td>
                    <td>
                      <span
                        className={
                          job.status === "active"
                            ? "status-active"
                            : "status-closed"
                        }
                      >
                        {job.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(job.id)}
                      >
                        {t("jobs_table.delete")}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
          <table className="worker-table">
            <thead>
              <tr>
                <th>{t("workers_table.name")}</th>
                <th>{t("workers_table.skill")}</th>
                <th>{t("workers_table.contact")}</th>
                <th>{t("workers_table.location")}</th>
                <th>{t("workers_table.area")}</th>
                <th>{t("workers_table.pincode")}</th>
              </tr>
            </thead>
            <tbody>
              {workers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-workers">
                    {t("workers_table.empty")}
                  </td>
                </tr>
              ) : (
                workers.map((worker) => (
                  <tr key={worker.id}>
                    <td>{worker.name || t("fallback.unnamed")}</td>
                    <td>{worker.workType || worker.skill || t("fallback.na")}</td>
                    <td>{worker.phone || t("fallback.no_contact")}</td>
                    <td>{worker.address || t("fallback.na")}</td>
                    <td>
                      {(worker.area || worker.colony)
                        ? `${worker.area || ""}${worker.colony ? `, ${worker.colony}` : ""}`
                        : t("fallback.na")}
                    </td>
                    <td>{worker.pincode || t("fallback.na")}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <AddJobModal
            closeModal={() => setShowModal(false)}
            onJobAdded={fetchJobs}
            id={state.id}
          />
        </div>
      )}
    </div>
  );
};

export default JobManager;

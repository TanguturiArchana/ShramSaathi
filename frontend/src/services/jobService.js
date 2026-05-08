import axios from "axios";

const API_BASE_URL = "http://localhost:8083/api";

export const jobService = {
  
  getAllJobs: async () => {
    const res = await axios.get(`${API_BASE_URL}/jobs`);
    return res.data;
  },


  addJob: async (jobData) => {
    const res = await axios.post(`${API_BASE_URL}/jobs`, jobData);
    return res.data;
  },
  getAnalyticsJobs: async (ownerId) => {
  const res = await axios.get(
    `http://localhost:8083/api/jobs/analytics/${ownerId}`
  );
  return res.data;
},

 
  deleteJob: async (jobId) => {
    await axios.delete(`${API_BASE_URL}/jobs/${jobId}`);
  },
};

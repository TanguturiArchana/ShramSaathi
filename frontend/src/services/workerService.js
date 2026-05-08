import axios from "axios";

const API_BASE = "http://localhost:8083/api";

export const workerService = {
  
  getAllWorkers: async () => {
    const res = await axios.get(`${API_BASE}/users`);
    return res.data;
  },

  getWorkerById: async (id) => {
    const res = await axios.get(`${API_BASE}/users/${id}`);
    return res.data;
  },
};
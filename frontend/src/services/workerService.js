import axios from "axios";

const API_BASE = "http://localhost:8083/api";

export const workerService = {
  // Get all workers
  // getAllWorkers: async () => {
  //   const res = await axios.get(`${API_BASE}/users`);
  //   return res.data;
  // },

  // Get worker by ID
  getWorkerById: async (id) => {
    const res = await axios.get(`${API_BASE}/users/${id}`);
    return res.data;
  },

  getAllWorkersByOwnerID: async (ownerId) => {
    const res = await axios.get(`${API_BASE}/users/owner/${ownerId}`);
    return res.data;
  }
};
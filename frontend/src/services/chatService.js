import axios from "axios";
import { send } from "./socketService";

const API_BASE = "http://localhost:8083/api/chat";

export const chatService = {
  sendMessage: async (messageData) => {
    const message = {
      applicationId: messageData.applicationId,
      senderId: messageData.senderId,
      receiverId: messageData.receiverId || null, 
      message: messageData.message
    };
    send("/app/chat", message);
    const res = await axios.post(API_BASE, message);
    return res.data;
  },

  getMessages: async (applicationId) => {
    const res = await axios.get(`${API_BASE}/${applicationId}`);
    return res.data.map(msg => ({
      applicationId: msg.applicationId,
      senderId: msg.senderId,
      receiverId: msg.receiverId,
      message: msg.message,
      sentAt: msg.sentAt
    }));
  },
};

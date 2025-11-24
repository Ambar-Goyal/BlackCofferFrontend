// frontend/src/api/apiClient.js

import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://blackcofferbackend-dk0q.onrender.com", // 🔗 Your Render backend
  timeout: 20000, // 20s timeout
  headers: {
    "Content-Type": "application/json"
  }
});

export default apiClient;

import axios from "axios";

const api = axios.create({
  // baseURL: "https://pzafira-cloth-store.vercel.app",
  baseURL: "http://127.0.0.1:8000",
});

const token = localStorage.getItem("access");
if (token) {
  api.defaults.headers.common["Authorization"] = `JWT ${token}`;
}

export default api;
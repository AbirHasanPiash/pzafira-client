import axios from "axios";

const api = axios.create({
  baseURL: "https://pzafira-cloth-store.vercel.app",
});

const token = localStorage.getItem("access");
if (token) {
  api.defaults.headers.common["Authorization"] = `JWT ${token}`;
}

export default api;
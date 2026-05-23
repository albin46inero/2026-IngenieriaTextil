import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_ROOT_API,
  headers: {
    "Authorization": `Bearer ${import.meta.env.VITE_TOKEN}`,
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
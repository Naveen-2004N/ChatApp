import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" 
    ? "http://localhost:3000/api" 
    : "https://chatapp-backend-xh7o.onrender.com/api",
  withCredentials: true,
});
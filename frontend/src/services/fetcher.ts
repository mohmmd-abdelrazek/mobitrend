import axios from "axios";

export const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: process.env.NODE_ENV === "development" ? "http://localhost:5000/api" : "/api",
});

const fetcher = (url : string) => axiosInstance.get(url).then(res => res.data);
export default fetcher;
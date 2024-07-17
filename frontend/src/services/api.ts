import axios, { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:5000", // Use the correct protocol (http or https) and set the correct base URL
});

export default api;

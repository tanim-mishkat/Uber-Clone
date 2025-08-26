import axios from "axios";
import { apiBase } from "./apiBase";

export const http = axios.create({
    baseURL: apiBase(),
    withCredentials: true,
});

http.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});
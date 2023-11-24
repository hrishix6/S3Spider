import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL as string;

const AUTH_TOKEN = localStorage.getItem("token");

export const client = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${AUTH_TOKEN}`
    }
});




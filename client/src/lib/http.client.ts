import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL as string;


export const getClient = () => axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
});




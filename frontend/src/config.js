const isEmulator = navigator.userAgent.includes("Android");

export const API_BASE_URL = isEmulator
    ? "http://10.0.2.2:8000/api/"
    : "http://127.0.0.1:8000/api/";


export const WEBSITE_BASE_URL = isEmulator
    ? "http://10.0.2.2:3000"
    : "http://127.0.0.1:3000";
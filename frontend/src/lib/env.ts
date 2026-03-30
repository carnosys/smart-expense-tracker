const envApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

export const API_BASE_URL = envApiBaseUrl || "http://localhost:8080/api/v1";

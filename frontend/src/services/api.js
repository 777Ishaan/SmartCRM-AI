import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    Accept: "application/json",
  },
});

// Automatically attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// =========================
// DOCUMENTS
// =========================

export const uploadDocument = async (formData) => {
  const response = await api.post(
    "/documents/upload",
    formData
  );

  return response.data;
};

export const getDocuments = async () => {
  const response = await api.get(
    "/documents"
  );

  return response.data;
};

// =========================
// ANALYTICS
// =========================

export const getAnalytics = async () => {
  const response = await api.get(
    "/analytics"
  );

  return response.data;
};

export default api;
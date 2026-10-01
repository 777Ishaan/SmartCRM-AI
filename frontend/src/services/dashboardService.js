import api from "./axios";

const API_URL = "/api/dashboard/stats";

export const getDashboardStats = async () => {
  const response = await api.get(API_URL);
  return response.data;
};
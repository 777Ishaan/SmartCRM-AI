import api from "./axios";

const API_URL = "/api/activities";

export const getCalendarActivities = async () => {
  const response = await api.get(API_URL);
  return response.data;
};
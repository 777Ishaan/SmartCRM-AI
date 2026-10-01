import api from "./axios";

const API_URL = "/api/leads";

export const getLeads = async () => {
  const response = await api.get(API_URL);
  return response.data;
};

export const createLead = async (lead) => {
  const response = await api.post(API_URL, lead);
  return response.data;
};

export const updateLead = async (id, lead) => {
  const response = await api.put(`${API_URL}/${id}`, lead);
  return response.data;
};

export const deleteLead = async (id) => {
  await api.delete(`${API_URL}/${id}`);
};
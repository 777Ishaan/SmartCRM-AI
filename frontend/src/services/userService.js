import api from "./axios";

const API_URL = "/api/users";

export const getUsers = async () => {
  const response = await api.get(API_URL);
  return response.data;
};

export const createUser = async (user) => {
  const response = await api.post(API_URL, user);
  return response.data;
};

export const updateUser = async (id, user) => {
  const response = await api.put(`${API_URL}/${id}`, user);
  return response.data;
};

export const updateUserStatus = async (id, enabled) => {
  const response = await api.patch(
    `${API_URL}/${id}/status?enabled=${enabled}`
  );
  return response.data;
};

export const deleteUser = async (id) => {
  await api.delete(`${API_URL}/${id}`);
};
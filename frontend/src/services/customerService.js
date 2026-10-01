import api from "./axios";

const API_URL = "/api/customers";

export const getCustomers = async () => {
  const response = await api.get(API_URL);
  return response.data;
};

export const createCustomer = async (customer) => {
  const response = await api.post(API_URL, customer);
  return response.data;
};

export const updateCustomer = async (id, customer) => {
  const response = await api.put(`${API_URL}/${id}`, customer);
  return response.data;
};

export const deleteCustomer = async (id) => {
  await api.delete(`${API_URL}/${id}`);
};
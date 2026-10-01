import api from "./axios";

const ACTIVITY_API = "/api/activities";
const CUSTOMER_API = "/api/customers";
const LEAD_API = "/api/leads";

export const getActivities = async () => {
  const response = await api.get(ACTIVITY_API);
  return response.data;
};

export const createActivity = async (activity) => {
  const response = await api.post(ACTIVITY_API, activity);
  return response.data;
};

export const updateActivity = async (id, activity) => {
  const response = await api.put(
    `${ACTIVITY_API}/${id}`,
    activity
  );
  return response.data;
};

export const deleteActivity = async (id) => {
  await api.delete(`${ACTIVITY_API}/${id}`);
};

export const getCustomersForActivity = async () => {
  const response = await api.get(CUSTOMER_API);
  return response.data;
};

export const getLeadsForActivity = async () => {
  const response = await api.get(LEAD_API);
  return response.data;
};
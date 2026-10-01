export const getCurrentUser = () => {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch (error) {
    console.error("Unable to read current user:", error);
    return null;
  }
};

export const getCurrentUserRole = () => {
  return getCurrentUser()?.role || null;
};

export const isAdmin = () => {
  return getCurrentUserRole() === "ADMIN";
};

export const isSalesManager = () => {
  return getCurrentUserRole() === "SALES_MANAGER";
};

export const isSalesRepresentative = () => {
  return getCurrentUserRole() === "SALES_REPRESENTATIVE";
};
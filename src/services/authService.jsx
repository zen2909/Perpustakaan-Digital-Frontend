import api from "./api";

export const login = (data) => {
  return api.post("/login", data);
};

export const logout = () => {
  return api.post("/logout");
};

export const getMe = () => {
  return api.get("/me");
};

export const registerUser = (data) => {
  return api.post(`/register`, data);
};

export const getMembers = () => {
  return api.get("/members");
};

export const getTotalUsers = () => {
  return api.get(`/users/total-users`);
};

export const getNewUsersToday = () => {
  return api.get(`/users/new-today`);
};

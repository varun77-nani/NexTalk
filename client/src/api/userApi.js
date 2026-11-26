import api from "./axios.js";

export const searchUsers = async (search) =>
  (await api.get("/users", { params: { search } })).data.users;
export const updateProfile = async (updates) =>
  (await api.patch("/users/me", updates)).data.user;

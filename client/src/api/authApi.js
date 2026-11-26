import api from "./axios.js";

export const getMe = async () => (await api.get("/auth/me")).data.user;
export const login = async (credentials) => (await api.post("/auth/login", credentials)).data.user;
export const signup = async (details) => (await api.post("/auth/signup", details)).data.user;
export const logout = async () => api.post("/auth/logout");

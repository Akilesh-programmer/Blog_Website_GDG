import api from "./apiClient";

export const signup = (body) => api.post("/users/signup", body);
export const login = (body) => api.post("/users/login", body);
export const logout = () => api.get("/users/logout");
export const getMe = () => api.get("/users/me");

export default { signup, login, logout, getMe };

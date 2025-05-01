import { authService as api } from './api';

const setToken = (token) => {
  localStorage.setItem('token', token);
};

const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

const login = async (email, password) => {
  try {
    const response = await api.login({ email, password });
    if (response.data.token) {
      setToken(response.data.token);
      setUser(response.data.user);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

const register = async (firstName, lastName, email, password) => {
  try {
    const response = await api.register({ firstName, lastName, email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const logout = () => {
  api.logout();
};

const getCurrentUser = () => {
  return api.getCurrentUser();
};

const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

export const authService = {
  login,
  register,
  logout,
  getCurrentUser,
  isAuthenticated,
};
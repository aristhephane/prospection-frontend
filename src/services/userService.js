import axios from 'axios';

// Utiliser directement le préfixe /api car le proxy s'en occupe

const getUsers = () => {
  return axios.get('/api/utilisateurs');
};

const getUserById = (id) => {
  return axios.get(`/api/utilisateurs/${id}`);
};

const getCurrentUserProfile = () => {
  return axios.get('/api/utilisateurs/profil');
};

const createUser = (userData) => {
  return axios.post('/api/utilisateurs/ajouter', userData);
};

const updateUser = (id, userData) => {
  return axios.post(`/api/utilisateurs/${id}/modifier`, userData);
};

const updateProfile = (profileData) => {
  return axios.post('/api/utilisateurs/profil', profileData);
};

const deactivateUser = (id) => {
  return axios.post(`/api/utilisateurs/${id}/desactiver`);
};

const deleteUser = (id) => {
  return axios.delete(`/api/utilisateurs/${id}`);
};

const getRoles = () => {
  return axios.get('/api/roles');
};

const changePassword = (id, passwordData) => {
  return axios.post(`/api/utilisateurs/${id}/change-password`, passwordData);
};

const resetPassword = (email) => {
  return axios.post('/api/reset-password/request', { email });
};

const confirmResetPassword = (token, password) => {
  return axios.post('/api/reset-password/confirm', { token, password });
};

const userService = {
  getUsers,
  getUserById,
  getCurrentUserProfile,
  createUser,
  updateUser,
  updateProfile,
  deactivateUser,
  deleteUser,
  getRoles,
  changePassword,
  resetPassword,
  confirmResetPassword
};

export default userService;

import axios from 'axios';

// Les chemins d'API sont relatifs à la baseURL, il ne faut pas ajouter /api/ en plus

const getUsers = () => {
  return axios.get('/utilisateurs');
};

const getUserById = (id) => {
  return axios.get(`/utilisateurs/${id}`);
};

const getCurrentUserProfile = () => {
  return axios.get('/utilisateurs/profil');
};

const createUser = (userData) => {
  return axios.post('/utilisateurs/ajouter', userData);
};

const updateUser = (id, userData) => {
  return axios.post(`/utilisateurs/${id}/modifier`, userData);
};

const updateProfile = (profileData) => {
  return axios.post('/utilisateurs/profil', profileData);
};

const deactivateUser = (id) => {
  return axios.post(`/utilisateurs/${id}/desactiver`);
};

const deleteUser = (id) => {
  return axios.delete(`/utilisateurs/${id}`);
};

const getRoles = () => {
  return axios.get('/roles');
};

const changePassword = (id, passwordData) => {
  return axios.post(`/utilisateurs/${id}/change-password`, passwordData);
};

const resetPassword = (email) => {
  return axios.post('/reset-password/request', { email });
};

const confirmResetPassword = (token, password) => {
  return axios.post('/reset-password/confirm', { token, password });
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

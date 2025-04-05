import axios from 'axios';

// Définir l'URL de base pour l'API
const API_URL = process.env.REACT_APP_API_URL || 'https://api.upjv-prospection-vps.amourfoot.fr';

const getUsers = () => {
  return axios.get(`${API_URL}/api/utilisateurs`);
};

const getUserById = (id) => {
  return axios.get(`${API_URL}/utilisateurs/${id}`);
};

const getCurrentUserProfile = () => {
  return axios.get(`${API_URL}/utilisateurs/profil`);
};

const createUser = (userData) => {
  return axios.post(`${API_URL}/utilisateurs/ajouter`, userData);
};

const updateUser = (id, userData) => {
  return axios.post(`${API_URL}/utilisateurs/${id}/modifier`, userData);
};

const updateProfile = (profileData) => {
  return axios.post(`${API_URL}/utilisateurs/profil`, profileData);
};

const deactivateUser = (id) => {
  return axios.post(`${API_URL}/utilisateurs/${id}/desactiver`);
};

const deleteUser = (id) => {
  return axios.delete(`${API_URL}/utilisateurs/${id}`);
};

const getRoles = () => {
  return axios.get(`${API_URL}/roles`);
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
  getRoles
};

export default userService;

import axios from 'axios';

const baseAPI = process.env.REACT_APP_API_URL || 'https://api.upjv-prospection-vps.amourfoot.fr';

// Toutes les requêtes utilisent l'URL absolue de l'API
const getAllFiles = () => {
  return axios.get(`${baseAPI}/api/fiches`);
};

const getFileById = (id) => {
  return axios.get(`${baseAPI}/api/fiches/${id}`);
};

const createFile = (fileData) => {
  return axios.post(`${baseAPI}/api/fiches/nouvelle`, fileData);
};

const updateFile = (id, fileData) => {
  return axios.put(`${baseAPI}/api/fiches/${id}`, fileData);
};

const deleteFile = (id) => {
  return axios.delete(`${baseAPI}/api/fiches/${id}`);
};

const getFileHistory = (id) => {
  return axios.get(`${baseAPI}/api/fiches/${id}/historique`);
};

const getEnterprises = () => {
  return axios.get(`${baseAPI}/api/fiches/entreprises`);
};

const getRecentFiles = () => {
  return axios.get(`${baseAPI}/api/fiches/dernieres`);
};

const fileService = {
  getAllFiles,
  getFileById,
  createFile,
  updateFile,
  deleteFile,
  getFileHistory,
  getEnterprises,
  getRecentFiles
};

export default fileService;

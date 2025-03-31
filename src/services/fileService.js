import axios from 'axios';

// Toutes les requêtes utilisent des chemins relatifs pour éviter les problèmes
const getAllFiles = () => {
  return axios.get('/api/fiches');
};

const getFileById = (id) => {
  return axios.get(`/api/fiches/${id}`);
};

const createFile = (fileData) => {
  return axios.post(`/api/fiches`, fileData);
};

const updateFile = (id, fileData) => {
  return axios.put(`/api/fiches/${id}`, fileData);
};

const deleteFile = (id) => {
  return axios.delete(`/api/fiches/${id}`);
};

const getFileHistory = (id) => {
  return axios.get(`/api/fiches/${id}/historique`);
};

const getEnterprises = () => {
  return axios.get(`/api/entreprises`);
};

const fileService = {
  getAllFiles,
  getFileById,
  createFile,
  updateFile,
  deleteFile,
  getFileHistory,
  getEnterprises
};

export default fileService;

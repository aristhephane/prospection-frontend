import axios from 'axios';

// Utiliser directement le préfixe /api car le proxy s'en occupe

// Toutes les requêtes utilisent l'URL relative pour que le proxy fonctionne
const getAllFiles = () => {
  return axios.get('/api/fiches');
};

const getFileById = (id) => {
  return axios.get(`/api/fiches/${id}`);
};

const createFile = (fileData) => {
  return axios.post('/api/fiches/nouvelle', fileData);
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
  return axios.get('/api/entreprises');
};

const getRecentFiles = () => {
  return axios.get('/api/fiches/dernieres');
};

const getPrefilledFile = (enterpriseId) => {
  return axios.get(`/api/fiches/entreprise/${enterpriseId}/pre-rempli`);
};

const getPossibleTransitions = (id) => {
  return axios.get(`/api/fiches/${id}/possible-transitions`);
};

const applyTransition = (id, transition) => {
  return axios.post(`/api/fiches/${id}/apply-transition/${transition}`);
};

const fileService = {
  getAllFiles,
  getFileById,
  createFile,
  updateFile,
  deleteFile,
  getFileHistory,
  getEnterprises,
  getRecentFiles,
  getPrefilledFile,
  getPossibleTransitions,
  applyTransition
};

export default fileService;

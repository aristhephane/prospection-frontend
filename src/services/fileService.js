import axios from 'axios';

// Configuration des URLs pour éviter les doublons de préfixe /api
// Tous les chemins d'API sont relatifs à la baseURL définie dans axios.defaults.baseURL

const getAllFiles = () => {
  return axios.get('/fiches');
};

const getFileById = (id) => {
  return axios.get(`/fiches/${id}`);
};

const createFile = (fileData) => {
  return axios.post('/fiches/nouvelle', fileData);
};

const updateFile = (id, fileData) => {
  return axios.put(`/fiches/${id}`, fileData);
};

const modifyFile = (id, fileData) => {
  return axios.post(`/fiches/modification/${id}`, fileData);
};

const deleteFile = (id) => {
  return axios.delete(`/fiches/${id}`);
};

const getFileHistory = (id) => {
  return axios.get(`/fiches/${id}/historique`);
};

const getEnterprises = () => {
  return axios.get('/entreprises');
};

const getRecentFiles = () => {
  return axios.get('/fiches/dernieres');
};

const getPrefilledFile = (enterpriseId) => {
  return axios.get(`/fiches/entreprise/${enterpriseId}/pre-rempli`);
};

const getPossibleTransitions = (id) => {
  return axios.get(`/fiches/${id}/possible-transitions`);
};

const applyTransition = (id, transition) => {
  return axios.post(`/fiches/${id}/apply-transition/${transition}`);
};

const generatePdf = (id) => {
  return axios.get(`/fiches/generate-pdf/${id}`, { responseType: 'blob' });
};

const searchFiles = (criteria, limit = 100, offset = 0, orderBy = {}) => {
  return axios.post('/search/fiches', {
    criteria,
    limit,
    offset,
    orderBy
  });
};

const getSearchOptions = () => {
  return axios.get('/search/options');
};

const fileService = {
  getAllFiles,
  getFileById,
  createFile,
  updateFile,
  modifyFile,
  deleteFile,
  getFileHistory,
  getEnterprises,
  getRecentFiles,
  getPrefilledFile,
  getPossibleTransitions,
  applyTransition,
  generatePdf,
  searchFiles,
  getSearchOptions
};

export default fileService;

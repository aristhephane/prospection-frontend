import axios from 'axios';

const API_URL = '/api/prospection';

const prospectionService = {
  async getAllProspections() {
    const response = await axios.get(API_URL);
    return response.data;
  },

  async getProspectionById(id) {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  async createProspection(prospectionData) {
    const response = await axios.post(API_URL, prospectionData);
    return response.data;
  },

  async updateProspection(id, prospectionData) {
    const response = await axios.put(`${API_URL}/${id}`, prospectionData);
    return response.data;
  },

  async deleteProspection(id) {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  },

  async applyTransition(id, transition) {
    const response = await axios.post(`${API_URL}/${id}/apply-transition/${transition}`);
    return response.data;
  },

  async getPossibleTransitions(id) {
    const response = await axios.get(`${API_URL}/${id}/possible-transitions`);
    return response.data;
  }
};

export default prospectionService;

import axios from 'axios';

const API_URL = '/api/dashboard';

const dashboardService = {
  async getStatistics() {
    const response = await axios.get(`${API_URL}/statistics`);
    return response.data;
  },

  async getProspection() {
    const response = await axios.get(`${API_URL}/prospection`);
    return response.data;
  }
};

export default dashboardService;

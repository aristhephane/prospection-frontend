import axios from 'axios';

const baseAPI = process.env.REACT_APP_API_URL || 'https://api.upjv-prospection-vps.amourfoot.fr';
const API_URL = `${baseAPI}/api/dashboard`;

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

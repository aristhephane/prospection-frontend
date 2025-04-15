import axios from 'axios';

// Les chemins d'API sont relatifs à la baseURL, il ne faut pas ajouter /api/ en plus

const dashboardService = {
  async getStatistics() {
    try {
      const response = await axios.get('/dashboard/statistics');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  },

  async getProspection() {
    try {
      const response = await axios.get('/dashboard/prospection');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des données de prospection:', error);
      throw error;
    }
  },

  async getRecentActivities() {
    try {
      const response = await axios.get('/dashboard/recent-activities');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des activités récentes:', error);
      throw error;
    }
  },

  async getUserStatistics() {
    try {
      const response = await axios.get('/dashboard/user-statistics');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques utilisateur:', error);
      throw error;
    }
  }
};

export default dashboardService;

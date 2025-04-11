import axios from 'axios';

// Utiliser directement le préfixe /api car le proxy s'en occupe

const dashboardService = {
  async getStatistics() {
    try {
      const response = await axios.get('/api/dashboard/statistics');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  },

  async getProspection() {
    try {
      const response = await axios.get('/api/dashboard/prospection');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des données de prospection:', error);
      throw error;
    }
  },

  async getRecentActivities() {
    try {
      const response = await axios.get('/api/dashboard/recent-activities');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des activités récentes:', error);
      throw error;
    }
  },

  async getUserStatistics() {
    try {
      const response = await axios.get('/api/dashboard/user-statistics');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques utilisateur:', error);
      throw error;
    }
  }
};

export default dashboardService;

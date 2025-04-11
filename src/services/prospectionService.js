import axios from 'axios';

// Utiliser directement le préfixe /api car le proxy s'en occupe

const prospectionService = {
  async getAllProspections() {
    try {
      const response = await axios.get('/api/fiches');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des fiches:', error);
      throw error;
    }
  },

  async getProspectionById(id) {
    if (!id) {
      throw new Error('Identifiant de fiche manquant');
    }
    try {
      const response = await axios.get(`/api/fiches/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la fiche:', error);
      throw error;
    }
  },

  async createProspection(prospectionData) {
    try {
      const response = await axios.post('/api/fiches/nouvelle', prospectionData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la fiche:', error);
      throw error;
    }
  },

  async updateProspection(id, prospectionData) {
    if (!id) {
      throw new Error('Identifiant de fiche manquant');
    }
    try {
      const response = await axios.put(`/api/fiches/${id}`, prospectionData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la fiche:', error);
      throw error;
    }
  },

  async deleteProspection(id) {
    if (!id) {
      throw new Error('Identifiant de fiche manquant');
    }
    try {
      const response = await axios.delete(`/api/fiches/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression de la fiche:', error);
      throw error;
    }
  },

  async getDernieresFiches() {
    try {
      const response = await axios.get('/api/fiches/dernieres');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des dernières fiches:', error);
      throw error;
    }
  },

  async getHistorique(id) {
    if (!id) {
      throw new Error('Identifiant de fiche manquant');
    }
    try {
      const response = await axios.get(`/api/fiches/${id}/historique`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique:', error);
      throw error;
    }
  },

  async applyTransition(id, transition) {
    try {
      const response = await axios.post(`/api/fiches/${id}/apply-transition/${transition}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'application de la transition:', error);
      throw error;
    }
  },

  async getPossibleTransitions(id) {
    try {
      const response = await axios.get(`/api/fiches/${id}/possible-transitions`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des transitions possibles:', error);
      throw error;
    }
  },

  async getEntreprises() {
    try {
      const response = await axios.get('/api/entreprises');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des entreprises:', error);
      throw error;
    }
  },

  async getPrefilledFiche(entrepriseId) {
    try {
      const response = await axios.get(`/api/fiches/entreprise/${entrepriseId}/pre-rempli`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la fiche pré-remplie:', error);
      throw error;
    }
  }
};

export default prospectionService;

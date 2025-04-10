import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper, CircularProgress, Alert, Snackbar } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import FicheForm from '../../components/fiche/FicheForm';

const FicheEdit = ({ isAdmin }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [fiche, setFiche] = useState(null);
  const [message, setMessage] = useState({ open: false, text: '', severity: 'success' });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFiche = async () => {
      if (!id) {
        setError('Identifiant de fiche manquant');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/fiches/${id}`);
        if (response.data.success) {
          setFiche(response.data.fiche);
        } else {
          setError(response.data.message || 'Erreur lors du chargement de la fiche');
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la fiche:', error);
        setError('Erreur lors du chargement de la fiche');
      } finally {
        setLoading(false);
      }
    };

    fetchFiche();
  }, [id]);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/fiches/${id}`, {
        ...formData,
        entreprise: formData.entrepriseId, // Conversion du nom du champ
      });

      if (response.data.success) {
        setMessage({
          open: true,
          text: 'Fiche mise à jour avec succès',
          severity: 'success'
        });

        // Redirection vers la page de consultation après 2 secondes
        setTimeout(() => {
          navigate('/fiches/consultation');
        }, 2000);
      } else {
        throw new Error(response.data.message || 'Erreur lors de la mise à jour de la fiche');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la fiche:', error);
      setMessage({
        open: true,
        text: error.message || 'Erreur lors de la mise à jour de la fiche',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseMessage = () => {
    setMessage(prev => ({ ...prev, open: false }));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {isAdmin ? 'Administration - ' : ''}Modification de fiche
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : fiche ? (
          <FicheForm
            initialValues={{
              entrepriseId: fiche.entreprise?.id,
              statut: fiche.statut,
              commentairesGeneraux: fiche.commentaires,
              resultatVisite: fiche.resultatsVisite,
              niveauInteret: fiche.niveauInteret,
              dateVisite: fiche.dateVisite,
              dateProchainVisite: fiche.dateVisiteSuivante
            }}
            onSubmit={handleSubmit}
          />
        ) : (
          <Alert severity="warning">Aucune fiche trouvée avec cet identifiant</Alert>
        )}
      </Paper>

      <Snackbar
        open={message.open}
        autoHideDuration={6000}
        onClose={handleCloseMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseMessage} severity={message.severity}>
          {message.text}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FicheEdit;

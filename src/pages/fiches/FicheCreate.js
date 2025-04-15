import React, { useState, useEffect } from 'react';
import {
  Typography, Box, Paper, Button, CircularProgress, Snackbar, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FicheForm from '../../components/fiche/FicheForm';
import fileService from '../../services/fileService'; // Import the service

const FicheCreate = ({ isAdmin }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ open: false, text: '', severity: 'success' });
  const [dernieresFiches, setDernieresFiches] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Charger les 5 dernières fiches au chargement
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Récupération des 5 dernières fiches créées en utilisant le service
        const fichesResponse = await fileService.getRecentFiles();

        // Si la réponse est succès, on met à jour les fiches
        if (fichesResponse.data.success) {
          setDernieresFiches(fichesResponse.data.fiches || []);

          // Afficher un message si aucune fiche n'est disponible
          if (fichesResponse.data.message) {
            setMessage({
              open: true,
              text: fichesResponse.data.message,
              severity: 'info'
            });
          }
        } else {
          console.error('Erreur dans la réponse API:', fichesResponse.data);
          setMessage({
            open: true,
            text: fichesResponse.data.message || 'Erreur lors du chargement des données',
            severity: 'error'
          });
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setMessage({
          open: true,
          text: error.response?.data?.message || 'Erreur de connexion au serveur',
          severity: 'error'
        });
        // S'assurer que dernieresFiches est vide en cas d'erreur
        setDernieresFiches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFicheSubmit = async (formData) => {
    setLoading(true);
    try {
      // Utilisation du service pour créer une nouvelle fiche
      const response = await fileService.createFile({
        ...formData,
        entreprise: formData.entrepriseId, // Conversion du nom du champ
      });

      if (response.data.success) {
        setMessage({
          open: true,
          text: 'Fiche créée avec succès',
          severity: 'success'
        });

        // Masquer le formulaire et mettre à jour la liste des dernières fiches
        setShowForm(false);

        // Rafraîchir la liste des dernières fiches en utilisant le service
        const fichesResponse = await fileService.getRecentFiles();
        if (fichesResponse.data.success) {
          setDernieresFiches(fichesResponse.data.fiches || []);
        }

        // Redirection vers la page de consultation après 2 secondes
        setTimeout(() => {
          navigate('/fiches/consultation');
        }, 2000);
      }
    } catch (error) {
      console.error('Erreur lors de la création de la fiche:', error);
      setMessage({
        open: true,
        text: 'Erreur lors de la création de la fiche',
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
        {isAdmin ? 'Administration - ' : ''}Génération de nouvelles fiches
      </Typography>

      {/* Section des 5 dernières fiches */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Les 5 dernières fiches créées</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowForm(true)}
            disabled={loading}
          >
            Générer une nouvelle fiche
          </Button>
        </Box>

        {loading && !showForm ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <CircularProgress />
          </Box>
        ) : dernieresFiches.length > 0 ? (
          <Box>
            {dernieresFiches.map((fiche) => (
              <Paper key={fiche.id} sx={{ p: 2, mb: 1, backgroundColor: '#f5f5f5' }}>
                <Typography variant="subtitle1">
                  <strong>Entreprise:</strong> {fiche.entreprise?.raisonSociale || 'Non spécifiée'}
                </Typography>
                <Typography variant="body2">
                  <strong>Date de visite:</strong> {new Date(fiche.dateVisite).toLocaleDateString('fr-FR')}
                </Typography>
                <Typography variant="body2" noWrap>
                  <strong>Commentaires:</strong> {fiche.commentaires || 'Aucun commentaire'}
                </Typography>
                <Typography variant="body2">
                  <strong>Statut:</strong> {fiche.statut || 'Nouveau'}
                </Typography>
              </Paper>
            ))}
          </Box>
        ) : (
          <Typography variant="body1">Aucune fiche disponible</Typography>
        )}
      </Paper>

      {/* Formulaire de création de fiche */}
      {showForm && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>Créer une nouvelle fiche</Typography>
          <FicheForm
            onSubmit={handleFicheSubmit}
            initialValues={{
              dateVisite: new Date(),
              statut: 'Nouveau',
              niveauInteret: 3
            }}
          />
        </Paper>
      )}

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

export default FicheCreate;

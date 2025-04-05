import React, { useState, useEffect } from 'react';
import {
  Typography, Box, Paper, Button, TextField, Grid, FormControl, InputLabel,
  Select, MenuItem, CircularProgress, Snackbar, Alert, Rating
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import fr from 'date-fns/locale/fr';
import { useNavigate } from 'react-router-dom';

const FicheCreate = ({ isAdmin }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ open: false, text: '', severity: 'success' });
  const [entreprises, setEntreprises] = useState([]);
  const [selectedEntreprise, setSelectedEntreprise] = useState(null);
  const [dernieresFiches, setDernieresFiches] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    dateVisite: new Date(),
    commentaires: '',
    resultatsVisite: '',
    actionsASuivre: '',
    dateVisiteSuivante: null,
    niveauInteret: 3,
    besoinsExprimes: '',
    entreprise: '',
    statut: 'nouveau'
  });

  // Charger les entreprises et les 5 dernières fiches au chargement
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Récupération des entreprises pour la liste déroulante
        const entreprisesResponse = await axios.get('/api/fiches/entreprises');
        if (entreprisesResponse.data.success) {
          setEntreprises(entreprisesResponse.data.entreprises || []);
        }

        // Récupération des 5 dernières fiches créées
        const fichesResponse = await axios.get('/api/fiches/dernieres');
        if (fichesResponse.data.success) {
          setDernieresFiches(fichesResponse.data.fiches || []);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setMessage({
          open: true,
          text: 'Erreur lors du chargement des données',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date, fieldName) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: date
    }));
  };

  const handleNiveauInteretChange = (event, newValue) => {
    setFormData(prev => ({
      ...prev,
      niveauInteret: newValue
    }));
  };

  const handleEntrepriseChange = async (e) => {
    const entrepriseId = e.target.value;
    setFormData(prev => ({
      ...prev,
      entreprise: entrepriseId
    }));

    if (entrepriseId) {
      try {
        setLoading(true);
        // Charger les données pré-remplies pour cette entreprise
        const response = await axios.get(`/api/fiches/entreprise/${entrepriseId}/pre-rempli`);
        if (response.data.success) {
          const entrepriseData = response.data.entreprise;
          const fichePreRemplie = response.data.fiche_pre_remplie;

          setSelectedEntreprise(entrepriseData);

          // Mise à jour du formulaire avec les données pré-remplies
          setFormData(prev => ({
            ...prev,
            entreprise: entrepriseId,
            dateVisite: new Date(),
            commentaires: '',
            niveauInteret: fichePreRemplie.niveauInteret || 3,
            actionsASuivre: fichePreRemplie.actionsASuivre || '',
            statut: 'nouveau'
          }));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données pré-remplies:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setSelectedEntreprise(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/fiches/nouvelle', formData);

      if (response.data.success) {
        setMessage({
          open: true,
          text: 'Fiche créée avec succès',
          severity: 'success'
        });

        // Réinitialiser le formulaire
        setFormData({
          dateVisite: new Date(),
          commentaires: '',
          resultatsVisite: '',
          actionsASuivre: '',
          dateVisiteSuivante: null,
          niveauInteret: 3,
          besoinsExprimes: '',
          entreprise: '',
          statut: 'nouveau'
        });

        setSelectedEntreprise(null);

        // Masquer le formulaire et mettre à jour la liste des dernières fiches
        setShowForm(false);

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
                {fiche.niveauInteret && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      <strong>Niveau d'intérêt:</strong>
                    </Typography>
                    <Rating value={fiche.niveauInteret} readOnly size="small" />
                  </Box>
                )}
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

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="entreprise-label">Entreprise</InputLabel>
                  <Select
                    labelId="entreprise-label"
                    name="entreprise"
                    value={formData.entreprise}
                    onChange={handleEntrepriseChange}
                    label="Entreprise"
                    required
                  >
                    <MenuItem value="">Sélectionner une entreprise</MenuItem>
                    {entreprises.map((entreprise) => (
                      <MenuItem key={entreprise.id} value={entreprise.id}>
                        {entreprise.raisonSociale}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {selectedEntreprise && (
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, bgcolor: '#f8f9fa' }}>
                    <Typography variant="subtitle2" gutterBottom>Informations sur l'entreprise:</Typography>
                    <Typography variant="body2"><strong>Raison sociale:</strong> {selectedEntreprise.raisonSociale}</Typography>
                    <Typography variant="body2"><strong>Adresse:</strong> {selectedEntreprise.adresse}</Typography>
                    <Typography variant="body2"><strong>Téléphone:</strong> {selectedEntreprise.telephone}</Typography>
                    {selectedEntreprise.email && (
                      <Typography variant="body2"><strong>Email:</strong> {selectedEntreprise.email}</Typography>
                    )}
                    <Typography variant="body2"><strong>Secteur d'activité:</strong> {selectedEntreprise.secteurActivite}</Typography>
                    {selectedEntreprise.siteWeb && (
                      <Typography variant="body2"><strong>Site web:</strong> {selectedEntreprise.siteWeb}</Typography>
                    )}
                  </Paper>
                </Grid>
              )}

              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
                  <DatePicker
                    label="Date de visite"
                    value={formData.dateVisite}
                    onChange={(date) => handleDateChange(date, 'dateVisite')}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true
                      }
                    }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="statut-label">Statut</InputLabel>
                  <Select
                    labelId="statut-label"
                    name="statut"
                    value={formData.statut}
                    onChange={handleChange}
                    label="Statut"
                  >
                    <MenuItem value="nouveau">Nouveau</MenuItem>
                    <MenuItem value="en_contact">En contact</MenuItem>
                    <MenuItem value="rendez_vous">Rendez-vous planifié</MenuItem>
                    <MenuItem value="proposition">Proposition envoyée</MenuItem>
                    <MenuItem value="client">Client</MenuItem>
                    <MenuItem value="sans_suite">Sans suite</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="commentaires"
                  label="Commentaires généraux"
                  multiline
                  rows={3}
                  value={formData.commentaires}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="resultatsVisite"
                  label="Résultats de la visite"
                  multiline
                  rows={3}
                  value={formData.resultatsVisite}
                  onChange={handleChange}
                  fullWidth
                  placeholder="Décrivez les résultats obtenus lors de cette visite"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  name="actionsASuivre"
                  label="Actions à suivre"
                  multiline
                  rows={3}
                  value={formData.actionsASuivre}
                  onChange={handleChange}
                  fullWidth
                  placeholder="Actions à entreprendre suite à cette visite"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  name="besoinsExprimes"
                  label="Besoins exprimés"
                  multiline
                  rows={3}
                  value={formData.besoinsExprimes}
                  onChange={handleChange}
                  fullWidth
                  placeholder="Besoins spécifiques exprimés par l'entreprise"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
                  <DatePicker
                    label="Date de prochaine visite (si planifiée)"
                    value={formData.dateVisiteSuivante}
                    onChange={(date) => handleDateChange(date, 'dateVisiteSuivante')}
                    slotProps={{
                      textField: {
                        fullWidth: true
                      }
                    }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box>
                  <Typography component="legend">Niveau d'intérêt exprimé:</Typography>
                  <Rating
                    name="niveauInteret"
                    value={formData.niveauInteret || 0}
                    onChange={handleNiveauInteretChange}
                    max={5}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => setShowForm(false)}
                  disabled={loading}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading || !formData.entreprise}
                >
                  {loading ? <CircularProgress size={24} /> : 'Enregistrer'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      )}

      {/* Message de notification */}
      <Snackbar open={message.open} autoHideDuration={6000} onClose={handleCloseMessage}>
        <Alert onClose={handleCloseMessage} severity={message.severity} sx={{ width: '100%' }}>
          {message.text}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FicheCreate;

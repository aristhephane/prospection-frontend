import React, { useState, useEffect } from 'react';
import {
  Typography, Box, Paper, Grid, TextField, Button, FormControl, InputLabel,
  Select, MenuItem, Chip, Checkbox, FormControlLabel, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, InputAdornment, IconButton, Tooltip, Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import fr from 'date-fns/locale/fr';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import fileService from '../../services/fileService';

const FicheSearch = ({ isAdmin }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [results, setResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchOptions, setSearchOptions] = useState({
    secteursActivite: [],
    villes: [],
    typesContact: [],
    statuts: [],
    niveauxInteret: [1, 2, 3, 4, 5]
  });
  const [showFilters, setShowFilters] = useState(true);
  const [error, setError] = useState(null);

  // Critères de recherche
  const [criteria, setCriteria] = useState({
    searchText: '',
    dateVisiteDebut: null,
    dateVisiteFin: null,
    statut: '',
    secteurActivite: '',
    ville: '',
    niveauInteret: '',
    typeContact: '',
    commercial: '',
    includeArchived: false
  });

  // Récupérer les options de recherche au chargement
  useEffect(() => {
    const fetchSearchOptions = async () => {
      setLoadingOptions(true);
      try {
        const response = await fileService.getSearchOptions();
        if (response.data.success) {
          setSearchOptions(response.data.options);
        } else {
          setError('Erreur lors du chargement des options de recherche');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des options:', error);
        setError('Erreur lors du chargement des options de recherche');
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchSearchOptions();
  }, []);

  // Fonction de recherche
  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      // Préparation des critères pour l'API (conversion des dates en chaînes)
      const searchCriteria = { ...criteria };

      if (searchCriteria.dateVisiteDebut) {
        searchCriteria.dateVisiteDebut = searchCriteria.dateVisiteDebut.toISOString().split('T')[0];
      }

      if (searchCriteria.dateVisiteFin) {
        searchCriteria.dateVisiteFin = searchCriteria.dateVisiteFin.toISOString().split('T')[0];
      }

      const response = await fileService.searchFiles(
        searchCriteria,
        rowsPerPage,
        page * rowsPerPage,
        { dateVisite: 'DESC' }
      );

      if (response.data && response.data.items) {
        setResults(response.data.items);
        setTotalResults(response.data.count || 0);
      } else {
        setResults([]);
        setTotalResults(0);
        setError('Aucun résultat trouvé');
      }
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      setError('Erreur lors de la recherche des fiches');
      setResults([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  // Réinitialiser les critères de recherche
  const handleReset = () => {
    setCriteria({
      searchText: '',
      dateVisiteDebut: null,
      dateVisiteFin: null,
      statut: '',
      secteurActivite: '',
      ville: '',
      niveauInteret: '',
      typeContact: '',
      commercial: '',
      includeArchived: false
    });
  };

  // Mise à jour des critères de recherche
  const handleCriteriaChange = (name, value) => {
    setCriteria(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Navigation vers les détails d'une fiche
  const handleViewFiche = (id) => {
    navigate(`/fiches/${id}`);
  };

  // Navigation vers l'édition d'une fiche
  const handleEditFiche = (id) => {
    navigate(`/fiches/${id}/modifier`);
  };

  // Gestion de la pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    // Relancer la recherche avec la nouvelle page
    setTimeout(handleSearch, 100);
  };

  // Gestion du nombre de lignes par page
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    // Relancer la recherche avec le nouveau nombre de lignes
    setTimeout(handleSearch, 100);
  };

  // Formatage du statut pour l'affichage
  const formatStatus = (status) => {
    switch (status) {
      case 'nouveau': return 'Nouveau';
      case 'en_contact': return 'En contact';
      case 'rendez_vous': return 'Rendez-vous';
      case 'proposition': return 'Proposition';
      case 'client': return 'Client';
      case 'perdu': return 'Perdu';
      default: return status;
    }
  };

  // Couleur du statut
  const getStatusColor = (status) => {
    switch (status) {
      case 'nouveau': return 'primary';
      case 'en_contact': return 'secondary';
      case 'rendez_vous': return 'warning';
      case 'proposition': return 'info';
      case 'client': return 'success';
      case 'perdu': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {isAdmin ? 'Administration - ' : ''}Recherche avancée des fiches
      </Typography>

      {/* Formulaire de recherche */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Critères de recherche</Typography>
          <Button
            startIcon={showFilters ? <ClearIcon /> : <FilterListIcon />}
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
          </Button>
        </Box>

        {showFilters && (
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
            <Grid container spacing={3}>
              {/* Recherche textuelle */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Recherche globale"
                  variant="outlined"
                  value={criteria.searchText}
                  onChange={(e) => handleCriteriaChange('searchText', e.target.value)}
                  placeholder="Rechercher par nom d'entreprise, commentaires, résultats..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Dates de visite */}
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Date de visite début"
                  value={criteria.dateVisiteDebut}
                  onChange={(date) => handleCriteriaChange('dateVisiteDebut', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Date de visite fin"
                  value={criteria.dateVisiteFin}
                  onChange={(date) => handleCriteriaChange('dateVisiteFin', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>

              {/* Statut */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Statut</InputLabel>
                  <Select
                    value={criteria.statut}
                    label="Statut"
                    onChange={(e) => handleCriteriaChange('statut', e.target.value)}
                  >
                    <MenuItem value="">Tous les statuts</MenuItem>
                    {searchOptions.statuts.map((statut) => (
                      <MenuItem key={statut} value={statut}>
                        {formatStatus(statut)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Secteur d'activité */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Secteur d'activité</InputLabel>
                  <Select
                    value={criteria.secteurActivite}
                    label="Secteur d'activité"
                    onChange={(e) => handleCriteriaChange('secteurActivite', e.target.value)}
                  >
                    <MenuItem value="">Tous les secteurs</MenuItem>
                    {searchOptions.secteursActivite.map((secteur) => (
                      <MenuItem key={secteur} value={secteur}>
                        {secteur}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Ville */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Ville</InputLabel>
                  <Select
                    value={criteria.ville}
                    label="Ville"
                    onChange={(e) => handleCriteriaChange('ville', e.target.value)}
                  >
                    <MenuItem value="">Toutes les villes</MenuItem>
                    {searchOptions.villes.map((ville) => (
                      <MenuItem key={ville} value={ville}>
                        {ville}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Niveau d'intérêt */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Niveau d'intérêt minimum</InputLabel>
                  <Select
                    value={criteria.niveauInteret}
                    label="Niveau d'intérêt minimum"
                    onChange={(e) => handleCriteriaChange('niveauInteret', e.target.value)}
                  >
                    <MenuItem value="">Tous les niveaux</MenuItem>
                    {searchOptions.niveauxInteret.map((niveau) => (
                      <MenuItem key={niveau} value={niveau}>
                        {niveau}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Type de contact */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Type de contact</InputLabel>
                  <Select
                    value={criteria.typeContact}
                    label="Type de contact"
                    onChange={(e) => handleCriteriaChange('typeContact', e.target.value)}
                  >
                    <MenuItem value="">Tous les types</MenuItem>
                    {searchOptions.typesContact.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Inclure les archivées */}
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={criteria.includeArchived}
                      onChange={(e) => handleCriteriaChange('includeArchived', e.target.checked)}
                    />
                  }
                  label="Inclure les entreprises archivées"
                />
              </Grid>

              {/* Boutons de recherche et de réinitialisation */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={handleReset}
                    disabled={loading}
                  >
                    Réinitialiser
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSearch}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
                  >
                    Rechercher
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </LocalizationProvider>
        )}
      </Paper>

      {/* Résultats de recherche */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Résultats ({totalResults})
        </Typography>

        {error && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : results.length > 0 ? (
          <>
            <TableContainer>
              <Table aria-label="tableau des résultats de recherche">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Entreprise</strong></TableCell>
                    <TableCell><strong>Date de visite</strong></TableCell>
                    <TableCell><strong>Commentaires</strong></TableCell>
                    <TableCell><strong>Statut</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.map((fiche) => (
                    <TableRow key={fiche.id}>
                      <TableCell>{fiche.entreprise?.raisonSociale || 'N/A'}</TableCell>
                      <TableCell>
                        {fiche.dateVisite ? new Date(fiche.dateVisite).toLocaleDateString('fr-FR') : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {fiche.commentaires?.length > 50
                          ? `${fiche.commentaires.substring(0, 50)}...`
                          : fiche.commentaires || 'Aucun commentaire'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={formatStatus(fiche.statut)}
                          color={getStatusColor(fiche.statut)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Voir la fiche">
                          <IconButton onClick={() => handleViewFiche(fiche.id)}>
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Modifier la fiche">
                          <IconButton onClick={() => handleEditFiche(fiche.id)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={totalResults}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Lignes par page"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
            />
          </>
        ) : (
          <Typography variant="body1" sx={{ my: 4, textAlign: 'center' }}>
            Aucun résultat à afficher. Veuillez effectuer une recherche.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default FicheSearch; 
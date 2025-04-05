import React, { useState, useEffect } from 'react';
import {
  Typography, Box, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, CircularProgress, Chip, IconButton,
  Tooltip, TextField, InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FichesList = ({ isAdmin }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [fiches, setFiches] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFiches, setFilteredFiches] = useState([]);

  useEffect(() => {
    const fetchFiches = async () => {
      setLoading(true);
      try {
        // Récupérer les fiches depuis l'API
        const response = await axios.get('/api/prospection');
        if (response.data.success) {
          setFiches(response.data.data || []);
          setFilteredFiches(response.data.data || []);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des fiches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiches();
  }, []);

  // Filtrer les fiches lorsque le terme de recherche change
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredFiches(fiches);
    } else {
      const lowercasedFilter = searchTerm.toLowerCase();
      const filtered = fiches.filter(fiche => {
        return (
          (fiche.entreprise?.raisonSociale?.toLowerCase().includes(lowercasedFilter)) ||
          (fiche.commentaires?.toLowerCase().includes(lowercasedFilter)) ||
          (fiche.statut?.toLowerCase().includes(lowercasedFilter))
        );
      });
      setFilteredFiches(filtered);
    }
    setPage(0); // Revenir à la première page lors du filtrage
  }, [searchTerm, fiches]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'nouveau': return 'primary';
      case 'en_contact': return 'secondary';
      case 'rendez_vous': return 'warning';
      case 'proposition': return 'info';
      case 'client': return 'success';
      default: return 'default';
    }
  };

  const formatStatus = (status) => {
    switch (status) {
      case 'nouveau': return 'Nouveau';
      case 'en_contact': return 'En contact';
      case 'rendez_vous': return 'Rendez-vous';
      case 'proposition': return 'Proposition';
      case 'client': return 'Client';
      default: return status;
    }
  };

  const handleViewFiche = (id) => {
    navigate(`/fiches/${id}`);
  };

  const handleEditFiche = (id) => {
    navigate(`/fiches/modification/${id}`);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {isAdmin ? 'Administration - ' : ''}Liste des fiches
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Rechercher une fiche..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <CircularProgress />
          </Box>
        ) : filteredFiches.length > 0 ? (
          <>
            <TableContainer>
              <Table aria-label="table des fiches">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Entreprise</strong></TableCell>
                    <TableCell><strong>Date de visite</strong></TableCell>
                    <TableCell><strong>Commentaires</strong></TableCell>
                    <TableCell><strong>Statut</strong></TableCell>
                    <TableCell><strong>Date de création</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredFiches
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((fiche) => (
                      <TableRow key={fiche.id}>
                        <TableCell>{fiche.entreprise?.raisonSociale || 'Non spécifiée'}</TableCell>
                        <TableCell>{new Date(fiche.dateVisite).toLocaleDateString('fr-FR')}</TableCell>
                        <TableCell>
                          {fiche.commentaires
                            ? fiche.commentaires.length > 50
                              ? `${fiche.commentaires.substring(0, 50)}...`
                              : fiche.commentaires
                            : 'Aucun commentaire'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={formatStatus(fiche.statut)}
                            color={getStatusColor(fiche.statut)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{new Date(fiche.dateCreation).toLocaleDateString('fr-FR')}</TableCell>
                        <TableCell>
                          <Tooltip title="Voir détails">
                            <IconButton
                              size="small"
                              onClick={() => handleViewFiche(fiche.id)}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Modifier">
                            <IconButton
                              size="small"
                              onClick={() => handleEditFiche(fiche.id)}
                            >
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
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredFiches.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Lignes par page"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
            />
          </>
        ) : (
          <Typography>Aucune fiche trouvée</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default FichesList;

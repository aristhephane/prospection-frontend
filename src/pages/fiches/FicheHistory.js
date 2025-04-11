import React, { useState, useEffect } from 'react';
import {
  Typography, Box, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, CircularProgress, Alert, Chip,
  TextField, InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

const FicheHistory = ({ isAdmin }) => {
  const [loading, setLoading] = useState(true);
  const [historique, setHistorique] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredHistorique, setFilteredHistorique] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistorique = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/fiches/historique`);
        if (response.data.success) {
          setHistorique(response.data.historique || []);
          setFilteredHistorique(response.data.historique || []);
        } else {
          setError(response.data.message || 'Erreur lors du chargement de l\'historique');
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'historique:', error);
        setError('Erreur lors du chargement de l\'historique');
      } finally {
        setLoading(false);
      }
    };

    fetchHistorique();
  }, []);

  // Filtrer l'historique lorsque le terme de recherche change
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredHistorique(historique);
    } else {
      const lowercasedFilter = searchTerm.toLowerCase();
      const filtered = historique.filter(item => {
        return (
          (item.utilisateur?.nom?.toLowerCase().includes(lowercasedFilter)) ||
          (item.utilisateur?.prenom?.toLowerCase().includes(lowercasedFilter)) ||
          (item.ficheEntreprise?.entreprise?.raisonSociale?.toLowerCase().includes(lowercasedFilter)) ||
          (item.typeModification?.toLowerCase().includes(lowercasedFilter)) ||
          (item.detailsModification?.toLowerCase().includes(lowercasedFilter))
        );
      });
      setFilteredHistorique(filtered);
    }
    setPage(0); // Revenir à la première page lors du filtrage
  }, [searchTerm, historique]);

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

  const getTypeModificationColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'création': return 'success';
      case 'modification': return 'primary';
      case 'suppression': return 'error';
      case 'validation': return 'info';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {isAdmin ? 'Administration - ' : ''}Historique des fiches
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Rechercher dans l'historique..."
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
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
        ) : filteredHistorique.length > 0 ? (
          <>
            <TableContainer>
              <Table aria-label="table de l'historique">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Date</strong></TableCell>
                    <TableCell><strong>Utilisateur</strong></TableCell>
                    <TableCell><strong>Entreprise</strong></TableCell>
                    <TableCell><strong>Type</strong></TableCell>
                    <TableCell><strong>Détails</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredHistorique
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{new Date(item.dateModification).toLocaleString('fr-FR')}</TableCell>
                        <TableCell>{`${item.utilisateur?.prenom || ''} ${item.utilisateur?.nom || ''}`}</TableCell>
                        <TableCell>{item.ficheEntreprise?.entreprise?.raisonSociale || 'Non spécifiée'}</TableCell>
                        <TableCell>
                          <Chip
                            label={item.typeModification || 'Inconnu'}
                            color={getTypeModificationColor(item.typeModification)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {item.detailsModification?.length > 100
                            ? `${item.detailsModification.substring(0, 100)}...`
                            : item.detailsModification || 'Aucun détail'
                          }
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={filteredHistorique.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Lignes par page"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
            />
          </>
        ) : (
          <Typography>Aucun historique trouvé</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default FicheHistory;

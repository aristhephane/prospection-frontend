import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box,
  Collapse
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Business as BusinessIcon,
  Search as SearchIcon,
  Add as AddIcon,
  ImportExport as ExportIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  BarChart as ChartIcon,
  History as HistoryIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

const drawerWidth = 240;

const Sidebar = ({ isOpen, onClose, isAdmin = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [fichesOpen, setFichesOpen] = useState(false);

  const toggleFichesMenu = () => {
    setFichesOpen(!fichesOpen);
  };

  const isActiveRoute = (route) => {
    return location.pathname === route;
  };

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={isOpen}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          <ListItem
            button
            onClick={() => navigate('/dashboard')}
            selected={isActiveRoute('/dashboard')}
          >
            <ListItemIcon>
              <DashboardIcon color={isActiveRoute('/dashboard') ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Tableau de bord" />
          </ListItem>

          <ListItem
            button
            onClick={toggleFichesMenu}
          >
            <ListItemIcon>
              <BusinessIcon color={(fichesOpen || location.pathname.includes('/fiches')) ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Fiches Entreprises" />
            {fichesOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </ListItem>

          <Collapse in={fichesOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                onClick={() => navigate('/fiches')}
                sx={{ pl: 4 }}
                selected={isActiveRoute('/fiches')}
              >
                <ListItemIcon>
                  <BusinessIcon color={isActiveRoute('/fiches') ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="Liste des fiches" />
              </ListItem>

              <ListItem
                button
                onClick={() => navigate('/fiches/new')}
                sx={{ pl: 4 }}
                selected={isActiveRoute('/fiches/new')}
              >
                <ListItemIcon>
                  <AddIcon color={isActiveRoute('/fiches/new') ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="Nouvelle fiche" />
              </ListItem>
            </List>
          </Collapse>

          <ListItem
            button
            onClick={() => navigate('/recherche')}
            selected={isActiveRoute('/recherche')}
          >
            <ListItemIcon>
              <SearchIcon color={isActiveRoute('/recherche') ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Recherche avancée" />
          </ListItem>

          <ListItem
            button
            onClick={() => navigate('/export')}
            selected={isActiveRoute('/export')}
          >
            <ListItemIcon>
              <ExportIcon color={isActiveRoute('/export') ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Export de données" />
          </ListItem>

          <ListItem
            button
            onClick={() => navigate('/notifications')}
            selected={isActiveRoute('/notifications')}
          >
            <ListItemIcon>
              <NotificationsIcon color={isActiveRoute('/notifications') ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Notifications" />
          </ListItem>

          {isAdmin && (
            <>
              <Divider />
              <ListItem
                button
                onClick={() => navigate('/admin/utilisateurs')}
                selected={isActiveRoute('/admin/utilisateurs')}
              >
                <ListItemIcon>
                  <PeopleIcon color={isActiveRoute('/admin/utilisateurs') ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="Gestion utilisateurs" />
              </ListItem>

              <ListItem
                button
                onClick={() => navigate('/admin/parametres')}
                selected={isActiveRoute('/admin/parametres')}
              >
                <ListItemIcon>
                  <SettingsIcon color={isActiveRoute('/admin/parametres') ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="Paramètres système" />
              </ListItem>

              <ListItem
                button
                onClick={() => navigate('/admin/statistiques')}
                selected={isActiveRoute('/admin/statistiques')}
              >
                <ListItemIcon>
                  <ChartIcon color={isActiveRoute('/admin/statistiques') ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="Statistiques" />
              </ListItem>

              <ListItem
                button
                onClick={() => navigate('/admin/activites')}
                selected={isActiveRoute('/admin/activites')}
              >
                <ListItemIcon>
                  <HistoryIcon color={isActiveRoute('/admin/activites') ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="Journal d'activités" />
              </ListItem>
            </>
          )}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar; 
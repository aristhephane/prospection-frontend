import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  ExitToApp as LogoutIcon,
  Settings as SettingsIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Header = ({ toggleSidebar, user, isAdmin = false }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('md'));

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Logique de déconnexion
    localStorage.removeItem('token');
    navigate('/login');
    handleClose();
  };

  const handleProfile = () => {
    navigate('/profile');
    handleClose();
  };

  const handleSettings = () => {
    navigate('/settings');
    handleClose();
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleSidebar}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Prospection App
        </Typography>

        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
            <Button color="inherit" onClick={() => navigate('/dashboard')}>
              Tableau de bord
            </Button>
            <Button color="inherit" onClick={() => navigate('/fiches')}>
              Fiches
            </Button>
            <Button color="inherit" onClick={() => navigate('/recherche')}>
              Recherche
            </Button>
            {isAdmin && (
              <Button color="inherit" onClick={() => navigate('/admin')}>
                Admin
              </Button>
            )}
          </Box>
        )}

        <IconButton color="inherit" aria-label="notifications" sx={{ mr: 2 }}>
          <NotificationsIcon />
        </IconButton>

        <Box>
          <IconButton
            size="large"
            aria-label="compte de l'utilisateur"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            {user?.avatar ? (
              <Avatar
                alt={`${user.prenom} ${user.nom}`}
                src={user.avatar}
                sx={{ width: 32, height: 32 }}
              />
            ) : (
              <AccountCircle />
            )}
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleProfile}>
              <PersonIcon fontSize="small" sx={{ mr: 1 }} />
              Profil
            </MenuItem>
            <MenuItem onClick={handleSettings}>
              <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
              Paramètres
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
              Déconnexion
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 
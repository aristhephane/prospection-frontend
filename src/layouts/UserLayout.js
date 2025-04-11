import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

// Material UI
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LogoutIcon from '@mui/icons-material/Logout';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';

// Icônes
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import SettingsIcon from '@mui/icons-material/Settings';
import AssessmentIcon from '@mui/icons-material/Assessment';

const drawerWidth = 280;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

// Mapper les icônes aux identifiants du menu
const getIcon = (iconName) => {
  switch (iconName) {
    case 'dashboard': return <DashboardIcon />;
    case 'description': return <DescriptionIcon />;
    case 'assessment': return <AssessmentIcon />;
    case 'settings': return <SettingsIcon />;
    case 'notifications': return <NotificationsIcon />;
    default: return <LayersIcon />;
  }
};

export default function UserLayout({ children }) {
  const [open, setOpen] = useState(true);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenus, setOpenMenus] = useState({});
  const [notificationCount, setNotificationCount] = useState(0);

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get('/api/interface/user-menu');
        setMenuItems(response.data.items || []);
      } catch (error) {
        console.error('Erreur lors du chargement du menu:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/notifications/count`);
        setNotificationCount(response.data.count || 0);
      } catch (error) {
        console.error('Erreur lors du chargement des notifications:', error);
      }
    };

    fetchMenu();
    fetchNotifications();
  }, []);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMenuClick = (id) => {
    setOpenMenus(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Récupérer les rôles de l'utilisateur pour l'affichage
  const userRoles = user?.roles || [];

  // Fonction pour formater le nom du rôle pour l'affichage
  const formatRoleName = (role) => {
    if (role.startsWith('ROLE_')) {
      const roleName = role.substring(5).toLowerCase();
      return roleName.charAt(0).toUpperCase() + roleName.slice(1);
    }
    return role;
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <AppBar position="absolute" open={open} sx={{ backgroundColor: '#273b8a' }}>
        <Toolbar sx={{ pr: '24px' }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{ marginRight: '36px', ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            Prospection UPJV
          </Typography>
          <IconButton color="inherit" component={Link} to="/notifications/liste">
            <Badge badgeContent={notificationCount} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            <Avatar sx={{ bgcolor: '#fff', color: '#273b8a', width: 32, height: 32 }}>
              {user?.prenom?.charAt(0) || 'U'}
            </Avatar>
            <Box sx={{ ml: 1 }}>
              <Typography variant="body2" color="inherit">
                {user?.prenom} {user?.nom}
              </Typography>
              <Typography variant="caption" color="inherit" sx={{ opacity: 0.8 }}>
                {userRoles.map(formatRoleName).join(', ')}
              </Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1],
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List component="nav">
            {menuItems.map((item) => (
              <React.Fragment key={item.id}>
                {item.children ? (
                  <>
                    <ListItem disablePadding>
                      <ListItemButton onClick={() => handleMenuClick(item.id)}>
                        <ListItemIcon>
                          {getIcon(item.icon)}
                        </ListItemIcon>
                        <ListItemText primary={item.title} />
                        {openMenus[item.id] ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                    </ListItem>
                    <Collapse in={openMenus[item.id]} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {item.children.map((child) => (
                          <ListItem key={child.id} disablePadding>
                            <ListItemButton
                              component={Link}
                              to={child.link}
                              selected={isActive(child.link)}
                              sx={{ pl: 4 }}
                            >
                              <ListItemText primary={child.title} />
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                  </>
                ) : (
                  <ListItem disablePadding>
                    <ListItemButton
                      component={Link}
                      to={item.link}
                      selected={isActive(item.link)}
                    >
                      <ListItemIcon>
                        {getIcon(item.icon)}
                      </ListItemIcon>
                      <ListItemText primary={item.title} />
                    </ListItemButton>
                  </ListItem>
                )}
              </React.Fragment>
            ))}
            <Divider sx={{ my: 1 }} />
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Déconnexion" />
              </ListItemButton>
            </ListItem>
          </List>
        )}
      </Drawer>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) => theme.palette.grey[100],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
} 
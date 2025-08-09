import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dynamic Form Builder
          </Typography>
          <Button
            color="inherit"
            onClick={() => navigate('/myforms')}
            sx={{ 
              fontWeight: isActive('/myforms') || isActive('/') ? 'bold' : 'normal',
              textDecoration: isActive('/myforms') || isActive('/') ? 'underline' : 'none'
            }}
          >
            My Forms
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate('/create')}
            sx={{ 
              fontWeight: isActive('/create') ? 'bold' : 'normal',
              textDecoration: isActive('/create') ? 'underline' : 'none'
            }}
          >
            Create Form
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate('/preview')}
            sx={{ 
              fontWeight: isActive('/preview') ? 'bold' : 'normal',
              textDecoration: isActive('/preview') ? 'underline' : 'none'
            }}
          >
            Preview
          </Button>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout;

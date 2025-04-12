import React from 'react';
import { Box, Grid, Typography, Link as MUILink, IconButton, Divider } from '@mui/material';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: '#111', color: 'white', pb: 4 }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2, pt:6 }}>
        <Grid container spacing={4}>
          {/* Szybkie linki */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Szybkie linki</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <MUILink component={RouterLink} to="/about" color="inherit" underline="hover">O nas</MUILink>
              <MUILink component={RouterLink} to="/contact" color="inherit" underline="hover">Kontakt</MUILink>
              <MUILink component={RouterLink} to="/privacy-policy" color="inherit" underline="hover">Polityka prywatności</MUILink>
            </Box>
          </Grid>

          {/* Kontakt */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Kontakt</Typography>
            <Typography variant="body2">Email: <MUILink href="mailto:kontakt@example.com" color="inherit" underline="hover">kontakt@example.com</MUILink></Typography>
            <Typography variant="body2">Telefon: +48 123 456 789</Typography>
          </Grid>

          {/* Social Media */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Śledź nas</Typography>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'center', } }}>
              <IconButton href="#" color="inherit" aria-label="Facebook"><FaFacebook /></IconButton>
              <IconButton href="#" color="inherit" aria-label="Twitter"><FaTwitter /></IconButton>
              <IconButton href="#" color="inherit" aria-label="Instagram"><FaInstagram /></IconButton>
              <IconButton href="#" color="inherit" aria-label="LinkedIn"><FaLinkedin /></IconButton>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />

        <Typography variant="body2" align="center" sx={{ opacity: 0.7 }}>
          &copy; {new Date().getFullYear()} MiUn. Wszelkie prawa zastrzeżone.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;

import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Link as MUILink,
  IconButton,
  Divider,
  Container
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Email,
  Phone
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  const socialLinks = [
    { icon: <Facebook />, label: "Facebook", href: "#" },
    { icon: <Twitter />, label: "Twitter", href: "#" },
    { icon: <Instagram />, label: "Instagram", href: "#" },
    { icon: <LinkedIn />, label: "LinkedIn", href: "#" },
  ];

  const quickLinks = [
    { text: "O nas", to: "/about" },
    { text: "Kontakt", to: "/contact" },
    { text: "Polityka prywatności", to: "/privacy-policy" },
    { text: "Warunki korzystania", to: "/terms" },
  ];

  const contactInfo = [
    { icon: <Email sx={{ mr: 1 }} />, text: "kontakt@example.com", href: "mailto:kontakt@example.com" },
    { icon: <Phone sx={{ mr: 1 }} />, text: "+48 123 456 789", href: "tel:+48123456789" },
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#000',
        color: '#fff',
        pt: 8,
        pb: 4,
        borderTop: '1px solid #444',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6} justifyContent="center">
          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: 700, color: '#fff', textAlign: 'center' }}
            >
              Szybkie linki
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'center' }}>
              {quickLinks.map((link, index) => (
                <motion.div
                  key={index}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MUILink
                    component={RouterLink}
                    to={link.to}
                    color="#ccc"
                    underline="none"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'color 0.3s',
                      '&:hover': {
                        color: '#fff',
                      }
                    }}
                  >
                    {link.text}
                  </MUILink>
                </motion.div>
              ))}
            </Box>
          </Grid>

          {/* Contact */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: 700, color: '#fff', textAlign: 'center' }}
            >
              Kontakt
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
              {contactInfo.map((info, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: '#ccc',
                  }}
                >
                  {info.icon}
                  <MUILink
                    href={info.href}
                    color="#ccc"
                    underline="hover"
                    sx={{
                      transition: 'color 0.3s',
                      '&:hover': {
                        color: '#fff',
                      }
                    }}
                  >
                    {info.text}
                  </MUILink>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Social Media */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: 700, color: '#fff', textAlign: 'center' }}
            >
              Śledź nas
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              {socialLinks.map((social, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <IconButton
                    href={social.href}
                    aria-label={social.label}
                    sx={{
                      color: '#fff',
                      backgroundColor: '#222',
                      '&:hover': {
                        backgroundColor: '#444',
                      },
                      transition: 'all 0.3s',
                    }}
                  >
                    {social.icon}
                  </IconButton>
                </motion.div>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Divider
          sx={{
            my: 6,
            backgroundColor: '#444',
          }}
        />

        <Typography
          variant="body2"
          align="center"
          sx={{
            color: '#ccc',
            mt: 4,
          }}
        >
          &copy; {new Date().getFullYear()} NineWonders. Wszelkie prawa zastrzeżone.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;

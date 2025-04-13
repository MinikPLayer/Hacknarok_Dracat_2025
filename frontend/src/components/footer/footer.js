import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Link as MUILink,
  IconButton,
  Divider,
  Container,
  useTheme
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
  const theme = useTheme();

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
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        pt: 8,
        pb: 4,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: theme.palette.primary.main,
              }}
            >
              Szybkie linki
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {quickLinks.map((link, index) => (
                <motion.div
                  key={index}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MUILink
                    component={RouterLink}
                    to={link.to}
                    color="text.secondary"
                    underline="none"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'color 0.3s',
                      '&:hover': {
                        color: theme.palette.primary.main,
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
              sx={{
                fontWeight: 700,
                color: theme.palette.primary.main,
              }}
            >
              Kontakt
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {contactInfo.map((info, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: theme.palette.text.secondary,
                  }}
                >
                  {info.icon}
                  <MUILink
                    href={info.href}
                    color="inherit"
                    underline="hover"
                    sx={{
                      transition: 'color 0.3s',
                      '&:hover': {
                        color: theme.palette.primary.main,
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
              sx={{
                fontWeight: 700,
                color: theme.palette.primary.main,
              }}
            >
              Śledź nas
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 1,
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
                      color: theme.palette.text.secondary,
                      backgroundColor: theme.palette.action.hover,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
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
            backgroundColor: theme.palette.divider,
          }}
        />

        <Typography
          variant="body2"
          align="center"
          sx={{
            color: theme.palette.text.secondary,
            opacity: 0.8,
          }}
        >
          &copy; {new Date().getFullYear()} MiUn. Wszelkie prawa zastrzeżone.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
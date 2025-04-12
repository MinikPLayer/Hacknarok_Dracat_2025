import {useTheme} from "@mui/material/styles";
import CheckCircle from '@mui/icons-material/CheckCircle';
import ChatIcon from '@mui/icons-material/Chat';
import React from 'react';
import {Box, Button, Container, Paper, Stack, Typography, useMediaQuery} from "@mui/material";

const features = [
  {
    icon: <CheckCircle size={48} color="#1976d2" />,
    title: "Bezproblemowa rekrutacja",
    description: "Sprawdź progi punktowe, znajdź idealny kierunek i śledź ważne terminy. Dzięki MiUn rekrutacja staje się prostsza niż kiedykolwiek!"
  },
  {
    icon: <ChatIcon size={48} color="#2e7d32" />,
    title: "Forum studenckie",
    description: "Poznaj innych studentów, wymieniaj się doświadczeniami i ogłoszeniami. Organizuj wspólne wyjścia i dziel się poradami."
  },

];



const Homepage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(16deg,rgba(112, 198, 212, 0.4) 0%, rgba(219, 72, 212, 0.37) 100%)',
        py: 8,
        px: 2
      }}
    >
      <Container maxWidth="md">
        <Typography variant={isMobile ? 'h4' : 'h3'} fontWeight="bold" textAlign="center" gutterBottom>
          MiUn – Twoje studia pod kontrolą
        </Typography>

        <Typography variant="h6" color="text.secondary" paragraph textAlign="center">
          Aplikacja stworzona z myślą o studentach i kandydatów na studia. Organizuj swój plan zajęć, poznawaj ludzi i miej dostęp do najważniejszych informacji w jednym miejscu.
        </Typography>

        <Box display="flex" justifyContent="center" my={4}>
          <Button variant="contained" size="large" sx={{ px: 4, py: 1.5 }}>
            Dołącz do MiUn
          </Button>
        </Box>

        <Stack spacing={4}>
          {features.map((feature, index) => (
            <Paper
              key={index}
              elevation={3}
              sx={{
                p: 4,
                textAlign: 'center',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: 6
                }
              }}
            >
              <Box mb={2}>{feature.icon}</Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {feature.title}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {feature.description}
              </Typography>
            </Paper>
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default Homepage;
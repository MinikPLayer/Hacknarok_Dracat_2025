import React from 'react';
import {
  Container,
  Grid,
  Typography,
  Paper,
  IconButton,
  Box
} from '@mui/material';
import {
  Facebook,
  Twitter,
  LinkedIn,
} from '@mui/icons-material';

const WorldResults = () => {
  // Przykładowe dane
  const modelResult = "Wynik modelu: 85% dopasowania do wzorca podróży kosmicznej";
  const aiSummary = "Podsumowanie trasy: Twoja podróż przez 9 światów obejmuje przelot przez mgławice, lądowanie na księżycach gazowych olbrzymów i eksplorację starożytnych ruin kosmicznych.";
  const colors = [
    '#f44336', '#e91e63', '#9c27b0',
    '#2196f3', '#009688', '#4caf50',
    '#ffeb3b', '#ff9800', '#795548'
  ];


  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        {/* Sekcja wyników modelu */}

        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Analiza Podróży Kosmicznej
          </Typography>
          <Paper elevation={3} sx={{ p: 2, bgcolor: '#f5f5f5' }}>
            <Typography variant="body1">{modelResult}</Typography>
          </Paper>
        </Grid>

        {/* Karty 9 światów */}
        {colors.map((color, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                minHeight: 150,
                backgroundColor: color,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Typography variant="h6">Świat #{index + 1}</Typography>
            </Paper>
          </Grid>
        ))}

        {/* Podsumowanie AI */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2, bgcolor: '#e8f5e9' }}>
            <Typography variant="h6" gutterBottom>
              AI Podsumowanie Trasy
            </Typography>
            <Typography variant="body1">{aiSummary}</Typography>
          </Paper>
        </Grid>

        {/* Karta udostępniania */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6">Udostępnij swoją podróż</Typography>
              <Box>
                <IconButton aria-label="facebook">
                  <Facebook />
                </IconButton>
                <IconButton aria-label="twitter">
                  <Twitter />
                </IconButton>
                <IconButton aria-label="linkedin">
                  <LinkedIn />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default WorldResults;
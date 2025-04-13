import React, {useEffect, useState} from 'react';
import {
  Container,
  Typography,
  Paper,
  IconButton,
  Box,
  Button,
  Chip
} from '@mui/material';
import {
  Facebook,
  Twitter,
  LinkedIn,
  ContentCopy,
  PhotoCamera
} from '@mui/icons-material';
import { Carousel, Col, Row, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import client from "../../client";
import {API_BASE_URL} from "../../config";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';

const WorldResult = () => {


  const [samplePhotos] = useState([
    { url: 'https://www.sheba.pl/sites/g/files/fnmzdf7906/files/2023-03/co-moze-jesc-kot_-produkty-ktore-smialo-mozesz-wcielic-do-jego-diety_optimized_1597650834564_0.jpeg', caption: 'Neonowe miasta Vega Prime' },
    { url: 'https://www.sheba.pl/sites/g/files/fnmzdf7906/files/2023-03/co-moze-jesc-kot_-produkty-ktore-smialo-mozesz-wcielic-do-jego-diety_optimized_1597650834564_0.jpeg', caption: 'Lodowe jaskinie Krios VII' },
    { url: 'https://www.sheba.pl/sites/g/files/fnmzdf7906/files/2023-03/co-moze-jesc-kot_-produkty-ktore-smialo-mozesz-wcielic-do-jego-diety_optimized_1597650834564_0.jpeg', caption: 'Mgławica Kwantowego Pyłu' },
    { url: 'https://www.sheba.pl/sites/g/files/fnmzdf7906/files/2023-03/co-moze-jesc-kot_-produkty-ktore-smialo-mozesz-wcielic-do-jego-diety_optimized_1597650834564_0.jpeg', caption: 'Ruiny Cywilizacji Xenthor' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [response, setResponse] = useState('');
  const token = localStorage.getItem("access");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await client.get(API_BASE_URL + 'generate/', {
          headers: {
                    Authorization: `Bearer ${token}`,
                },
        });
        setResponse(res.data.response);
      } catch (error) {
        console.error(error);
        setResponse('Something went wrong.');
      }
    };

    if(!response){
      fetchData();
    }

  }, [prompt]); // Dependency array - runs when `prompt` changes


  const handleImageClick = (index) => {
    setSelectedImage(samplePhotos[index]);
    setShowModal(true);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Row className="g-4">
        {/* Sekcja generowania treści */}
        <Col md={6}>
          <Typography variant="h4" gutterBottom>
            Podziel się swoją podróżą z innymi!
          </Typography>

          <Paper sx={{ p: 3, mb: 3, bgcolor: '#f0f4ff' }}>
            <Box display="flex" alignItems="center" mb={2}>
              <PhotoCamera sx={{ mr: 1 }} />
              <Typography variant="h6">Zdjęcia z trasy (4/9 światów)</Typography>
            </Box>

            <Carousel fade indicators={false}>
              {samplePhotos?.map((photo, index) => (
                <Carousel.Item key={index}>
                  <img
                    className="d-block w-100"
                    src={photo.url}
                    alt={photo.caption}
                    style={{
                      height: '300px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleImageClick(index)}
                  />
                  <Carousel.Caption>
                    <p>{photo.caption}</p>
                  </Carousel.Caption>
                </Carousel.Item>
              ))}
            </Carousel>

            <Row className="mt-3 g-2">
              {samplePhotos?.map((photo, index) => (
                <Col xs={3} key={index}>
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="img-thumbnail"
                    style={{
                      height: '80px',
                      objectFit: 'cover',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleImageClick(index)}
                  />
                </Col>
              ))}
            </Row>
          </Paper>

          <Modal
            show={showModal}
            onHide={() => setShowModal(false)}
            size="lg"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>{selectedImage?.caption}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedImage && (
                <img
                  src={selectedImage.url}
                  alt={selectedImage.caption}
                  style={{
                    width: '100%',
                    height: '60vh',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                />
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowModal(false)}
              >
                Zamknij
              </Button>
            </Modal.Footer>
          </Modal>

          <Paper sx={{ p: 3, bgcolor: '#fff3e0' }}>
            <Typography variant="h6" gutterBottom>
              AI Podsumowanie Trasy
            </Typography>
            <Typography paragraph>{response}</Typography>
            <Chip label="Poziom zaawansowania: Kosmiczny Wędrowiec" color="primary" />
          </Paper>
        </Col>

        {/* Podgląd postu społecznościowego */}
        <Col md={6}>
          <Col md={6}>
  <Paper sx={{
    p: 3,
    border: '2px solid #e0e0e0',
    borderRadius: 2,
    background: 'linear-gradient(45deg, #1a237e 30%, #0d47a1 90%)',
    color: 'white'
  }}>
    <Typography variant="h5" gutterBottom>
      Statystyki Twojej trasy
    </Typography>

    <Box sx={{
      display: 'flex',
      justifyContent: 'space-between',
      mb: 3,
      p: 2,
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderRadius: 2
    }}>
      <Box textAlign="center">
        <Typography variant="h6">12.7 km</Typography>
        <Typography variant="caption">Dystans</Typography>
      </Box>
      <Box textAlign="center">
        <Typography variant="h6">2h 45m</Typography>
        <Typography variant="caption">Czas</Typography>
      </Box>
      <Box textAlign="center">
        <Typography variant="h6">8/10</Typography>
        <Typography variant="caption">Ocena</Typography>
      </Box>
    </Box>

    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" gutterBottom>Najciekawsze punkty:</Typography>
      <ul style={{ paddingLeft: 20 }}>
        <li><Typography>Zabytkowa starówka (30 min)</Typography></li>
        <li><Typography>Muzeum Techniki (45 min)</Typography></li>
        <li><Typography>Park Królewski (1h 15min)</Typography></li>
      </ul>
    </Box>

    <Box sx={{
      backgroundColor: 'rgba(255,255,255,0.1)',
      p: 2,
      borderRadius: 2,
      mb: 3
    }}>
      <Typography variant="subtitle1" gutterBottom>Twoje osiągnięcia:</Typography>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Chip
          label="Odkrywca"
          color="success"
          icon={<EmojiEventsIcon fontSize="small" />}
        />
        <Chip
          label="Maratoner"
          color="warning"
          icon={<DirectionsWalkIcon fontSize="small" />}
        />
      </Box>
    </Box>

    <Box sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      mt: 2
    }}>
      <Box>
        <Chip label="#OptymalnaTrasa" sx={{ mr: 1 }} />
        <Chip label="#Zwiedzanie" />
      </Box>
      <Typography variant="caption">
        {new Date().toLocaleDateString()}
      </Typography>
    </Box>
  </Paper>
</Col>

          <Paper sx={{ p: 2, mt: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body1">
                Udostępnij swoją przygodę:
              </Typography>
              <Box>
                <IconButton onClick={() => alert('Funkcjonalność w budowie!')}>
                  <Facebook sx={{ color: '#1877f2' }} />
                </IconButton>
                <IconButton onClick={() => alert('Funkcjonalność w budowie!')}>
                  <Twitter sx={{ color: '#1da1f2' }} />
                </IconButton>
                <IconButton onClick={() => alert('Funkcjonalność w budowie!')}>
                  <LinkedIn sx={{ color: '#0a66c2' }} />
                </IconButton>
                <Button
                  variant="contained"
                  startIcon={<ContentCopy />}
                  sx={{ ml: 1 }}
                >
                  Kopiuj
                </Button>
              </Box>
            </Box>
          </Paper>
        </Col>
      </Row>
    </Container>
  );
};

export default WorldResult;
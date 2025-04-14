import React, { useEffect, useState } from 'react';
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
  PhotoCamera,
  ChevronLeft,
  ChevronRight
} from '@mui/icons-material';
import { Carousel, Col, Row, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './worldResult.css';
import client from "../../client";
import {API_BASE_URL} from "../../config";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';

const WorldResult = () => {
  const [samplePhotos] = useState([
    {
      url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=800&auto=format&fit=crop',
      caption: 'Neonowe miasta Vega Prime'
    },
    {
      url: 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=800&auto=format&fit=crop',
      caption: 'Lodowe jaskinie Krios VII'
    },
    {
      url: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?q=80&w=800&auto=format&fit=crop',
      caption: 'Mgławica Kwantowego Pyłu'
    },
    {
      url: 'https://mycitytrip.net/blog/uploads/20231022/copan-ruins2_9gFybG.jpeg',
      caption: 'Ruiny Cywilizacji Xenthor'
    },
    {
      url: 'https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?q=80&w=800&auto=format&fit=crop',
      caption: 'Wodospady Endora'
    },
    {
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
      caption: 'Pustynia Tatooine'
    },
    {
      url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAowQDdSKjNAJxGw46jM4MWPdyB8YjpvDXJA&s',
      caption: 'Wulkan Mustafar'
    },
    {
      url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=800&auto=format&fit=crop',
      caption: 'Zakazany Las'
    },
    {
      url: 'https://images.unsplash.com/photo-1531256456869-ce942a665e80?q=80&w=800&auto=format&fit=crop',
      caption: 'Stolica Imperium'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ url: string; caption: string } | null>(null);
  const [response, setResponse] = useState('');
  const [currentPhotoSet, setCurrentPhotoSet] = useState(0);
  const token = localStorage.getItem("access");

  // Split photos into sets of 4 for display
  const photoSets = [];
  for (let i = 0; i < samplePhotos.length; i += 4) {
    photoSets.push(samplePhotos.slice(i, i + 4));
  }

  const shareToSocial = (platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin') => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Sprawdź moją trasę na kampusie!');
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        break;
      case 'instagram':
        navigator.clipboard.writeText(window.location.href).then(() => alert('Link skopiowany! Wklej go w Instagramie.'));
        return;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
    }
    window.open(shareUrl, '_blank');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await client.get(API_BASE_URL + 'generate/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setResponse(res.data);
      } catch (error) {
        console.error(error);
        setResponse('Something went wrong.');
      }
    };

    if(!response){
      fetchData();
    }
  }, [response, token]);

  const handleImageClick = (index: number) => {
    const globalIndex = currentPhotoSet * 4 + index;
    setSelectedImage(samplePhotos[globalIndex]);
    setShowModal(true);
  };

  const handleShare = (platform: string) => {
    alert(`Sharing to ${platform} - functionality in development!`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    alert('Content copied to clipboard!');
  };

  const nextPhotoSet = () => {
    setCurrentPhotoSet((prev) => (prev < photoSets.length - 1 ? prev + 1 : 0));
  };

  const prevPhotoSet = () => {
    setCurrentPhotoSet((prev) => (prev > 0 ? prev - 1 : photoSets.length - 1));
  };

  return (
    <Container maxWidth="lg" className="world-result-container">
      <Row className="g-4">
        {/* Content Generation Section */}
        <Col md={6}>
          <Typography variant="h4" gutterBottom sx={{ color: '#3a1c71', fontWeight: 'bold' }}>
            Podziel się swoją podróżą z innymi!
          </Typography>

          <Paper className="content-section">
            <Box display="flex" alignItems="center" mb={2}>
              <PhotoCamera sx={{ mr: 1, color: '#d76d77' }} />
              <Typography variant="h6" sx={{ color: '#3a1c71' }}>
                Zdjęcia z trasy ({samplePhotos.length}/9 światów)
                <Box className="progress-container">
                  <Box className="progress-bar" style={{ width: `${(samplePhotos.length / 9) * 100}%` }} />
                </Box>
              </Typography>
            </Box>

            <Carousel fade indicators={false}>
              {photoSets[currentPhotoSet]?.map((photo, index) => (
                <Carousel.Item key={index}>
                  <img
                    className="carousel-image"
                    src={photo.url}
                    alt={photo.caption}
                    onClick={() => handleImageClick(index)}
                  />
                  <Carousel.Caption>
                    <p>{photo.caption}</p>
                  </Carousel.Caption>
                </Carousel.Item>
              ))}
            </Carousel>

            <Box display="flex" justifyContent="space-between" mt={2}>
              <IconButton onClick={prevPhotoSet} sx={{ color: '#3a1c71' }}>
                <ChevronLeft fontSize="large" />
              </IconButton>
              <Box className="thumbnail-container">
                {photoSets[currentPhotoSet]?.map((photo, index) => (
                  <img
                    key={index}
                    src={photo.url}
                    alt={photo.caption}
                    className="thumbnail"
                    onClick={() => handleImageClick(index)}
                  />
                ))}
              </Box>
              <IconButton onClick={nextPhotoSet} sx={{ color: '#3a1c71' }}>
                <ChevronRight fontSize="large" />
              </IconButton>
            </Box>
          </Paper>

          <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
            <Modal.Header closeButton style={{ background: '#3a1c71', color: 'white' }}>
              <Modal.Title>{selectedImage?.caption}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {selectedImage && (
                <img
                  src={selectedImage.url}
                  alt={selectedImage.caption}
                  className="modal-image"
                />
              )}
            </Modal.Body>
            <Modal.Footer style={{ background: '#f5f7fa' }}>
              <Button 
                variant="contained" 
                onClick={() => setShowModal(false)}
                style={{ background: '#d76d77' }}
              >
                Zamknij
              </Button>
            </Modal.Footer>
          </Modal>

          <Paper className="ai-summary">
            <Typography variant="h6" gutterBottom sx={{ color: '#d76d77', fontWeight: 'bold' }}>
              AI Podsumowanie Trasy
            </Typography>
            <Typography sx={{ color: '#5d4037' }}>{response}</Typography>
          
          </Paper>
        </Col>

        {/* Social Post Preview Section */}
        <Col md={6}>
          <Paper className="stats-card">
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Statystyki Twojej trasy
            </Typography>

            <Box className="stats-grid">
              <Box className="stat-item">
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>12.7 km</Typography>
                <Typography variant="caption">Dystans</Typography>
              </Box>
              <Box className="stat-item">
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>2h 45m</Typography>
                <Typography variant="caption">Czas</Typography>
              </Box>
              <Box className="stat-item">
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>8/10</Typography>
                <Typography variant="caption">Ocena</Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Najciekawsze punkty:
              </Typography>
              <ul className="highlights-list">
                <li>Zabytkowa starówka (30 min)</li>
                <li>Muzeum Techniki (45 min)</li>
                <li>Park Królewski (1h 15min)</li>
              </ul>
            </Box>

            <Box className="achievements-section">
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Twoje osiągnięcia:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label="Odkrywca"
                  sx={{ 
                    background: 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)',
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                  icon={<EmojiEventsIcon fontSize="small" sx={{ color: 'white' }} />}
                />
                <Chip
                  label="Maratoner"
                  sx={{ 
                    background: 'linear-gradient(135deg, #ff9800 0%, #ffc107 100%)',
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                  icon={<DirectionsWalkIcon fontSize="small" sx={{ color: 'white' }} />}
                />
                <Chip
                  label={`Zdobywca ${samplePhotos.length} światów`}
                  sx={{ 
                    background: 'linear-gradient(135deg, #9c27b0 0%, #e91e63 100%)',
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                />
              </Box>
            </Box>

            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 2
            }}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  label="#OptymalnaTrasa" 
                  sx={{ 
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 'bold'
                  }} 
                />
                <Chip 
                  label="#Zwiedzanie" 
                  sx={{ 
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 'bold'
                  }} 
                />
              </Box>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                {new Date().toLocaleDateString()}
              </Typography>
            </Box>
          </Paper>

          <Paper className="social-share">
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#3a1c71' }}>
                Udostępnij swoją przygodę:
              </Typography>
              <Box>
                 <IconButton onClick={() => shareToSocial('facebook')} aria-label="Udostępnij na Facebooku">
                    <FaFacebook color="#1877f2" size={24} />
                  </IconButton>
                  <IconButton onClick={() => shareToSocial('twitter')} aria-label="Udostępnij na Twitterze">
                    <FaTwitter color="#1da1f2" size={24} />
                  </IconButton>
                  <IconButton onClick={() => shareToSocial('instagram')} aria-label="Udostępnij na Instagramie">
                    <FaInstagram color="#e1306c" size={24} />
                  </IconButton>
                  <IconButton onClick={() => shareToSocial('linkedin')} aria-label="Udostępnij na LinkedIn">
                    <FaLinkedin color="#0a66c2" size={24} />
                  </IconButton>
                <Button
                  variant="contained"
                  startIcon={<ContentCopy />}
                  sx={{ 
                    ml: 1,
                    background: 'linear-gradient(135deg, #3a1c71 0%, #d76d77 100%)',
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                  onClick={handleCopy}
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
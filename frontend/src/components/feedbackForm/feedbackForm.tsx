import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Rating,
  TextField,
  Typography,
  useTheme,
  styled
} from '@mui/material';
import {Upload as UploadIcon, CheckCircle, Star} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const GradientCard = styled(Card)(({ theme }) => ({
  borderRadius: '24px',
  boxShadow: theme.shadows[10],
  maxWidth: '600px',
  margin: '2rem auto',
  position: 'relative',
  overflow: 'visible',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.main} 100%)`,
    borderRadius: '24px',
    zIndex: -1
  }
}));

const FeedbackForm = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [rating, setRating] = useState<number | null>(0);
  const [comment, setComment] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Symulacja przesyłania danych i naliczania punktów
    const calculatedPoints = (rating || 0) * 50 + (comment.length > 10 ? 100 : 0);
    setPointsEarned(calculatedPoints);
    setIsSubmitted(true);
  };

  const handleNewRoute = () => {
    setIsSubmitted(false);
    setRating(0);
    setComment('');
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.light} 100%)`,
        display: 'flex',
        alignItems: 'center',
        padding: 2
      }}
    >
      <GradientCard>
        <CardContent>
          {!isSubmitted ? (
            <>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                Share Your Experience
              </Typography>

              <form onSubmit={handleSubmit}>
                <Box mb={4}>
                  <Typography variant="h6">Rating</Typography>
                  <Rating
                    name="rating"
                    value={rating}
                    onChange={(_, newValue) => setRating(newValue)}
                    size="large"
                    sx={{ fontSize: '2.5rem' }}
                  />
                </Box>

                <Box mb={4}>
                  <Typography variant="h6">Upload Recording</Typography>
                  <input
                    accept="audio/*"
                    style={{ display: 'none' }}
                    id="upload-file"
                    type="file"
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="upload-file">
                    <Button
                      variant="contained"
                      component="span"
                      startIcon={<UploadIcon />}
                      sx={{ mt: 1 }}
                    >
                      Choose File
                    </Button>
                  </label>

                  {selectedFile && (
                    <Box mt={2}>
                      <Typography variant="body2">
                        Selected file: {selectedFile.name}
                      </Typography>
                    </Box>
                  )}

                  {previewUrl && (
                    <Box mt={2}>
                      <audio controls src={previewUrl}>
                        Your browser does not support the audio element.
                      </audio>
                    </Box>
                  )}
                </Box>

                <Box mb={4}>
                  <TextField
                    label="Your Feedback"
                    multiline
                    rows={4}
                    fullWidth
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    variant="filled"
                    sx={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                    }}
                  />
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  size="large"
                  fullWidth
                  sx={{ py: 1.5 }}
                >
                  Submit Review
                </Button>
              </form>
            </>
          ) : (
            <Box textAlign="center" py={4}>
              <CheckCircle sx={{ fontSize: 80, mb: 2 }} />

              <Typography variant="h4" gutterBottom>
                Dziękujemy!
              </Typography>
              <Typography variant="h6" sx={{ mb: 4 }}>
                + {pointsEarned} <Star/>
              </Typography>

              <Box display="flex" gap={2} justifyContent="center">
                <Button
                  variant="outlined"
                  color="secondary"
                  size="large"
                  onClick={() => navigate('/form')}
                  sx={{}}
                >
                  Nowa trasa
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={() => navigate('/main')}
                >
                  Wróć do menu
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </GradientCard>
    </Box>
  );
};

export default FeedbackForm;
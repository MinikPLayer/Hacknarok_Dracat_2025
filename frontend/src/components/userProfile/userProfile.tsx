import React, {useCallback, useEffect, useState} from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FaMedal, FaTrophy, FaStar, FaCrown, FaLink, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  TextField,
  useMediaQuery,
  useTheme,
  IconButton,
  Chip,
  CircularProgress
} from "@mui/material";
import QRCode from "react-qr-code";
import Cropper from "react-easy-crop";
import { styled } from '@mui/system';
import client from '../../client';
import { API_BASE_URL } from '../../config';
import {FaPencil} from "react-icons/fa6";

// Styled components
const ProfileContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  padding: '16px',
  '@media (min-width: 960px)': {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
}));

const ProfileCard = styled(Box)(() => ({
  borderRadius: '16px',
  padding: '16px',
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#ffffff', // Zastąpiono theme.palette.background.paper
  flex: 1,
  minWidth: 0,
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
    transform: 'translateY(-2px)',
  },
}));

const StatsCard = styled(ProfileCard)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
}));

const AchievementIcon = styled(IconButton)(() => ({
  background: 'linear-gradient(45deg, #1976d2, #ff4081)', // Zastąpiono theme.palette.primary.main i theme.palette.secondary.main
  color: '#ffffff', // Zastąpiono theme.palette.common.white
  '&:hover': {
    background: 'linear-gradient(45deg, #ff4081, #1976d2)', // Odwrócony gradient
  },
}));

const SocialIcon = styled(IconButton)(() => ({
  color: '#757575', // Zastąpiono theme.palette.text.secondary
  transition: 'all 0.3s',
  '&:hover': {
    transform: 'scale(1.2)',
    color: '#1976d2', // Zastąpiono theme.palette.primary.main
  },
}));

const BioTextArea = styled(TextField)(() => ({
  width: '100%',
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#f5f5f5', // Zastąpiono theme.palette.background.default
  },
}));

// Interfaces
interface UserData {
  id?: string;
  username?: string;
  email?: string;
  telephone?: string;
  address?: string;
  rank?: string;
  title?: string;
  bio?: string;
  profile_picture?: string;
  friends?: string[];
  name?: string;
  surname?: string;
  social_media?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

interface VisitData {
  month: string;
  visits: number;
}

interface GenreData {
  name: string;
  value: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

async function getCroppedImg(imageSrc: string, croppedAreaPixels: { x: number; y: number; width: number; height: number }) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = imageSrc;
        image.crossOrigin = "anonymous";

        image.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            if (!ctx) {
                return reject(new Error("Nie można uzyskać kontekstu canvas"));
            }

            canvas.width = croppedAreaPixels.width;
            canvas.height = croppedAreaPixels.height;

            ctx.drawImage(
                image,
                croppedAreaPixels.x, croppedAreaPixels.y,
                croppedAreaPixels.width, croppedAreaPixels.height,
                0, 0,
                canvas.width, canvas.height
            );

            canvas.toBlob((blob) => {
                if (!blob) {
                    return reject(new Error("Błąd konwersji obrazu"));
                }
                resolve(blob);
            }, "image/png");
        };

        image.onerror = (error) => reject(error);
    });
}

const UserProfile = ({ isOwnProfile }: { isOwnProfile: boolean }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [profileImage, setProfileImage] = useState<string>('/images/basic/user_no_picture.png');
  const [friends, setFriends] = useState<string[]>(['Jan Kowalski', 'Anna Nowak', 'Piotr Zieliński']);
  const [qrCodeValue, setQrCodeValue] = useState('');
  const [hover, setHover] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [crop, setCrop] = useState({x: 0, y: 0});
  const [zoom, setZoom] = useState(1);
  const [showCropModal, setShowCropModal] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("access");

  // Mock data
  const monthlyVisits: VisitData[] = [
    { month: 'Sty', visits: 40 },
    { month: 'Lut', visits: 30 },
    { month: 'Mar', visits: 50 },
    { month: 'Kwi', visits: 70 },
    { month: 'Maj', visits: 90 },
  ];

  const genreData: GenreData[] = [
    { name: 'Fantasy', value: 40 },
    { name: 'Sci-Fi', value: 30 },
    { name: 'Horror', value: 20 },
    { name: 'Historyczne', value: 10 },
  ];

  const onCropComplete = useCallback(
    (_: { x: number; y: number; width: number; height: number }, croppedAreaPixels: { x: number; y: number; width: number; height: number }) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const formData = new FormData();
      formData.append("profile_picture", croppedBlob as Blob);

      const response = await client.post(`${API_BASE_URL}user/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const newImage = response.data.profile_picture;
      setProfileImage(newImage);
      localStorage.setItem('profile_picture', newImage);
      setShowCropModal(false);
    } catch (error) {
      console.error('Błąd podczas aktualizacji avatara:', error);
    }
  };

  useEffect(() => {
    if (userData?.friends && userData.friends.length > 0) {
      setFriends(userData.friends);
    }
  }, [userData]);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const storedImage = localStorage.getItem('profile_picture');
        if (storedImage) {
          setProfileImage(storedImage);
        }

        const response = await client.get(`${API_BASE_URL}/user/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(response.data);
        const image = response.data.profile_picture || '/images/basic/user_no_picture.png';
        setProfileImage(image);
        localStorage.setItem('profile_picture', image);
      } catch (error) {
        console.error('Błąd podczas pobierania danych użytkownika:', error);
        setProfileImage('/images/basic/user_no_picture.png');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUserData();
    }
  }, [token]);

  useEffect(() => {
    if (isOwnProfile && userData?.id) {
      setQrCodeValue(`${API_BASE_URL}add-friend/${userData.id}`);
    } else {
      setQrCodeValue(`${API_BASE_URL}add-friend/4`);
    }
  }, [isOwnProfile, userData?.id]);

  const handleBioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData(prev => prev ? { ...prev, bio: e.target.value } : null);
  };

  const handleChallengeClick = () => {
    alert('Wysłano wyzwanie!');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(qrCodeValue)
      .then(() => alert('Link został skopiowany do schowka!'))
      .catch(() => alert('Błąd podczas kopiowania linku!'));
  };

  const handleSocialMediaClick = (platform: string) => {
    const url = userData?.social_media?.[platform as keyof typeof userData.social_media];
    if (url) {
      window.open(url, '_blank');
    } else {
      alert(`Brak linku do ${platform.charAt(0).toUpperCase() + platform.slice(1)}`);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ProfileContainer>
      {/* Left Column - Profile Info */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
        <ProfileCard>
          <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} gap={3}>
            <Box position="relative" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
              <Avatar
                src={profileImage}
                sx={{
                  width: 120,
                  height: 120,
                  filter: hover ? 'brightness(0.8)' : 'none',
                  transition: 'filter 0.3s'
                }}
              />
              {hover && isOwnProfile && (
                <>
                  <Box
                    position="absolute"
                    top="50%"
                    left="50%"
                    sx={{
                      transform: 'translate(-50%, -50%)',
                      cursor: 'pointer',
                    }}
                    onClick={() => document.getElementById('avatarInput')?.click()}
                  >
                    <FaPencil style={{ color: 'white', fontSize: '24px' }} />
                  </Box>
                  <input
                    id="avatarInput"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                  />
                </>
              )}
            </Box>

            <Box flex={1}>
              <Typography variant="h4" fontWeight="bold">
                {userData?.username || 'Użytkownik'}
              </Typography>
              <Box display="flex" gap={1} my={1}>
                <Chip label={userData?.rank || 'Nowy'} color="primary" size="small" />
                <Chip label={userData?.title || 'Podróżnik'} variant="outlined" size="small" />
              </Box>

              <Box mt={2}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Email:</strong> {userData?.email || 'Brak danych'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Telefon:</strong> {userData?.telephone || 'Brak danych'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Imię i nazwisko:</strong> {userData?.name || 'Nie podano'} {userData?.surname || ''}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box display="flex" justifyContent="center" gap={2} mt={3}>
            <AchievementIcon>
              <FaMedal />
            </AchievementIcon>
            <AchievementIcon>
              <FaTrophy />
            </AchievementIcon>
            <AchievementIcon>
              <FaStar />
            </AchievementIcon>
            <AchievementIcon>
              <FaCrown />
            </AchievementIcon>
          </Box>

          <Box mt={3}>
            <Typography variant="h6" mb={1}>Bio</Typography>
            {isOwnProfile ? (
              <BioTextArea
                multiline
                rows={4}
                value={userData?.bio || ''}
                onChange={handleBioChange}
                placeholder="Dodaj swój opis..."
                variant="outlined"
              />
            ) : (
              <Button
                variant="contained"
                fullWidth
                onClick={handleChallengeClick}
                sx={{ borderRadius: '12px' }}
              >
                Wyślij wyzwanie
              </Button>
            )}
          </Box>
        </ProfileCard>

        <ProfileCard>
          <Typography variant="h6" mb={2}>Znajomi</Typography>
          <Box display="flex" flexDirection="column" gap={1}>
            {friends.map((friend, index) => (
              <Box key={index} display="flex" alignItems="center" p={1} sx={{
                borderRadius: '8px',
                '&:hover': { backgroundColor: 'action.hover' }
              }}>
                <Avatar sx={{ width: 32, height: 32, mr: 1 }} />
                <Typography>{friend}</Typography>
              </Box>
            ))}
          </Box>

          {isOwnProfile && qrCodeValue && (
            <Box mt={3} textAlign="center">
              <Typography variant="h6" mb={1}>Udostępnij swój profil</Typography>
              <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                <Box p={2} bgcolor="white" borderRadius="8px">
                  <QRCode value={qrCodeValue} size={120} />
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<FaLink />}
                  onClick={copyToClipboard}
                  sx={{ borderRadius: '20px' }}
                >
                  Skopiuj link
                </Button>
              </Box>
            </Box>
          )}
        </ProfileCard>

        {/* Nowa sekcja mediów społecznościowych */}
        <ProfileCard>
          <Typography variant="h6" mb={2}>Media społecznościowe</Typography>
          <Box display="flex" justifyContent="center" gap={2}>
            <SocialIcon onClick={() => handleSocialMediaClick('facebook')}>
              <FaFacebook fontSize="24px" />
            </SocialIcon>
            <SocialIcon onClick={() => handleSocialMediaClick('twitter')}>
              <FaTwitter fontSize="24px" />
            </SocialIcon>
            <SocialIcon onClick={() => handleSocialMediaClick('instagram')}>
              <FaInstagram fontSize="24px" />
            </SocialIcon>
            <SocialIcon onClick={() => handleSocialMediaClick('linkedin')}>
              <FaLinkedin fontSize="24px" />
            </SocialIcon>
          </Box>
          {isOwnProfile && (
            <Typography variant="body2" color="text.secondary" mt={2} textAlign="center">
              Edytuj swoje profile w ustawieniach konta
            </Typography>
          )}
        </ProfileCard>
      </Box>

      {/* Right Column - Statistics */}
      <StatsCard sx={{ flex: isMobile ? 1 : 1.5 }}>
        <Typography variant="h5" fontWeight="bold">Statystyki</Typography>

        <Box>
          <Typography variant="subtitle1" mb={1}>Miesięczne odwiedziny</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyVisits}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="visits" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>

        <Box>
          <Typography variant="subtitle1" mb={1}>Ulubione gatunki</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Tooltip />
              <Pie
                data={genreData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40}
                fill="#8884d8"
                label
              >
                {genreData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </StatsCard>

      <Dialog
        open={showCropModal}
        onClose={() => setShowCropModal(false)}
        PaperProps={{
          sx: {
            width: '90%',
            maxWidth: '600px',
            borderRadius: 2,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{
          typography: 'h6',
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          py: 2
        }}>
          Edycja zdjęcia profilowego
        </DialogTitle>

        <DialogContent sx={{
          position: 'relative',
          height: '400px',
          bgcolor: 'background.default',
          p: 0
        }}>
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              cropShape="round"
              showGrid={false}
            />
          )}
        </DialogContent>

        <DialogActions sx={{
          bgcolor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
          px: 3,
          py: 2
        }}>
          <Button
            onClick={() => setShowCropModal(false)}
            color="inherit"
            sx={{ borderRadius: '8px' }}
          >
            Anuluj
          </Button>
          <Button
            onClick={handleCropSave}
            variant="contained"
            disableElevation
            sx={{ borderRadius: '8px' }}
          >
            Zapisz zmiany
          </Button>
        </DialogActions>
      </Dialog>
    </ProfileContainer>
  );
};

export default UserProfile;
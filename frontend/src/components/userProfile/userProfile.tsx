import React, { useCallback, useEffect, useState } from 'react';
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
  CircularProgress,
  Divider
} from "@mui/material";
import QRCode from "react-qr-code";
import Cropper from "react-easy-crop";
import { styled } from '@mui/system';
import client from '../../client';
import { API_BASE_URL } from '../../config';
import { FaPencil } from "react-icons/fa6";

// Styled components (unchanged for brevity, using your CSS)
const ProfileContainer = styled(Box)(() => ({
  padding: '15px',
  background: 'linear-gradient(135deg, #f0f4f8, #d9e2ec)',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  maxWidth: '1200px',
  margin: '0 auto',
}));

const ProfileCard = styled(Box)(() => ({
  background: '#ffffff',
  borderRadius: '8px',
  padding: '15px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transform: 'translateY(-2px)',
  },
}));

const StatsCard = styled(ProfileCard)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
}));

const AchievementIcon = styled(IconButton)(() => ({
  fontSize: '1.8rem',
  color: '#3498db',
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));

const SocialIcon = styled(IconButton)(() => ({
  color: '#7f8c8d',
  fontSize: '24px',
  transition: 'all 0.3s',
  '&:hover': {
    transform: 'scale(1.2)',
    color: '#3498db',
  },
}));

const BioTextArea = styled(TextField)(() => ({
  width: '100%',
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #bdc3c7',
  },
}));

const SocialButton = styled(Button)(() => ({
  width: '100%',
  padding: '12px',
  borderRadius: '8px',
  fontSize: '0.9rem',
  textTransform: 'none',
  marginTop: '10px',
  boxSizing: 'border-box',
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

interface SocialMediaData {
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
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
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [showCropModal, setShowCropModal] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [socialDialogOpen, setSocialDialogOpen] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialMediaData>({
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: ''
  });

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

  // Mock social media data (new)
  const mockSocialMedia: SocialMediaData = {
    facebook: 'https://facebook.com/user123',
    twitter: 'https://twitter.com/user123',
    instagram: 'https://instagram.com/user123',
    linkedin: 'https://linkedin.com/in/user123'
  };

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
    if (userData?.social_media) {
      // Merge userData.social_media with defaults to avoid undefined
      setSocialLinks({
        facebook: userData.social_media.facebook || '',
        twitter: userData.social_media.twitter || '',
        instagram: userData.social_media.instagram || '',
        linkedin: userData.social_media.linkedin || ''
      });
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
        // Use mock data on error
        setUserData({
          username: 'MockUser',
          email: 'mockuser@example.com',
          telephone: '123-456-789',
          name: 'Jan',
          surname: 'Kowalski',
          rank: 'Nowy',
          title: 'Podróżnik',
          bio: 'Witaj w moim profilu!',
          friends: ['Jan Kowalski', 'Anna Nowak', 'Piotr Zieliński'],
          social_media: mockSocialMedia // Use mock social media data
        });
        setProfileImage('/images/basic/user_no_picture.png');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUserData();
    } else {
      // No token, use mock data
      setUserData({
        username: 'MockUser',
        email: 'mockuser@example.com',
        telephone: '123-456-789',
        name: 'Jan',
        surname: 'Kowalski',
        rank: 'Nowy',
        title: 'Podróżnik',
        bio: 'Witaj w moim profilu!',
        friends: ['Jan Kowalski', 'Anna Nowak', 'Piotr Zieliński'],
        social_media: mockSocialMedia // Use mock social media data
      });
      setSocialLinks(mockSocialMedia);
      setLoading(false);
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

  // Social Media Sharing Functions
  const shareToFacebook = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(qrCodeValue)}`;
    window.open(shareUrl, '_blank');
  };

  const shareToTwitter = () => {
    const text = `Check out my profile!`;
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(qrCodeValue)}&text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank');
  };

  const shareToLinkedIn = () => {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(qrCodeValue)}`;
    window.open(shareUrl, '_blank');
  };

  const shareToInstagram = () => {
    navigator.clipboard.writeText(qrCodeValue)
      .then(() => alert('Profile link copied! Paste it into your Instagram post or story.'))
      .catch(() => alert('Failed to copy link!'));
  };

  // Social Media Connection Management
  const handleSocialLinkChange = (platform: keyof SocialMediaData, value: string) => {
    setSocialLinks(prev => ({ ...prev, [platform]: value }));
  };

  const saveSocialLinks = async () => {
    try {
      await client.patch(`${API_BASE_URL}user/`, { social_media: socialLinks }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData(prev => prev ? { ...prev, social_media: socialLinks } : null);
      setSocialDialogOpen(false);
      alert('Social media links updated!');
    } catch (error) {
      console.error('Error updating social media links:', error);
      alert('Failed to update social media links.');
    }
  };

  const disconnectSocialAccount = (platform: keyof SocialMediaData) => {
    setSocialLinks(prev => ({ ...prev, [platform]: '' }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ProfileContainer className="profile-container">
      <Box className="profile-columns" sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: '20px' }}>
        {/* Left Column - Profile Info */}
        <Box className="left-column" sx={{ flex: { lg: '0 0 350px' }, position: { lg: 'sticky' }, top: '20px' }}>
          <ProfileCard>
            <Box className="profile-header" sx={{ flexDirection: { xs: 'column', md: 'row' }, gap: '15px', alignItems: { xs: 'center', md: 'flex-start' }, textAlign: { xs: 'center', md: 'left' } }}>
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
              <Box className="profile-info">
                <Typography variant="h4" className="name" fontWeight="bold" color="#2c3e50">
                  {userData?.username || 'Użytkownik'}
                </Typography>
                <Box className="rank-title" display="flex" gap={1} my={1}>
                  <Chip label={userData?.rank || 'Nowy'} color="primary" size="small" />
                  <Chip label={userData?.title || 'Podróżnik'} variant="outlined" size="small" />
                </Box>
                <Box mt={2}>
                  <Typography variant="body2" color="#7f8c8d">
                    <strong>Email:</strong> {userData?.email || 'Brak danych'}
                  </Typography>
                  <Typography variant="body2" color="#7f8c8d">
                    <strong>Telefon:</strong> {userData?.telephone || 'Brak danych'}
                  </Typography>
                  <Typography variant="body2" color="#7f8c8d">
                    <strong>Imię i nazwisko:</strong> {userData?.name || 'Nie podano'} {userData?.surname || ''}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider className="divider" sx={{ my: '20px' }} />

            <Box className="achievements" display="flex" justifyContent="center" gap={2}>
              <AchievementIcon className="achievement-icon">
                <FaMedal />
              </AchievementIcon>
              <AchievementIcon className="achievement-icon">
                <FaTrophy />
              </AchievementIcon>
              <AchievementIcon className="achievement-icon">
                <FaStar />
              </AchievementIcon>
              <AchievementIcon className="achievement-icon">
                <FaCrown />
              </AchievementIcon>
            </Box>

            <Box className="bio-section" mt={3}>
              <Typography variant="h6" mb={1} color="#2c3e50">Bio</Typography>
              {isOwnProfile ? (
                <BioTextArea
                  className="bio-text-editable"
                  multiline
                  rows={4}
                  value={userData?.bio || ''}
                  onChange={handleBioChange}
                  placeholder="Dodaj swój opis..."
                  variant="outlined"
                />
              ) : (
                <Button
                  className="challenge-button"
                  variant="contained"
                  fullWidth
                  onClick={handleChallengeClick}
                  sx={{ background: '#e74c3c', '&:hover': { background: '#c0392b' } }}
                >
                  Wyślij wyzwanie
                </Button>
              )}
            </Box>
          </ProfileCard>

          <ProfileCard className="friends-section" sx={{ mt: '20px' }}>
            <Typography variant="h6" mb={2} color="#2c3e50">Znajomi</Typography>
            <Box className="friends-list" sx={{ maxHeight: { xs: '200px', lg: '150px' }, overflowY: 'auto' }}>
              {friends.map((friend, index) => (
                <Box key={index} className="friend-item" display="flex" alignItems="center" p={1} sx={{
                  borderRadius: '6px',
                  background: '#f8f9fa',
                  mb: '5px'
                }}>
                  <Avatar sx={{ width: 32, height: 32, mr: 1 }} />
                  <Typography>{friend}</Typography>
                </Box>
              ))}
            </Box>

            {isOwnProfile && qrCodeValue && (
              <Box className="qr-code-section" mt={3} textAlign="center">
                <Typography variant="h6" mb={1} color="#2c3e50">Udostępnij swój profil</Typography>
                <Box className="qr-code-wrapper" p={2} bgcolor="white" borderRadius="8px">
                  <QRCode value={qrCodeValue} size={120} />
                </Box>
                <Typography className="qr-code-instruction" color="#7f8c8d" my={1}>
                  Zeskanuj kod lub skopiuj link, aby zaprosić znajomych.
                </Typography>
                <Button
                  className="copy-link-button"
                  variant="contained"
                  startIcon={<FaLink />}
                  onClick={copyToClipboard}
                  sx={{ background: '#2ecc71', '&:hover': { background: '#27ae60' } }}
                >
                  Skopiuj link
                </Button>
              </Box>
            )}
          </ProfileCard>

          {/* Social Media Section */}
          <ProfileCard sx={{ mt: '20px' }}>
            <Typography variant="h6" mb={2} color="#2c3e50">Media społecznościowe</Typography>
            <Box display="flex" justifyContent="center" gap={2}>
              <SocialIcon onClick={shareToFacebook}>
                <FaFacebook />
              </SocialIcon>
              <SocialIcon onClick={shareToTwitter}>
                <FaTwitter />
              </SocialIcon>
              <SocialIcon onClick={shareToInstagram}>
                <FaInstagram />
              </SocialIcon>
              <SocialIcon onClick={shareToLinkedIn}>
                <FaLinkedin />
              </SocialIcon>
            </Box>
            {isOwnProfile && (
              <>
                <SocialButton
                  variant="outlined"
                  onClick={() => setSocialDialogOpen(true)}
                  sx={{ mt: '20px' }}
                >
                  Zarządzaj połączeniami
                </SocialButton>
                <Typography variant="body2" color="#7f8c8d" mt={2} textAlign="center">
                  Udostępnij swój profil na mediach społecznościowych lub połącz konta.
                </Typography>
              </>
            )}
          </ProfileCard>
        </Box>

        {/* Right Column - Statistics */}
        <Box className="right-column" sx={{ flex: { lg: 1 } }}>
          <StatsCard className="chart-container">
            <Typography variant="h5" fontWeight="bold" color="#2c3e50">Statystyki</Typography>

            <Box>
              <Typography variant="subtitle1" mb={1} color="#2c3e50">Miesięczne odwiedziny</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyVisits}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="visits" fill="#3498db" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>

            <Box>
              <Typography variant="subtitle1" mb={1} color="#2c3e50">Ulubione gatunki</Typography>
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
        </Box>
      </Box>

      {/* Crop Modal */}
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
          bgcolor: '#f8f9fa',
          borderBottom: '1px solid #bdc3c7',
          py: 2
        }}>
          Edycja zdjęcia profilowego
        </DialogTitle>

        <DialogContent sx={{
          position: 'relative',
          height: '400px',
          bgcolor: '#f0f4f8',
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
          bgcolor: '#f8f9fa',
          borderTop: '1px solid #bdc3c7',
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
            sx={{ borderRadius: '8px', background: '#3498db', '&:hover': { background: '#2980b9' } }}
          >
            Zapisz zmiany
          </Button>
        </DialogActions>
      </Dialog>

      {/* Social Media Management Dialog */}
      <Dialog
        open={socialDialogOpen}
        onClose={() => setSocialDialogOpen(false)}
        PaperProps={{
          sx: {
            width: '90%',
            maxWidth: '500px',
            borderRadius: '8px'
          }
        }}
      >
        <DialogTitle sx={{ color: '#2c3e50' }}>
          Zarządzaj mediami społecznościowymi
        </DialogTitle>
        <DialogContent>
          {(['facebook', 'twitter', 'instagram', 'linkedin'] as const).map(platform => (
            <Box key={platform} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" color="#2c3e50" mb={1}>
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                value={socialLinks[platform]}
                onChange={(e) => handleSocialLinkChange(platform, e.target.value)}
                placeholder={`Podaj link do ${platform}`}
                sx={{ mb: 1, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
              {socialLinks[platform] && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => disconnectSocialAccount(platform)}
                  sx={{ borderRadius: '8px' }}
                >
                  Odłącz
                </Button>
              )}
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setSocialDialogOpen(false)}
            color="inherit"
            sx={{ borderRadius: '8px' }}
          >
            Anuluj
          </Button>
          <Button
            onClick={saveSocialLinks}
            variant="contained"
            sx={{ borderRadius: '8px', background: '#3498db', '&:hover': { background: '#2980b9' } }}
          >
            Zapisz
          </Button>
        </DialogActions>
      </Dialog>
    </ProfileContainer>
  );
};

export default UserProfile;
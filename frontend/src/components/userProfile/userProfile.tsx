import React, {useCallback, useEffect, useState} from 'react';
import './userProfile.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FaMedal, FaTrophy, FaStar, FaCrown } from 'react-icons/fa';
import client from '../../client'; 
import { API_BASE_URL } from '../../config'; 
import {Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import QRCode from "react-qr-code";
import Cropper from "react-easy-crop";
import {FaPencil} from "react-icons/fa6";

interface UserData {
  id?: string;
  name?: string;
  rank?: string;
  title?: string;
  bio?: string;
  profile_picture?: string;
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
// @ts-ignore
async function getCroppedImg(imageSrc, croppedAreaPixels) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = imageSrc;
        image.crossOrigin = "anonymous";

        image.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = croppedAreaPixels.width;
            canvas.height = croppedAreaPixels.height;

            // @ts-ignore
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
  const [userData, setUserData] = useState<UserData | null>(null);
  const [profileImage, setProfileImage] = useState<string>('/images/basic/user_no_picture.png');
  const [friends, setFriends] = useState<string[]>(['Jan Kowalski', 'Anna Nowak', 'Piotr Zieliński']);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [qrCodeValue, setQrCodeValue] = useState('');
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [hover, setHover] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [crop, setCrop] = useState({x: 0, y: 0});
  const [zoom, setZoom] = useState(1);
  const [croppedImage, setCroppedImage] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);

  // Dodaj te nowe funkcje
  // @ts-ignore
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // @ts-ignore
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        // @ts-ignore
        setImageSrc(reader.result);
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
      // @ts-ignore
      formData.append("profile_picture", croppedBlob);

      const response = await client.post(`${API_BASE_URL}user/`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
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

  // Mock data
  const monthlyVisits: VisitData[] = [
    { month: 'Styczeń', visits: 40 },
    { month: 'Luty', visits: 30 },
    { month: 'Marzec', visits: 50 },
    { month: 'Kwiecień', visits: 70 },
    { month: 'Maj', visits: 90 },
  ];

  const genreData: GenreData[] = [
    { name: 'Fantasy', value: 40 },
    { name: 'Sci-Fi', value: 30 },
    { name: 'Horror', value: 20 },
    { name: 'Historyczne', value: 10 },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 992);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedImage = localStorage.getItem('profile_picture');
        if (storedImage) {
          setProfileImage(storedImage);
          return;
        }

        const response = await client.get(`${API_BASE_URL}/user/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`,
          },
        });

        setUserData(response.data);
        const image = response.data.profile_picture || '/images/basic/user_no_picture.png';
        setProfileImage(image);
        localStorage.setItem('profile_picture', image);
      } catch (error) {
        console.error('Błąd podczas pobierania danych użytkownika:', error);
        setProfileImage('/images/basic/user_no_picture.png');
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (isOwnProfile && userData?.id) {
      setQrCodeValue(`${API_BASE_URL}add-friend/${userData.id}`);
    } else {
      setQrCodeValue(`${API_BASE_URL}add-friend/4`);
    }
  }, [isOwnProfile, userData?.id]);

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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

  return (
    <div className="profile-container">
      <div className="profile-columns">
        {/* Left Column - Profile Info */}
        <div className="left-column">
          <div className="profile-header">
            <div
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              style={{ position: 'relative' }}
            >
              <Avatar
                src={profileImage}
                sx={{
                  width: isSmallScreen ? 60 : 80,
                  height: isSmallScreen ? 60 : 80,
                  filter: hover ? 'brightness(0.8)' : 'none',
                  transition: 'filter 0.3s'
                }}
              />
              {hover && isOwnProfile && (
                <>
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      cursor: 'pointer',
                    }}
                    onClick={() =>
                        // @ts-ignore
                        document.getElementById('avatarInput').click()
                  }
                  >
                    <FaPencil style={{ color: 'white', fontSize: '24px' }} />
                  </div>
                  <input
                    id="avatarInput"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                  />
                </>
              )}
            </div>

          <hr className="divider" />

          <div className="achievements">
            <FaMedal className="achievement-icon" title="Osiągnięcie 1" />
            <FaTrophy className="achievement-icon" title="Osiągnięcie 2" />
            <FaStar className="achievement-icon" title="Osiągnięcie 3" />
            <FaCrown className="achievement-icon" title="Osiągnięcie 4" />
          </div>

          <div className="bio-section">
            <h3>BIO</h3>
            {isOwnProfile ? (
              <textarea
                className="bio-text-editable"
                value={userData?.bio || ''}
                onChange={handleBioChange}
                placeholder="Dodaj swój opis..."
              />
            ) : (
              <button className="challenge-button" onClick={handleChallengeClick}>
                Wyślij wyzwanie
              </button>
            )}
          </div>

          <hr className="divider" />

          <div className="friends-section">
            <h3>Znajomi</h3>
            <ul className="friends-list">
              {friends.map((friend, index) => (
                <li key={index} className="friend-item">
                  {friend}
                </li>
              ))}
            </ul>

            {isOwnProfile && qrCodeValue && (
              <div className="qr-code-section">
                <h4>Udostępnij swój kod QR</h4>
                <div className="qr-code-wrapper">
                  <QRCode value={qrCodeValue} size={100} />
                </div>
                <p className="qr-code-instruction">Zeskanuj kod QR, aby dodać znajomego!</p>
                <button className="copy-link-button" onClick={copyToClipboard}>
                  Skopiuj link
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Statistics */}
        <div className="right-column">
          <div className="statistics-section">
            <h3>Statystyki</h3>

            <div className="chart-container">
              <h4>Miesięczne odwiedziny</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyVisits}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="visits" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-container">
              <h4>Najczęściej uczęszczane gatunki</h4>
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
                    fill="#8884d8"
                    label
                  >
                    {genreData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <Dialog
        open={showCropModal}
        onClose={() => setShowCropModal(false)}
        PaperProps={{
          sx: {
            width: '90%',
            maxWidth: '600px',
            borderRadius: 2
          }
        }}
      >
        <DialogTitle sx={{
          typography: 'h6',
          bgcolor: 'background.default',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}>
          Edycja zdjęcia profilowego
        </DialogTitle>

        <DialogContent sx={{
          position: 'relative',
          height: '400px',
          bgcolor: 'background.paper'
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
          bgcolor: 'background.default',
          borderTop: '1px solid',
          borderColor: 'divider'
        }}>
          <Button
            onClick={() => setShowCropModal(false)}
            color="inherit"
          >
            Anuluj
          </Button>
          <Button
            onClick={handleCropSave}
            variant="contained"
            disableElevation
          >
            Zapisz zmiany
          </Button>
        </DialogActions>
      </Dialog>
        </div>
      </div>
    </div>
    </div>
  );
};

export default UserProfile;
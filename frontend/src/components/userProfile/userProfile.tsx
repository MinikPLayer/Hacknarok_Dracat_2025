import React, { useEffect, useState } from 'react';
import './userProfile.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FaMedal, FaTrophy, FaStar, FaCrown } from 'react-icons/fa';
import client from '../../client'; 
import { API_BASE_URL } from '../../config'; 
import { Avatar } from "@mui/material";
import QRCode from "react-qr-code";

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

const UserProfile = ({ isOwnProfile }: { isOwnProfile: boolean }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [profileImage, setProfileImage] = useState<string>('/images/basic/user_no_picture.png');
  const [friends, setFriends] = useState<string[]>(['Jan Kowalski', 'Anna Nowak', 'Piotr Zieliński']);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [qrCodeValue, setQrCodeValue] = useState('');

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
            <Avatar 
              src={profileImage} 
              sx={{ 
                width: isSmallScreen ? 60 : 80, 
                height: isSmallScreen ? 60 : 80 
              }}
            />
            <div className="profile-info">
              <h2 className="name">{userData?.name || 'Katarzyna Wójcik'}</h2>
              <p className="rank-title">
                {userData?.rank || '7'}
                <br />
                {userData?.title || 'Ekspert podróży'}
              </p>
            </div>
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
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
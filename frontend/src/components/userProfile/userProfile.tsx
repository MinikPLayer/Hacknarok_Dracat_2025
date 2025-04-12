import React, { useEffect, useState } from 'react';
import './userProfile.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FaMedal, FaTrophy, FaStar, FaCrown } from 'react-icons/fa';
import client from '../../client'; 
import { API_BASE_URL } from '../../config'; 
import {Avatar} from "@mui/material";
import QRCode from "react-qr-code";



interface UserData {
  name?: string;
  rank?: string;
  title?: string;
  bio?: string;
  profile_picture?: string;
}

const UserProfile = ({ isOwnProfile }: { isOwnProfile: boolean }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [friends, setFriends] = useState<string[]>(['Jan Kowalski', 'Anna Nowak', 'Piotr Zieliński']); // Przykładowi znajomi
  const [newFriend, setNewFriend] = useState<string>(''); // Pole do dodawania znajomych
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [qrCodeValue, setQrCodeValue] = useState<string>(''); // Wartość kodu QR


  const monthlyVisits = [
    { month: 'Styczeń', visits: 40 },
    { month: 'Luty', visits: 30 },
    { month: 'Marzec', visits: 50 },
    { month: 'Kwiecień', visits: 70 },
    { month: 'Maj', visits: 90 },
  ];

  const genreData = [
    { name: 'Fantasy', value: 40 },
    { name: 'Sci-Fi', value: 30 },
    { name: 'Horror', value: 20 },
    { name: 'Historyczne', value: 10 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 992);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedImage = localStorage.getItem('profile_picture');
        if (storedImage) {
          setImage(storedImage);
        } else {
          const response = await client.get(`${API_BASE_URL}/user/`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access')}`,
            },
          });
          setUserData(response.data);
          if (response.data.profile_picture) {
            const profilePicture = response.data.profile_picture;
            setImage(profilePicture);
            localStorage.setItem('profile_picture', profilePicture);
          } else {
            const defaultImage = '/images/basic/user_no_picture.png';
            setImage(defaultImage);
            localStorage.setItem('profile_picture', defaultImage);
          }
        }
      } catch (error) {
        console.error('Błąd podczas pobierania danych użytkownika:', error);
        const defaultImage = '/images/basic/user_no_picture.png';
        setImage(defaultImage);
        localStorage.setItem('profile_picture', defaultImage);
      }
    };

    fetchUserData();
  }, []);

useEffect(() => {
  if (isOwnProfile) {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      setQrCodeValue(`${API_BASE_URL}/add-friend/${userId}`);
    } else {
      console.warn("Brak user_id w localStorage!");
    }
  }
}, [isOwnProfile]);


return (
  <div className="profile-container">
    <div className="profile-columns">
      {/* Lewa kolumna */}
      <div className="left-column">
        <div className="profile-header">
          <Avatar 
            src={image || '/images/basic/user_no_picture.png'} 
            sx={{ 
              width: { xs: 60, md: 80 }, 
              height: { xs: 60, md: 80 } 
            }}
          />
          <div className="profile-info">
            <h2 className="name">{userData?.name || 'Użytkownik'}</h2>
            <p className="rank-title">
              {userData?.rank || 'Brak rangi'}
              <br />
              {userData?.title || 'Brak tytułu'}
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
              onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
              placeholder="Dodaj swój opis..."
            />
          ) : (
            <button className="challenge-button" onClick={() => alert('Wysłano wyzwanie!')}>
              Wyślij wyzwanie
            </button>
          )}
        </div>

        <hr className="divider" />

        {/* Sekcja znajomych */}
        <div className="friends-section">
          <h3>Znajomi</h3>
          <ul className="friends-list">
            {friends.map((friend, index) => (
              <li key={index} className="friend-item">
                {friend}
              </li>
            ))}
          </ul>

          {isOwnProfile && (
            <div className="qr-code-section">
              <h4>Udostępnij swój kod QR</h4>
              <div className="qr-code-wrapper">
                <QRCode value={qrCodeValue} size={100} />
              </div>
              <p className="qr-code-instruction">Zeskanuj kod QR, aby dodać znajomego!</p>
              <button
                className="copy-link-button"
                onClick={() => {
                  navigator.clipboard.writeText(qrCodeValue);
                  alert('Link został skopiowany do schowka!');
                }}
              >
                Skopiuj link
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Prawa kolumna */}
      <div className="right-column">
        <div className="statistics-section">
          <h3>Statystyki</h3>

          {/* Wykres miesięcznych odwiedzin */}
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

          {/* Wykres gatunków */}
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
                  {genreData.map((entry, index) => (
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
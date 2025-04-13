// RankingPage.tsx
import React, {useEffect, useState} from 'react';
import { isUserAuthenticated } from "../../AuthContext";
import { Navigate } from 'react-router-dom';
import './ranking.css';
import { FaTrophy, FaMedal, FaUserAlt, FaGlobeAmericas, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import {API_BASE_URL} from "../../config";
import client from "../../client";

interface UserRanking {
  id: number;
  name: string;
  avatar: string;
  points: number;
  visitedPlaces: number;
  globalRank: number;
  levelRank: number;
  level: number;
}

const RankingPage = () => {
  const allUsers: UserRanking[] = [
    { id: 1, name: "Jan Kowalski", avatar: "", points: 2450, visitedPlaces: 32, globalRank: 1, levelRank: 1, level: 9 },
    { id: 2, name: "Anna Nowak", avatar: "", points: 1980, visitedPlaces: 28, globalRank: 2, levelRank: 1, level: 8 },
    { id: 3, name: "Piotr Wiśniewski", avatar: "", points: 1750, visitedPlaces: 25, globalRank: 3, levelRank: 2, level: 8 },
    { id: 4, name: "Katarzyna Wójcik", avatar: "", points: 1620, visitedPlaces: 23, globalRank: 4, levelRank: 1, level: 7 },
    { id: 5, name: "Michał Lewandowski", avatar: "", points: 1480, visitedPlaces: 21, globalRank: 5, levelRank: 2, level: 7 },
    { id: 6, name: "Agnieszka Dąbrowska", avatar: "", points: 1320, visitedPlaces: 19, globalRank: 6, levelRank: 3, level: 7 },
    { id: 7, name: "Tomasz Kamiński", avatar: "", points: 1150, visitedPlaces: 17, globalRank: 7, levelRank: 1, level: 6 },
    { id: 8, name: "Magdalena Zielińska", avatar: "", points: 980, visitedPlaces: 14, globalRank: 8, levelRank: 2, level: 6 },
    { id: 9, name: "Marcin Szymański", avatar: "", points: 850, visitedPlaces: 12, globalRank: 9, levelRank: 1, level: 5 },
    { id: 10, name: "Monika Woźniak", avatar: "", points: 720, visitedPlaces: 10, globalRank: 10, levelRank: 2, level: 5 },
    { id: 11, name: "Adam Nowak", avatar: "", points: 650, visitedPlaces: 9, globalRank: 11, levelRank: 1, level: 4 },
    { id: 12, name: "Ewa Kowalska", avatar: "", points: 580, visitedPlaces: 8, globalRank: 12, levelRank: 2, level: 4 },
    { id: 13, name: "Krzysztof Wiśniewski", avatar: "", points: 500, visitedPlaces: 7, globalRank: 13, levelRank: 1, level: 3 },
    { id: 14, name: "Barbara Lewandowska", avatar: "", points: 420, visitedPlaces: 6, globalRank: 14, levelRank: 1, level: 2 },
    { id: 15, name: "Andrzej Dąbrowski", avatar: "", points: 350, visitedPlaces: 5, globalRank: 15, levelRank: 1, level: 1 },
  ];

  const [selectedLevel, setSelectedLevel] = useState<number | 'all'>('all');
  const [expandedLevels, setExpandedLevels] = useState<number[]>([]);
  const [user, setUser] = useState<UserRanking | null>(null);
  const token = localStorage.getItem("access");

  if (!isUserAuthenticated()) {
    return <Navigate to="/login" />;
  }

  // Grupuj użytkowników według poziomów
  const usersByLevel: Record<number, UserRanking[]> = {};
  allUsers.forEach(user => {
    if (!usersByLevel[user.level]) {
      usersByLevel[user.level] = [];
    }
    usersByLevel[user.level].push(user);
  });

  // Sortuj poziomy malejąco
  const levels = Object.keys(usersByLevel).map(Number).sort((a, b) => b - a);

  // Filtruj użytkowników według wybranego poziomu
  const filteredUsers = selectedLevel === 'all' 
    ? allUsers 
    : usersByLevel[selectedLevel] || [];

  // Funkcja do przełączania rozwinięcia poziomu
  const toggleLevel = (level: number) => {
    setExpandedLevels(prev => 
      prev.includes(level) 
        ? prev.filter(l => l !== level) 
        : [...prev, level]
    );
  };


  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await client.get(API_BASE_URL + "user/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.log("Nie udało się pobrać danych użytkownika");
      }
    };

    if (token) {
      fetchUserData();
    }
  }, [token]);

  // Znajdź aktualnego użytkownika w rankingu
  const currentUser = user ? allUsers.find(u => u.id === user.id) : null;

  // Funkcja renderująca podium
  const renderPodium = (users: UserRanking[], isLevelRanking: boolean = false) => {
    const topUsers = users.slice(0, 3);
    
    return (
      <div className="podium-container">
        {topUsers.map(user => (
          <div key={user.id} className={`podium-item ${isLevelRanking ? 
            (user.levelRank === 1 ? 'gold' : user.levelRank === 2 ? 'silver' : 'bronze') :
            (user.globalRank === 1 ? 'gold' : user.globalRank === 2 ? 'silver' : 'bronze')}`}>
            <div className="podium-rank">
              {isLevelRanking ? (
                user.levelRank === 1 ? <FaMedal className="gold-medal" /> : 
                user.levelRank === 2 ? <FaMedal className="silver-medal" /> : 
                <FaMedal className="bronze-medal" />
              ) : (
                user.globalRank === 1 ? <FaMedal className="gold-medal" /> : 
                user.globalRank === 2 ? <FaMedal className="silver-medal" /> : 
                <FaMedal className="bronze-medal" />
              )}
              <span>#{isLevelRanking ? user.levelRank : user.globalRank}</span>
            </div>
            <div className="podium-avatar">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <FaUserAlt className="default-avatar" />
              )}
            </div>
            <div className="podium-details">
              <h3>{user.name}</h3>
              <div className="podium-stats">
                <span><FaGlobeAmericas /> {user.visitedPlaces} places</span>
                <span>{user.points} pts</span>
                {isLevelRanking && <span>Lvl {user.level}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="ranking-container">
      <header className="ranking-header">
        <h1>
          <FaTrophy />
          <span style={{ display: 'inline-flex', alignItems: 'center' }}>
            <img 
              src="/media/dwakotel.png" 
              alt="Cat icon" 
              style={{ 
                height: '40px', 
                margin: '0 10px',
                verticalAlign: 'middle' 
              }} 
            />
            Global Ranking
          </span>
        </h1>
        <p>Top travelers based on experience level and visited places</p>
      </header>

      {/* Selektor poziomu */}
      <div className="level-selector">
        <button 
          className={`level-filter ${selectedLevel === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedLevel('all')}
        >
          All Levels
        </button>
        {levels.map(level => (
          <button
            key={level}
            className={`level-filter ${selectedLevel === level ? 'active' : ''}`}
            onClick={() => setSelectedLevel(level)}
          >
            Level {level}
          </button>
        ))}
      </div>

      {/* Podium dla wybranego widoku */}
      {filteredUsers.length > 0 && (
        <>
          <h2 className="ranking-title">
            {selectedLevel === 'all' ? 'Global Top Travelers' : `Level ${selectedLevel} Top Travelers`}
          </h2>
          {renderPodium(filteredUsers, selectedLevel !== 'all')}
        </>
      )}

      {/* Lista poziomów z rankingiem */}
      {selectedLevel === 'all' && (
        <div className="levels-ranking">
          {levels.map(level => {
            const levelUsers = usersByLevel[level];
            const isExpanded = expandedLevels.includes(level);
            
            return (
              <div key={level} className="level-group">
                <div 
                  className="level-header" 
                  onClick={() => toggleLevel(level)}
                >
                  <h3>
                    Level {level} 
                    <span className="users-count">({levelUsers.length} users)</span>
                  </h3>
                  <span className="toggle-icon">
                    {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                  </span>
                </div>
                
                {isExpanded && (
                  <>
                    <h4 className="level-podium-title">Top 3 in Level {level}</h4>
                    {renderPodium(levelUsers, true)}
                    
                    <div className="ranking-list">
                      <div className="ranking-list-header">
                        <span>#</span>
                        <span>User</span>
                        <span>Places</span>
                        <span>Points</span>
                      </div>
                      {levelUsers.map(user => (
                        <div 
                          key={user.id} 
                          className={`ranking-item ${currentUser?.id === user.id ? 'current-user' : ''}`}
                        >
                          <span className="rank-number">{user.levelRank}</span>
                          <div className="user-info">
                            {user.avatar ? (
                              <img src={user.avatar} alt={user.name} className="user-avatar" />
                            ) : (
                              <FaUserAlt className="default-avatar" />
                            )}
                            <span>{user.name}</span>
                          </div>
                          <span className="visited-places">{user.visitedPlaces}</span>
                          <span className="user-points">{user.points} pts</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pełna lista rankingu gdy wybrany konkretny poziom */}
      {selectedLevel !== 'all' && filteredUsers.length > 0 && (
        <div className="ranking-list">
          <div className="ranking-list-header">
            <span>#</span>
            <span>User</span>
            <span>Places</span>
            <span>Points</span>
          </div>
          {filteredUsers.map(user => (
            <div 
              key={user.id} 
              className={`ranking-item ${currentUser?.id === user.id ? 'current-user' : ''}`}
            >
              <span className="rank-number">{user.levelRank}</span>
              <div className="user-info">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="user-avatar" />
                ) : (
                  <FaUserAlt className="default-avatar" />
                )}
                <span>{user.name}</span>
              </div>
              <span className="visited-places">{user.visitedPlaces}</span>
              <span className="user-points">{user.points} pts</span>
            </div>
          ))}
        </div>
      )}

      {/* Statystyki aktualnego użytkownika */}
      {currentUser && (
        <div className="user-stats-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Your Position</h3>
            <img 
              src="/media/dwakotel.png" 
              alt="Cat icon" 
              style={{ 
                height: '50px', 
                opacity: 0.8,
                filter: 'grayscale(30%)'
              }} 
            />
          </div>
          <div className="user-stats-content">
            <div className="user-rank">
              <span>Global: #{currentUser.globalRank}</span>
              <span className="user-level">Level {currentUser.level} (Rank: #{currentUser.levelRank})</span>
            </div>
            <div className="user-details">
              <div className="user-avatar">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} />
                ) : (
                  <FaUserAlt className="default-avatar" />
                )}
              </div>
              <div className="user-info">
                <h4>{currentUser.name}</h4>
                <div className="stats">
                  <div className="stat-item">
                    <FaGlobeAmericas />
                    <span>{currentUser.visitedPlaces} places visited</span>
                  </div>
                  <div className="stat-item">
                    <FaTrophy />
                    <span>{currentUser.points} points</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RankingPage;
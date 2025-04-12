// RankingPage.tsx
import React from 'react';
import { isUserAuthenticated } from "../../AuthContext";
import { Navigate } from 'react-router-dom';
import './ranking.css';
import { FaTrophy, FaMedal, FaUserAlt, FaGlobeAmericas } from 'react-icons/fa';

interface UserRanking {
  id: number;
  name: string;
  avatar: string;
  points: number;
  visitedPlaces: number;
  rank: number;
}

const RankingPage = () => {
  // Mock data - w rzeczywistej aplikacji dane będą pobierane z API
  const rankingData: UserRanking[] = [
    { id: 1, name: "Jan Kowalski", avatar: "", points: 2450, visitedPlaces: 32, rank: 1 },
    { id: 2, name: "Anna Nowak", avatar: "", points: 1980, visitedPlaces: 28, rank: 2 },
    { id: 3, name: "Piotr Wiśniewski", avatar: "", points: 1750, visitedPlaces: 25, rank: 3 },
    { id: 4, name: "Katarzyna Wójcik", avatar: "", points: 1620, visitedPlaces: 23, rank: 4 },
    { id: 5, name: "Michał Lewandowski", avatar: "", points: 1480, visitedPlaces: 21, rank: 5 },
    { id: 6, name: "Agnieszka Dąbrowska", avatar: "", points: 1320, visitedPlaces: 19, rank: 6 },
    { id: 7, name: "Tomasz Kamiński", avatar: "", points: 1150, visitedPlaces: 17, rank: 7 },
    { id: 8, name: "Magdalena Zielińska", avatar: "", points: 980, visitedPlaces: 14, rank: 8 },
    { id: 9, name: "Marcin Szymański", avatar: "", points: 850, visitedPlaces: 12, rank: 9 },
    { id: 10, name: "Monika Woźniak", avatar: "", points: 720, visitedPlaces: 10, rank: 10 },
  ];

  // Znajdź aktualnego użytkownika (w rzeczywistej aplikacji dane będą pobierane z kontekstu/API)
  const currentUser = rankingData.find(user => user.id === 4); // Przykładowe ID

  if (!isUserAuthenticated()) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="ranking-container">
      <header className="ranking-header">
        <h1><FaTrophy /> Global Ranking</h1>
        <p>Top travelers based on visited places</p>
      </header>

      {/* Top 3 użytkowników z podium */}
      <div className="podium-container">
        {rankingData.slice(0, 3).map(user => (
          <div key={user.id} className={`podium-item ${user.rank === 1 ? 'gold' : user.rank === 2 ? 'silver' : 'bronze'}`}>
            <div className="podium-rank">
              {user.rank === 1 ? <FaMedal className="gold-medal" /> : 
               user.rank === 2 ? <FaMedal className="silver-medal" /> : 
               <FaMedal className="bronze-medal" />}
              <span>#{user.rank}</span>
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
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pełna lista rankingu */}
      <div className="ranking-list">
        <div className="ranking-list-header">
          <span>#</span>
          <span>User</span>
          <span>Places</span>
          <span>Points</span>
        </div>

        {rankingData.map(user => (
          <div 
            key={user.id} 
            className={`ranking-item ${currentUser?.id === user.id ? 'current-user' : ''}`}
          >
            <span className="rank-number">{user.rank}</span>
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

      {/* Statystyki aktualnego użytkownika */}
      {currentUser && (
        <div className="user-stats-card">
          <h3>Your Position</h3>
          <div className="user-stats-content">
            <div className="user-rank">
              <span>#{currentUser.rank}</span>
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
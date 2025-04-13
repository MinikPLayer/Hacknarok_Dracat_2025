import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaTrophy, 
  FaMedal, 
  FaAward,
  FaStar,
  FaMountain,
  FaGlobeAmericas,
  FaCamera,
  FaUtensils,
  FaLandmark
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import './achievements.css';

const AchievementsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  
  // Przykładowe dane osiągnięć
  const achievements = [
    {
      id: 1,
      title: "Początkujący Podróżnik",
      description: "Dodaj swoją pierwszą podróż",
      icon: <FaGlobeAmericas />,
      category: "basic",
      unlocked: true,
      date: "15 czerwca 2023",
      progress: 100
    },
    {
      id: 2,
      title: "Miłośnik Historii",
      description: "Odwiedź 5 zabytków",
      icon: <FaLandmark />,
      category: "exploration",
      unlocked: true,
      date: "22 lipca 2023",
      progress: 100
    },
    {
      id: 3,
      title: "Łowca Widoków",
      description: "Dodaj 10 zdjęć z podróży",
      icon: <FaCamera />,
      category: "photos",
      unlocked: false,
      progress: 70
    },
    {
      id: 4,
      title: "Smakosz",
      description: "Spróbuj lokalnych potraw w 3 różnych krajach",
      icon: <FaUtensils />,
      category: "food",
      unlocked: false,
      progress: 33
    },
    {
      id: 5,
      title: "Weteran Gór",
      description: "Zdobyj 5 szczytów powyżej 2000m n.p.m.",
      icon: <FaMountain />,
      category: "activity",
      unlocked: false,
      progress: 20
    },
    {
      id: 6,
      title: "Gwiazda Rankingu",
      description: "Znajdź się w top 10 rankingu",
      icon: <FaStar />,
      category: "social",
      unlocked: false,
      progress: 0
    },
    {
      id: 7,
      title: "Złoty Podróżnik",
      description: "Odblokuj wszystkie podstawowe osiągnięcia",
      icon: <FaTrophy />,
      category: "premium",
      unlocked: false,
      progress: 42
    }
  ];

  const filteredAchievements = activeTab === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === activeTab);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  const categories = [
    { id: 'all', name: 'Wszystkie', icon: <FaTrophy /> },
    { id: 'basic', name: 'Podstawowe', icon: <FaMedal /> },
    { id: 'exploration', name: 'Eksploracja', icon: <FaLandmark /> },
    { id: 'photos', name: 'Fotografia', icon: <FaCamera /> },
    { id: 'food', name: 'Kulinaria', icon: <FaUtensils /> },
    { id: 'activity', name: 'Aktywność', icon: <FaMountain /> },
    { id: 'social', name: 'Społeczność', icon: <FaStar /> }
  ];

  return (
    <div className="achievements-container">
      {/* Nagłówek */}
      <header className="achievements-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Wróć
        </button>
        <h1><FaTrophy /> Moje Osiągnięcia</h1>
      </header>

      {/* Statystyki */}
      <div className="achievements-stats">
        <motion.div 
          className="stat-card"
          whileHover={{ scale: 1.03 }}
        >
          <h3>Odblokowane</h3>
          <p className="stat-value">{unlockedCount}</p>
        </motion.div>
        
        <motion.div 
          className="stat-card"
          whileHover={{ scale: 1.03 }}
        >
          <h3>Do zdobycia</h3>
          <p className="stat-value">{totalCount - unlockedCount}</p>
        </motion.div>
        
        <motion.div 
          className="stat-card"
          whileHover={{ scale: 1.03 }}
        >
          <h3>Postęp</h3>
          <p className="stat-value">{Math.round((unlockedCount / totalCount) * 100)}%</p>
        </motion.div>
      </div>

      {/* Pasek postępu */}
      <div className="progress-container">
        <div 
          className="progress-bar"
          style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
        ></div>
        <span className="progress-text">
          {unlockedCount} z {totalCount} osiągnięć
        </span>
      </div>

      {/* Kategorie */}
      <div className="categories-tabs">
        {categories.map(category => (
          <motion.button
            key={category.id}
            className={`category-tab ${activeTab === category.id ? 'active' : ''}`}
            onClick={() => setActiveTab(category.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="tab-icon">{category.icon}</span>
            {category.name}
          </motion.button>
        ))}
      </div>

      {/* Lista osiągnięć */}
      <div className="achievements-list">
        {filteredAchievements.length > 0 ? (
          filteredAchievements.map(achievement => (
            <motion.div
              key={achievement.id}
              className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="achievement-icon">
                {achievement.icon}
                {achievement.unlocked && (
                  <div className="unlocked-badge">
                    <FaAward />
                  </div>
                )}
              </div>
              
              <div className="achievement-content">
                <h3>{achievement.title}</h3>
                <p>{achievement.description}</p>
                
                {achievement.unlocked ? (
                  <div className="achievement-date">
                    Odblokowano: {achievement.date}
                  </div>
                ) : (
                  <div className="progress-container">
                    <div 
                      className="progress-bar"
                      style={{ width: `${achievement.progress}%` }}
                    ></div>
                    <span className="progress-text">{achievement.progress}%</span>
                  </div>
                )}
              </div>
              
              <div className="achievement-status">
                {achievement.unlocked ? (
                  <span className="unlocked-text">Zdobyte!</span>
                ) : (
                  <span className="locked-text">Do zdobycia</span>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="no-achievements">
            <p>Brak osiągnięć w tej kategorii</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementsPage;
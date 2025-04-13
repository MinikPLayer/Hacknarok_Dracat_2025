import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaHeart, 
  FaComment,
  FaShare,
  FaBookOpen
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import './storyTelling.css';

const StorytellingPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [stories, setStories] = useState([]);
  const [activeStory, setActiveStory] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');

  // Przykładowe dane - w praktyce pobierane z API
  useEffect(() => {
    const mockStories = [
        {
          id: 1,
          tripId: 1,
          title: "Saga o Krakowskim Smoku",
          content: "Wyruszyłem na wyprawę do pradawnego grodu Kraków, gdzie na Wawelu, w cieniu zamku, czuć oddech smoka. Przemierzając brukowane ścieżki Rynku Głównego, usłyszałem pieśni bardów, które przypominały o dawnych czasach. Wieczorem, w magicznej dzielnicy Kazimierz, odkryłem tawerny pełne opowieści o bohaterach i mitach.",
          date: "20 czerwca 2023",
          likes: 42,
          comments: [
            { id: 1, author: "Freya", text: "To brzmi jak opowieść z Asgardu! Niesamowite!", date: "21 czerwca 2023" },
            { id: 2, author: "Thor", text: "Czy smok nadal strzeże skarbów? Muszę to sprawdzić!", date: "22 czerwca 2023" }
          ],
          images: [
            "https://images.unsplash.com/photo-1533856493584-0c6ca8ca9ce3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1556885972-0a84b7d0d7a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
          ]
        },
        {
          id: 2,
          tripId: 2,
          title: "Morska Saga Gdańska",
          content: "Wyruszyłem na północ, gdzie Gdańsk, miasto pod opieką Njorda, boga mórz, otworzył przede mną swoje bramy. Spacerując po Długim Targu, czułem powiew morskiego wiatru, a w Muzeum II Wojny Światowej odkryłem historie, które przypominały o walce i odwadze. Wieczorem, przy świetle księżyca, słyszałem pieśni żeglarzy w tawernach portowych.",
          date: "30 lipca 2023",
          likes: 33,
          comments: [
            { id: 1, author: "Loki", text: "Gdańsk? Idealne miejsce na moje sztuczki!", date: "1 sierpnia 2023" }
          ],
          images: [
            "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
          ]
        }
      ];

    setStories(mockStories);
    if (id) {
      const story = mockStories.find(s => s.id === parseInt(id));
      setActiveStory(story);
    }
  }, [id]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const updatedStory = {
      ...activeStory,
      comments: [
        ...activeStory.comments,
        {
          id: Date.now(),
          author: "Ty",
          text: newComment,
          date: new Date().toLocaleDateString('pl-PL')
        }
      ]
    };
    
    setActiveStory(updatedStory);
    setNewComment('');
    
    // W praktyce - wysłanie do API
    setStories(stories.map(s => s.id === updatedStory.id ? updatedStory : s));
  };

  const handleLike = () => {
    const updatedStory = {
      ...activeStory,
      likes: activeStory.likes + 1
    };
    
    setActiveStory(updatedStory);
    setStories(stories.map(s => s.id === updatedStory.id ? updatedStory : s));
  };

  const handleEditStory = () => {
    if (isEditing) {
      // Zapisz zmiany
      const updatedStory = {
        ...activeStory,
        content: editContent
      };
      
      setActiveStory(updatedStory);
      setStories(stories.map(s => s.id === updatedStory.id ? updatedStory : s));
    } else {
      // Rozpocznij edycję
      setEditContent(activeStory.content);
    }
    setIsEditing(!isEditing);
  };

  const handleDeleteStory = () => {
    if (window.confirm('Czy na pewno chcesz usunąć tę historię?')) {
      setStories(stories.filter(s => s.id !== activeStory.id));
      navigate('/stories');
    }
  };

  return (
    <div className="storytelling-container">
      {/* Widok listy historii */}
      {!activeStory && (
        <>
          <header className="stories-header">
            <button className="back-button" onClick={() => navigate(-1)}>
              <FaArrowLeft /> Wróć
            </button>
            <h1><FaBookOpen /> Fantastyczne Wyprawy i Opowieści</h1>
            <button 
              className="new-story-button"
              onClick={() => navigate('/story/new')}
            >
              <FaPlus /> Nowa historia
            </button>
          </header>

          <div className="stories-list">
            {stories.length > 0 ? (
              stories.map(story => (
                <motion.div 
                  key={story.id}
                  className="story-card"
                  whileHover={{ y: -3 }}
                  onClick={() => navigate(`/stories/${story.id}`)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="story-image" style={{ backgroundImage: `url(${story.images[0]})` }}>
                    <div className="story-likes">
                      <FaHeart /> {story.likes}
                    </div>
                  </div>
                  <div className="story-content">
                    <h3>{story.title}</h3>
                    <p className="story-date">{story.date}</p>
                    <p className="story-excerpt">{story.content.substring(0, 100)}...</p>
                    <div className="story-stats">
                      <span><FaComment /> {story.comments.length}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="no-stories">
                <p>Nie masz jeszcze żadnych historii</p>
                <button 
                  className="create-story-button"
                  onClick={() => navigate('/story/new')}
                >
                  <FaPlus /> Stwórz pierwszą historię
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Widok pojedynczej historii */}
      {activeStory && (
        <div className="story-detail">
          <header className="story-header">
            <button className="back-button" onClick={() => navigate('/stories')}>
              <FaArrowLeft /> Wszystkie historie
            </button>
            
            <div className="story-actions">
              <button 
                className="edit-button"
                onClick={handleEditStory}
              >
                <FaEdit /> {isEditing ? 'Zapisz' : 'Edytuj'}
              </button>
              <button 
                className="delete-button"
                onClick={handleDeleteStory}
              >
                <FaTrash /> Usuń
              </button>
            </div>
          </header>

          <motion.div 
            className="story-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1>{activeStory.title}</h1>
            <p className="story-meta">
              <span className="story-date">{activeStory.date}</span>
              <span className="story-likes" onClick={handleLike}>
                <FaHeart /> {activeStory.likes}
              </span>
            </p>

            {isEditing ? (
              <textarea
                className="story-edit-content"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
            ) : (
              <div className="story-text">
                {activeStory.content.split('\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            )}

            <div className="story-gallery">
              {activeStory.images.map((image, index) => (
                <motion.div 
                  key={index}
                  className="gallery-image"
                  style={{ backgroundImage: `url(${image})` }}
                  whileHover={{ scale: 1.02 }}
                />
              ))}
            </div>

            <div className="story-share">
              <button className="share-button">
                <FaShare /> Udostępnij historię
              </button>
            </div>
          </motion.div>

          <div className="story-comments">
            <h2>Komentarze ({activeStory.comments.length})</h2>
            
            <div className="comment-form">
              <input
                type="text"
                placeholder="Dodaj komentarz..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
              />
              <button onClick={handleAddComment}>Dodaj</button>
            </div>

            <div className="comments-list">
              {activeStory.comments.map(comment => (
                <div key={comment.id} className="comment">
                  <div className="comment-header">
                    <span className="comment-author">{comment.author}</span>
                    <span className="comment-date">{comment.date}</span>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StorytellingPage;
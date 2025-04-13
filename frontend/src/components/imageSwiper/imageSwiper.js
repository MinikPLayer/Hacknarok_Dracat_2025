// ImageSwiper.jsx
import { useEffect, useState, useRef } from 'react';
import { useGesture } from 'react-use-gesture';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { FaArrowRight, FaHeart, FaTimes, FaMapMarkerAlt, FaStar, FaArrowLeft } from 'react-icons/fa';
import './imageSwiper.css';

const TinderCard = ({ card, onSwipe, setLastSwipe, navbarHeight, isTopCard }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isLeaving, setIsLeaving] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const bind = useGesture({
    onDrag: ({ down, movement: [mx, my], velocity }) => {
      if (!isTopCard || isExpanded) return; // Tylko górna karta reaguje na gesty

      if (!down && (Math.abs(mx) > 100 || Math.abs(my) > 100)) {
        const direction =
          Math.abs(mx) > Math.abs(my)
            ? mx > 0
              ? 'right'
              : 'left'
            : my < 0
            ? 'up'
            : null;

        if (direction) {
          setLastSwipe(direction);
          setSwipeDirection(direction);
          if (direction === 'up') {
            setIsExpanded(true); // Rozszerz kartę zamiast swipe
          } else {
            handleSwipe(direction);
          }
        }
      } else {
        const maxX = 200;
        const maxY = 300;
        const minY = navbarHeight - 150;

        const limitedX = Math.min(Math.max(mx, -maxX), maxX);
        const limitedY = Math.min(Math.max(my, minY), maxY);

        setPosition({ x: limitedX, y: limitedY });
        setRotation(limitedX / 15);
        setSwipeDirection(
          Math.abs(mx) > 50
            ? mx > 0
              ? 'right'
              : 'left'
            : my < -50
            ? 'up'
            : null
        );
      }
    },
  });

  const handleSwipe = (direction) => {
    setIsLeaving(true);
    const finalPosition = {
      right: { x: 600, y: 0 },
      left: { x: -600, y: 0 },
    }[direction];

    setPosition(finalPosition);
    setRotation(direction === 'right' ? 30 : -30);

    setTimeout(() => {
      onSwipe(direction);
      setIsLeaving(false);
      setPosition({ x: 0, y: 0 });
      setRotation(0);
      setSwipeDirection(null);
    }, 400);
  };

  const getOverlay = () => {
    if (!swipeDirection || isExpanded) return null;
    return (
      <motion.div
        className={`swipe-overlay ${swipeDirection}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 0.2 }}
      >
        {swipeDirection === 'right' && <FaHeart />}
        {swipeDirection === 'left' && <FaTimes />}
        {swipeDirection === 'up' && <FaArrowRight />}
      </motion.div>
    );
  };

  return (
    <motion.div
      className="tinder-card-wrapper"
      initial={{ scale: 1 }}
      animate={{
        scale: isTopCard ? 1 : 0.95,
        zIndex: isTopCard ? 10 : 5,
        opacity: isTopCard ? 1 : 0.8,
      }}
      transition={{ duration: 0.3 }}
    >
      <Card
        {...(isTopCard && !isExpanded ? bind() : {})}
        className="tinder-card"
        sx={{
          transform: !isExpanded
            ? `translate3d(${position.x}px, ${position.y}px, 0) rotate(${rotation}deg)`
            : 'none',
          transition: isLeaving ? 'all 0.4s ease' : 'none',
          position: 'absolute',
          width: isExpanded ? { xs: '95vw', sm: '85vw', md: '70vw' } : { xs: '90vw', sm: '75vw', md: '60vw' },
          maxWidth: isExpanded ? '800px' : '600px',
          height: isExpanded ? 'auto' : { xs: '75vh', sm: '80vh' },
          maxHeight: isExpanded ? 'none' : '700px',
          cursor: isExpanded ? 'default' : 'grab',
          touchAction: isExpanded ? 'auto' : 'none',
          userSelect: 'none',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          bgcolor: 'white',
        }}
      >
        <Box sx={{ position: 'relative', minHeight: isExpanded ? 'auto' : '100%' }}>
          {!isExpanded ? (
            <>
              <CardMedia
                component="img"
                image={card.image || 'https://via.placeholder.com/600x400?text=No+Image'}
                alt={card.name}
                sx={{
                  height: '40%',
                  objectFit: 'cover',
                  borderTopLeftRadius: '16px',
                  borderTopRightRadius: '16px',
                }}
              />
              {getOverlay()}
              <CardContent
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  p: 3,
                  bgcolor: 'white',
                }}
              >
                <Typography
                  variant="h4"
                  component="div"
                  sx={{
                    fontWeight: 700,
                    color: '#2d3748',
                    mb: 2,
                    fontSize: { xs: '1.5rem', sm: '2rem' },
                  }}
                >
                  {card.name}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#4b5563',
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    lineHeight: 1.6,
                    flex: 1,
                    overflowY: 'auto',
                  }}
                >
                  {card.description}
                </Typography>
              </CardContent>
            </>
          ) : (
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconButton
                  onClick={() => setIsExpanded(false)}
                  sx={{ color: '#1e90ff', mr: 2 }}
                  aria-label="Zamknij szczegóły"
                >
                  <FaArrowLeft />
                </IconButton>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: '#2d3748',
                    fontSize: { xs: '1.5rem', sm: '2rem' },
                  }}
                >
                  {card.name}
                </Typography>
              </Box>
              <CardMedia
                component="img"
                image={card.image}
                alt={card.name}
                sx={{
                  height: { xs: '200px', sm: '300px' },
                  objectFit: 'cover',
                  borderRadius: '8px',
                  mb: 3,
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FaMapMarkerAlt style={{ color: '#1e90ff', marginRight: '8px' }} />
                <Typography variant="body2" color="#4b5563">
                  {card.details.location}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FaStar style={{ color: '#f59e0b', marginRight: '8px' }} />
                <Typography variant="body2" color="#4b5563">
                  Ocena: {card.details.rating}
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{ color: '#2d3748', lineHeight: 1.6, mb: 3 }}
              >
                {card.details.fullDescription}
              </Typography>
              {card.details.additionalImages.length > 0 && (
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    overflowX: 'auto',
                    pb: 2,
                    mb: 3,
                    '&::-webkit-scrollbar': {
                      height: '8px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: '#e2e8f0',
                      borderRadius: '4px',
                    },
                  }}
                >
                  {card.details.additionalImages.map((img, index) => (
                    <Box
                      key={index}
                      component="img"
                      src={img}
                      alt={`Zdjęcie ${index + 1}`}
                      sx={{
                        width: '140px',
                        height: '140px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        flexShrink: 0,
                      }}
                    />
                  ))}
                </Box>
              )}
              {card.details.video && (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{ color: '#2d3748', mb: 1, fontWeight: 600 }}
                  >
                    Wideo
                  </Typography>
                  <Box
                    component="iframe"
                    src={card.details.video}
                    title={`${card.name} video`}
                    sx={{
                      width: '100%',
                      height: { xs: '200px', sm: '300px' },
                      borderRadius: '8px',
                      border: 'none',
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </Box>
              )}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{ color: '#2d3748', mb: 2, fontWeight: 600 }}
                >
                  Opinie
                </Typography>
                {card.details.reviews.map((review, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 2,
                      bgcolor: '#f8fafc',
                      borderRadius: '8px',
                      mb: 1,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: '#2d3748', mb: 0.5 }}
                    >
                      {review.author}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          style={{
                            color: i < review.rating ? '#f59e0b' : '#e2e8f0',
                            fontSize: '1rem',
                            marginRight: '4px',
                          }}
                        />
                      ))}
                    </Box>
                    <Typography variant="body2" sx={{ color: '#4b5563' }}>
                      {review.comment}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: '#1e90ff',
                    color: 'white',
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 600,
                    flex: 1,
                    '&:hover': { bgcolor: '#ff6b6b' },
                  }}
                  startIcon={<FaHeart />}
                >
                  Dodaj do ulubionych
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: '#1e90ff',
                    color: '#1e90ff',
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 600,
                    flex: 1,
                    '&:hover': { bgcolor: '#1e90ff', color: 'white' },
                  }}
                  onClick={() => setIsExpanded(false)}
                >
                  Zamknij szczegóły
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Card>
    </motion.div>
  );
};

const ImageSwiper = () => {
  const [cards, setCards] = useState([
    {
      id: 1,
      name: 'Zamek w Malborku',
      description:
        'Majestatyczna gotycka twierdza, pełna historii i tajemnic.',
      image:
        'https://bi.im-g.pl/im/7f/27/1e/z31617663IHR,Ktory-zamek-jest-najwiekszy-na-swiecie-.jpg',
      details: {
        fullDescription:
          'Ta imponująca gotycka twierdza to jeden z największych zamków na świecie. Otoczony malowniczymi murami, oferuje zwiedzającym podróż w czasie do średniowiecza. Wewnątrz znajdują się muzea z eksponatami militariów i sztuki, a także piękne krużganki i sale rycerskie.',
        location: 'Północna Polska',
        rating: 4.8,
        additionalImages: [
          'https://przekraczajacgranice.pl/wp-content/uploads/2022/08/zamek-w-malborku-1.jpg',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        ],
        video: 'https://youtu.be/zFidNgzElbU?si=ReNVm-a0YQPsnfVi', // Film o zamku (ogólny zamek gotycki)
        reviews: [
          {
            author: 'Anna K.',
            rating: 5,
            comment: 'Niesamowite miejsce, pełne historii. Wspaniałe eksponaty!',
          },
          {
            author: 'Piotr M.',
            rating: 4,
            comment: 'Zamek robi wrażenie, ale tłumy mogą przeszkadzać.',
          },
        ],
      },
    },
    {
      id: 2,
      name: 'Kopalnia Soli w Wieliczce',
      description:
        'Podziemny labirynt solnych korytarzy i kaplic.',
      image:
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      details: {
        fullDescription:
          'Ten podziemny kompleks to prawdziwy cud natury i techniki. Korytarze wykute w soli skrywają zapierające dech w piersiach kaplice, rzeźby i jeziora. To miejsce oferuje nie tylko historię, ale także unikalny mikroklimat, który przyciąga turystów z całego świata.',
        location: 'Południowa Polska',
        rating: 4.7,
        additionalImages: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        ],
        video: 'https://www.youtube.com/embed/Xr2pH7sIzEg', // Film o podziemnych jaskiniach
        reviews: [
          {
            author: 'Kasia L.',
            rating: 5,
            comment: 'Magiczne miejsce, kaplica zapiera dech!',
          },
          {
            author: 'Tomasz W.',
            rating: 4,
            comment: 'Warto zobaczyć, choć trasa mogłaby być dłuższa.',
          },
        ],
      },
    },
    {
      id: 3,
      name: 'Białowieski Park Narodowy',
      description:
        'Puszcza pełna dzikiej przyrody i majestatycznych żubrów.',
      image:
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      details: {
        fullDescription:
          'Ten pierwotny las to jeden z ostatnich takich ekosystemów w Europie. Dom dla żubrów i niezliczonych gatunków roślin i zwierząt, park oferuje szlaki piesze, rowerowe oraz możliwość obcowania z naturą w jej najczystszej formie. To idealne miejsce na spokojny wypoczynek.',
        location: 'Wschodnia Polska',
        rating: 4.9,
        additionalImages: [
          'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        ],
        video: 'https://www.youtube.com/embed/Uv7W1VTSM0s', // Film o parku narodowym
        reviews: [
          {
            author: 'Marta Z.',
            rating: 5,
            comment: 'Cud natury, żubry to niesamowity widok!',
          },
          {
            author: 'Jan K.',
            rating: 5,
            comment: 'Spokój i piękno, idealne na reset.',
          },
        ],
      },
    },
  ]);
  const [lastSwipe, setLastSwipe] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef(null);
  const navbarHeight = 140;
  const navigate = useNavigate();

  useEffect(() => {
    if (cards.length === 0) {
      navigate('/map');
    }
  }, [cards, navigate]);

  const handleSwipe = (direction, id) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
    if (!isMuted && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: { xs: '100px', sm: '120px' },
        px: 2,
      }}
    >
      <audio
        ref={audioRef}
        src="https://assets.mixkit.co/sfx/preview/mixkit-quick-swoosh-1474.mp3"
        muted={isMuted}
      />

      <IconButton
        onClick={toggleMute}
        sx={{
          position: 'fixed',
          top: { xs: '70px', sm: '80px' },
          right: '20px',
          zIndex: 1000,
          bgcolor: 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          '&:hover': {
            bgcolor: '#e2e8f0',
            transform: 'scale(1.1)',
          },
          transition: 'all 0.2s ease',
        }}
        aria-label={isMuted ? 'Włącz dźwięk' : 'Wycisz dźwięk'}
      >
        {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
      </IconButton>

      <Box
        sx={{
          position: 'relative',
          width: { xs: '95vw', sm: '85vw', md: '70vw' },
          maxWidth: '800px',
          height: { xs: 'auto', sm: 'auto' },
          minHeight: { xs: '75vh', sm: '80vh' },
          perspective: '1000px',
        }}
      >
        <AnimatePresence>
          {cards.map((card, index) => (
            <TinderCard
              key={card.id}
              card={card}
              onSwipe={(direction) => handleSwipe(direction, card.id)}
              setLastSwipe={setLastSwipe}
              navbarHeight={navbarHeight}
              isTopCard={index === cards.length - 1} // Tylko ostatnia karta jest interaktywna
            />
          ))}
        </AnimatePresence>
      </Box>

      {lastSwipe && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Typography
            variant="h6"
            sx={{
              mt: 4,
              color: '#4b5563',
              fontWeight: 500,
              bgcolor: 'white',
              px: 3,
              py: 1,
              borderRadius: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            Ostatni ruch:{' '}
            {lastSwipe === 'up'
              ? 'Rozszerzono szczegóły'
              : lastSwipe === 'right'
              ? 'Polubiono'
              : 'Odrzucono'}
          </Typography>
        </motion.div>
      )}
    </Box>
  );
};

export default ImageSwiper;
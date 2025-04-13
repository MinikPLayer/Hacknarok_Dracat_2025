import { useEffect, useState, useRef } from 'react';
import { useGesture } from 'react-use-gesture';
import { Box, Button, Typography, IconButton, Card, CardContent, CardMedia } from "@mui/material";
import { useNavigate } from "react-router-dom";
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

const TinderCard = ({ card, onSwipe, setLastSwipe, navbarHeight }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isLeaving, setIsLeaving] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);

  const bind = useGesture({
    onDrag: ({ down, movement: [mx, my], velocity }) => {
      if (!down && (Math.abs(mx) > 100 || Math.abs(my) > 100)) {
        const direction =
          Math.abs(mx) > Math.abs(my)
            ? mx > 0 ? 'right' : 'left'
            : my < 0 ? 'up' : null;

        if (direction) {
          setLastSwipe(direction);
          setSwipeDirection(direction);
          handleSwipe(direction);
        }
      } else {
        const maxX = 200;
        const maxY = 300;
        const minY = navbarHeight - 150;
        
        const limitedX = Math.min(Math.max(mx, -maxX), maxX);
        const limitedY = Math.min(Math.max(my, minY), maxY);

        setPosition({ x: limitedX, y: limitedY });
        setRotation(limitedX / 20);
        
        // Set temporary direction during drag for visual feedback
        if (Math.abs(mx) > 50) {
          setSwipeDirection(mx > 0 ? 'right' : 'left');
        } else if (my < -50) {
          setSwipeDirection('up');
        } else {
          setSwipeDirection(null);
        }
      }
    }
  });

  const handleSwipe = (direction) => {
    setIsLeaving(true);
    const finalPosition = {
      right: { x: 500, y: 0 },
      left: { x: -500, y: 0 },
      up: { x: 0, y: -500 },
    }[direction];

    setPosition(finalPosition);
    setRotation(direction === 'right' ? 45 : direction === 'left' ? -45 : 0);

    setTimeout(() => {
      onSwipe(direction);
      setIsLeaving(false);
      setPosition({ x: 0, y: 0 });
      setRotation(0);
    }, 300);
  };

  const getBorderColor = () => {
    if (!swipeDirection) return 'transparent';
    
    return {
      right: '#4CAF50', // green
      left: '#F44336',  // red
      up: '#FFEB3B'     // yellow
    }[swipeDirection];
  };

  return (
    <Card
    {...bind()}
    sx={{
      transform: `translate3d(${position.x}px, ${position.y}px, 0) rotate(${rotation}deg)`,
      transition: isLeaving ? 'all 0.3s ease' : 'none',
      position: 'absolute',
      width: { xs: '90vw', md: '60vw' },
      maxWidth: '600px',
      height: '80vh',
      maxHeight: '700px',
      cursor: 'grab',
      touchAction: 'none',
      userSelect: 'none',
      display: 'flex',
      flexDirection: 'column',
      border: `4px solid ${getBorderColor()}`,
      boxSizing: 'border-box',
      '&:hover': {
        boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
      }
    }}
  >
      <CardMedia
        component="img"
        height="250"
        image="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRLM_YMOn41npXKC5fX-TSRfe20jO-nK1cfON36eskj5100UzlH4JMmJVsjNYxZPV4R0vw6DHIw0dqN-osUB5Iw7Q"
        alt={card.name}
        sx={{
          objectFit: 'cover',
          borderTopLeftRadius: '4px',
          borderTopRightRadius: '4px',
        }}
      />
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography gutterBottom variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
          {card.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ 
          fontSize: '1.1rem',
          lineHeight: 1.6,
          flex: 1,
          overflowY: 'auto',
          py: 1,
        }}>
          {card.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

const ImageSwiper = () => {
  const [cards, setCards] = useState([
    { 
      id: 1, 
      name: "Zamek w Malborku", 
      description: "Największy zamek na świecie pod względem powierzchni. Gotycka twierdza nad Nogatem, dawna siedziba wielkich mistrzów zakonu krzyżackiego. Wpisany na listę UNESCO w 1997 roku. Obecnie mieści muzeum z bogatą kolekcją militariów i bursztynu." 
    },
    { 
      id: 2, 
      name: "Kopalnia Soli w Wieliczce", 
      description: "Jedna z najstarszych kopalni soli na świecie, działająca nieprzerwanie od XIII wieku. Podziemne trasy turystyczne, kaplice i jeziora solne. Wpisana na listę UNESCO w 1978 roku. Unikalny mikroklimat korzystnie wpływa na zdrowie." 
    },
    { 
      id: 3, 
      name: "Białowieski Park Narodowy", 
      description: "Ostatni naturalny las pierwotny w Europie, chroniący żubra europejskiego. Wpisany na listę UNESCO w 1979 roku. Obszar o wyjątkowej bioróżnorodności z licznymi szlakami turystycznymi i muzeum przyrodniczym." 
    }
  ]);
  const [lastSwipe, setLastSwipe] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef(null);
  const navbarHeight = 140;
  const navigate = useNavigate();

  useEffect(() => {
    if (cards.length === 0) {
      navigate("/map");
    }
  }, [cards, navigate]);

  const handleSwipe = (direction, id) => {
    console.log(`Swiped ${direction} on card ${id}`);
    setCards(cards.filter(card => card.id !== id));
    
    if (!isMuted && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <Box sx={{ 
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      alignItems: 'center',
      mt: '110px',
      position: 'relative',
      width: '100%',
    }}>
      <audio ref={audioRef} src="" muted={isMuted} />
      
      <IconButton
        onClick={toggleMute}
        sx={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          zIndex: 1000,
          backgroundColor: 'rgba(255,255,255,0.9)',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,1)'
          }
        }}
      >
        {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
      </IconButton>

      <Box sx={{ 
        position: 'relative',
        margin: 'auto',
        height: '80vh',
        maxHeight: '700px',
        width: { xs: '90vw', md: '60vw' },
        maxWidth: '600px',
      }}>
        {cards.map((card) => (
          <TinderCard
            key={card.id}
            card={card}
            onSwipe={(direction) => handleSwipe(direction, card.id)}
            setLastSwipe={setLastSwipe}
            navbarHeight={navbarHeight}
          />
        ))}
      </Box>

      {lastSwipe && (
        <Typography variant="h6" sx={{ mt: 4, color: 'text.secondary' }}>
          Ostatni ruch: {lastSwipe === 'up' ? 'w górę' : lastSwipe === 'right' ? 'w prawo' : 'w lewo'}
        </Typography>
      )}
    </Box>
  );
};

export default ImageSwiper;
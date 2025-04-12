import { useState, useEffect } from 'react';
import { useGesture } from 'react-use-gesture';
import { Box, Button, Typography, IconButton } from "@mui/material";
import { VolumeOff, VolumeUp } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const MediaCard = ({ card, isActive, onSwipe, setLastSwipe, navbarHeight }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isLeaving, setIsLeaving] = useState(false);
  const [scale, setScale] = useState(1);
  const [isMuted, setIsMuted] = useState(true);

  const maxX = 200;
  const maxY = 300;
  const minY = navbarHeight - 150;

  const bind = useGesture({
    onDrag: ({ down, movement: [mx, my], velocity, direction: [dx] }) => {
      if (!down && (Math.abs(mx) > 100 || Math.abs(my) > 100)) {
        const direction = Math.abs(mx) > Math.abs(my)
          ? mx > 0 ? 'right' : 'left'
          : my < 0 ? 'up' : null;

        if (direction) {
          setLastSwipe(direction);
          handleSwipe(direction);
        }
      } else {
        const limitedX = Math.min(Math.max(mx, -maxX), maxX);
        const limitedY = Math.min(Math.max(my, minY), maxY);

        setPosition({ x: limitedX, y: limitedY });
        setRotation(limitedX / 20);
        setScale(down ? 1.05 : 1);
      }
    },
    onHover: ({ hovering }) => setScale(hovering ? 1.02 : 1)
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

  return (
    <Box
      {...bind()}
      sx={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0) 
                   rotate(${rotation}deg) 
                   scale(${scale})`,
        transition: isLeaving ? 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'transform 0.2s',
        position: 'absolute',
        width: '85vw',
        height: '65vh',
        backgroundColor: '#fff',
        borderRadius: 4,
        boxShadow: 6,
        cursor: 'grab',
        touchAction: 'none',
        overflow: 'hidden',
        opacity: isLeaving ? 0 : 1,
        '&:active': { cursor: 'grabbing' },
      }}
    >
      <Box sx={{
  position: 'relative',
  height: '70%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'transparent',
  overflow: 'hidden'
}}>
  {card.video ? (
    <>
      <video
        autoPlay
        loop
        muted={isMuted}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center'
        }}
      >
        <source src={card.video} type="video/mp4" />
      </video>
      <IconButton
        sx={{ position: 'absolute', bottom: 8, right: 8 }}
        onClick={() => setIsMuted(!isMuted)}
      >
        {isMuted ? <VolumeOff /> : <VolumeUp />}
      </IconButton>
    </>
  ) : (
    <img
      src={card.image}
      alt={card.name}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center'
      }}
    />
  )}
</Box>

      <Box sx={{ p: 3, height: '30%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          {card.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {card.description}
        </Typography>
      </Box>

      {!isLeaving && (
        <Box sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          backgroundColor: 'rgba(0,0,0,0.6)',
          color: 'white',
          px: 1.5,
          py: 0.5,
          borderRadius: 2,
          fontSize: '0.8rem'
        }}>
          Sample Text
        </Box>
      )}
    </Box>
  );
};

const ImageSwiper = () => {
  const [cards, setCards] = useState([
    {
      id: 1,
      name: "Adventure Time",
      description: "Explore new possibilities and exciting challenges",
      image: "https://source.unsplash.com/random/800x600?nature"
    },
    {
      id: 2,
      name: "City Lights",
      description: "Discover urban landscapes and nightlife",
      video: "https://www.w3schools.com/html/mov_bbb.mp4"
    }
  ]);

  const [lastSwipe, setLastSwipe] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (cards.length === 0) {
      navigate("/map");
    }
  }, [cards, navigate]);

  const handleSwipe = (direction, id) => {
    setCards(cards.filter(card => card.id !== id));
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      pt: `120px`,
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <Box sx={{
        position: 'relative',
        width: '90vw',
        height: '70vh',
        maxWidth: 500,
        margin: 'auto'
      }}>
        {cards.map((card, index) => (
          <MediaCard
            key={card.id}
            card={card}
            isActive={index === 0}
            onSwipe={(direction) => handleSwipe(direction, card.id)}
            setLastSwipe={setLastSwipe}
            navbarHeight={140}
          />
        ))}
      </Box>

      <Box sx={{
        mt: 4,
        textAlign: 'center',
        transition: 'opacity 0.3s',
        opacity: lastSwipe ? 1 : 0
      }}>
        <Typography
          variant="h6"
          sx={{
            color: lastSwipe === 'right' ? 'success.main' :
                  lastSwipe === 'left' ? 'error.main' : 'warning.main',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          {lastSwipe === 'right' && 'Liked! 👍'}
          {lastSwipe === 'left' && 'Disliked! 👎'}
          {lastSwipe === 'up' && 'Super! ⭐'}
        </Typography>
      </Box>
    </Box>
  );
};

export default ImageSwiper;
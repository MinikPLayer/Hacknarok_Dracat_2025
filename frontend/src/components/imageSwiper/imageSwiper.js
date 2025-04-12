import {useEffect, useState} from 'react';
import { useGesture } from 'react-use-gesture';
import {Box, Button, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";

const TinderCard = ({ card, onSwipe, setLastSwipe, navbarHeight }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isLeaving, setIsLeaving] = useState(false);

  // Boundaries (X: left/right, Y: up/down)
  const maxX = 200;
  const maxY = 300;
  const minY = navbarHeight - 150; // Adjusted to prevent excessive upward drag under the navbar

  const bind = useGesture({
    onDrag: ({ down, movement: [mx, my], velocity }) => {
      if (!down && (Math.abs(mx) > 100 || Math.abs(my) > 100)) {
        const direction =
          Math.abs(mx) > Math.abs(my)
            ? mx > 0 ? 'right' : 'left'
            : my < 0 ? 'up' : null; // Prevent downward swipe by checking only 'up' or left/right

        if (direction) {
          if (direction === 'up') {
            setLastSwipe('up');
          } else if (direction === 'left' || direction === 'right') {
            setLastSwipe(direction);
          }
          handleSwipe(direction);
        }
      } else {
        // Apply boundaries
        const limitedX = Math.min(Math.max(mx, -maxX), maxX);
        const limitedY = Math.min(Math.max(my, minY), maxY); // Enforce minY (top limit)

        setPosition({ x: limitedX, y: limitedY });
        setRotation(limitedX / 20);
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

  return (
    <div
      {...bind()}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0) rotate(${rotation}deg)`,
        transition: isLeaving ? 'all 0.3s ease' : 'none',
        position: 'absolute',
        width: '90vw', // Set the width to 90% of the viewport width
        height: '80vh', // Set the height to 80% of the viewport height
        backgroundColor: '#fff',
        borderRadius: '15px',
        boxShadow: '0 10px 20px rgba(0,0,0,0.19)',
        cursor: 'grab',
        touchAction: 'none',
        userSelect: 'none', // Prevent text selection (copying)
      }}
    >
      <div style={{ padding: '20px' }}>
        <img src={"https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRLM_YMOn41npXKC5fX-TSRfe20jO-nK1cfON36eskj5100UzlH4JMmJVsjNYxZPV4R0vw6DHIw0dqN-osUB5Iw7Q"}/>
        <h2>{card.name}</h2>
        <p>{card.description}</p>
      </div>
    </div>
  );
};

const ImageSwiper = () => {
  const [cards, setCards] = useState([
    { id: 1, name: "Karta 1", description: "Opis karty 1" },
    { id: 2, name: "Karta 2", description: "Opis karty 2" },
    { id: 3, name: "Karta 3", description: "Opis karty 3" }
  ]);
  const [lastSwipe, setLastSwipe] = useState(null);
  const navbarHeight = 140;
  const navigate = useNavigate();

  // Add useEffect hook to handle navigation
  useEffect(() => {
    if (cards.length === 0) {
      navigate("/map");
    }
  }, [cards, navigate]); // Trigger when cards array changes

  const handleSwipe = (direction, id) => {
    console.log(`Swiped ${direction} on card ${id}`);
    setCards(cards.filter(card => card.id !== id));
  };

  return (
    <div style={{ justifyContent: 'center', marginTop: '110px', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ position: 'relative', margin: "auto", height: '70vh', width: '90vw' }}>
        {cards.map((card) => (
          <TinderCard
            key={card.id}
            card={card}
            onSwipe={(direction) => handleSwipe(direction, card.id)}
            setLastSwipe={setLastSwipe}
            navbarHeight={navbarHeight}
          />
        ))}
        {/* Remove the navigate-in-render fragment here */}
      </div>

      {/* Swipe Direction Text remains the same */}
    </div>
  );
};

export default ImageSwiper;

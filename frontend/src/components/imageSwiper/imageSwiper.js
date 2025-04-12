import { useState } from 'react';
import { useGesture } from 'react-use-gesture';

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
        width: '300px',
        height: '400px',
        backgroundColor: '#fff',
        borderRadius: '15px',
        boxShadow: '0 10px 20px rgba(0,0,0,0.19)',
        cursor: 'grab',
        touchAction: 'none',
        userSelect: 'none', // Prevent text selection (copying)
      }}
    >
      <div style={{ padding: '20px' }}>
        <h2>{card.name}</h2>
        <p>{card.description}</p>
        <div style={{ position: 'absolute', bottom: '20px', width: '100%' }}>
          <button onClick={() => { setLastSwipe('left'); handleSwipe('left'); }}>👎</button>
          <button onClick={() => { setLastSwipe('up'); handleSwipe('up'); }}>⭐</button>
          <button onClick={() => { setLastSwipe('right'); handleSwipe('right'); }}>👍</button>
        </div>
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
  const [lastSwipe, setLastSwipe] = useState(null); // Track last swipe globally

  const navbarHeight = 60; // Assuming navbar height is 60px (adjust based on actual navbar height)

  const handleSwipe = (direction, id) => {
    console.log(`Swiped ${direction} on card ${id}`);
    setCards(cards.filter(card => card.id !== id));
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px', flexDirection: 'column', alignItems: 'center' }}>
      {/* Card Stack */}
      <div style={{ position: 'relative', height: '450px', width: '300px' }}>
        {cards.map((card) => (
          <TinderCard
            key={card.id}
            card={card}
            onSwipe={(direction) => handleSwipe(direction, card.id)}
            setLastSwipe={setLastSwipe}
            navbarHeight={navbarHeight} // Pass navbar height to the card component
          />
        ))}
        {cards.length === 0 && <p>No more cards!</p>}
      </div>

      {/* Swipe Direction Text */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        {lastSwipe && (
          <p style={{
            color: lastSwipe === 'right' ? 'green' :
                  lastSwipe === 'left' ? 'red' : 'gold',
            fontWeight: 'bold',
            fontSize: '1.2rem'
          }}>
            Last swipe: <strong>{lastSwipe.toUpperCase()}</strong> {lastSwipe === 'right' ? '👍' : lastSwipe === 'left' ? '👎' : '⭐'}
          </p>
        )}
      </div>
    </div>
  );
};

export default ImageSwiper;

// HomePage.jsx
import React, { useState } from 'react';
import './homepage.css';

const HomePage = () => {
  const [showMore, setShowMore] = useState(false);

  const additionalNews = [
    {
      id: '1', 
      date: '15-18.07.2021',
      title: 'Nowa przygoda w świecie Dracat!',
      description: 'Odkryj nowe możliwości podróżowania z naszą aplikacją.',
      image: '/media/kotelIcon.png',
      alt: 'Nowa przygoda Dracat', 
    },
    {
      id: '2',
      date: '01-03.08.2021',
      title: 'Wydarzenie specjalne w Krakowie',
      description: 'Dołącz do nas na wyjątkowym wydarzeniu w sercu Polski.',
      image: '/media/kotsppanko.png',
      alt: 'Wydarzenie w Krakowie',
    },
  ];

  return (
    <div className="homepage-container">
      <header className="hero-section" style={{ backgroundImage: `url('/media/tlokotel.png')` }}>
        <h1 className="site-title">The NineWonders</h1>
        <div className="qr-section">
          <p>Spróbuj naszej aplikacji mobilnej!</p>
          <p>Z nami możesz być w każdym miejscu i czasie - w podróży czy w pracy.</p>
          <div className="qr-container">
            <img src="/media/qrcode-random.png" alt="Kod QR aplikacji mobilnej" className="qr-image" />
          </div>
        </div>
      </header>

      <main className="content-wrapper">
        <aside className="left-column">
          <section className="info-section">
            <h3>Poznawaj i planuj!</h3>
            <p>Pozwól nam zaplanować Twoją podróż i polecić najlepsze miejsca według Twoich potrzeb.</p>
          </section>

          <section className="info-section">
            <h3>Podróżuj z przyjaciółmi!</h3>
            <p>Organizuj grupowe wyjazdy, dziel się doświadczeniami i twórz niezapomniane wspomnienia.</p>
          </section>
        </aside>

        <section className="center-column" aria-label="Aktualności">
          <h2 className="news-title">Aktualności</h2>
          <article className="event-card">
            <div className="card-image">
              <img src="/media/cat_star.png" alt="Jack Sulley w Pandorze" className="news-image" />
            </div>
            <div className="card-content">
              <time className="card-date" dateTime="2021-06-21">21-24.06.2021</time>
              <h4>Jack Sulley odwiedził Pandorę</h4>
              <p>Przeżyj niezapomnianą przygodę z Jackiem Sulleyem w magicznej Pandorze.</p>
            </div>
          </article>

          {showMore && additionalNews.map((news) => (
            <article key={news.id} className="event-card">
              <div className="card-image">
                <img src={news.image} alt={news.alt} className="news-image" />
              </div>
              <div className="card-content">
                <time className="card-date">{news.date}</time>
                <h4>{news.title}</h4>
                <p>{news.description}</p>
              </div>
            </article>
          ))}

          <button
            className="show-more-button"
            onClick={() => setShowMore(!showMore)}
            aria-expanded={showMore}
            aria-controls="additional-news"
          >
            {showMore ? 'Pokaż mniej' : 'Pokaż więcej'}
          </button>
        </section>

        <aside className="right-column">
          <div className="cta-join">
            <h4>Co oferujemy?</h4>
            <p>Planuj, odkrywaj i dziel się swoimi podróżami!</p>
            <a href="/rejestracja" className="join-button">Dołącz do nas</a>
          </div>

          <div className="cta-extra">
            <h4>Dlaczego warto?</h4>
            <ul>
              <li>Personalizowane rekomendacje podróży</li>
              <li>Łatwe planowanie etapów podróży</li>
              <li>Możliwość dzielenia się wspomnieniami</li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default HomePage;
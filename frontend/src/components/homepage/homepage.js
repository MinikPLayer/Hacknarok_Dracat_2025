import React from 'react';
import './homepage.css';

const HomePage = () => {
  return (
    <div className="homepage-container">
      {/* Header with Background Image */}
      <header className="hero-section" style={{ backgroundImage: `url('/media/tlokotel.png')` }}>
        <h1 className="site-title">The NineWonders</h1>
        <div className="qr-section">
          <p>Spróbuj naszej aplikacji mobilnej!</p>
          <p>Od teraz możesz być z nami w każdym miejscu, w każdym momencie, gdziekolwiek jesteś, w podróży czy w pracy.</p>
          <div className="qr-container">
            <img src="/media/qrcode-random.png" alt="Kod QR do pobrania aplikacji" className="qr-image" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="content-wrapper">
        {/* Left Column */}
        <aside className="left-column">
          <section className="info-section">
            <h3>Poznawaj i planuj!</h3>
            <p>Pozwól nam zaplanować twoją podróż, bądź na bieżąco, zapamiętując etap po etapie. Polecimy ci najlepsze miejsca według tego, czego potrzebujesz.</p>
          </section>

          <section className="info-section">
            <h3>Podróżuj z przyjaciółmi!</h3>
            <p>Wspólne przygody tworzą najlepsze wspomnienia. Organizuj wyjazdy w grupie, dziel się doświadczeniami i odkrywajcie świat razem.</p>
          </section>
        </aside>

        {/* Center Column (News) */}
        <section className="center-column">
          <h2 className="news-title">Aktualności</h2>
          <article className="event-card">
            <div className="card-image">
              <img src="/media/cat_star.png" alt="Jack Sulley w Pandorze" className="news-image" />
            </div>
            <div className="card-content">
              <span className="card-date">21-24.06.2021</span>
              <h4>Jack Sulley odwiedził Pandorę w dn. 21-24.06.2021</h4>
              <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."</p>
            </div>
          </article>
        </section>

        {/* Right Column (CTA) */}
        <aside className="right-column">
          <div className="cta-join">
            <h4>Co oferujemy!</h4>
            <p>Planuj, odkrywaj i dziel się swoimi podróżami.</p>
            <a href="/rejestracja" className="join-button">Dołącz do nas</a>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default HomePage;
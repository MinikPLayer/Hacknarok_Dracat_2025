import React from 'react';
import "./about.css"

const About = () => {
  return (
    <div className="about-container">
      <div className="about-content">
        <h2 className="about-heading">O nas</h2>
        <p className="about-text">
          Jesteśmy grupą czterech pasjonatów technologii, którzy połączyli swoje umiejętności, by stworzyć innowacyjną aplikację,
          która rozwiązuje realne problemy współczesnego świata. Nasze zespoły składają się z ekspertów w dziedzinach programowania,
          projektowania UX/UI, analizy danych oraz zarządzania projektami, co pozwala nam oferować kompleksowe rozwiązania, które
          odpowiadają na potrzeby naszych użytkowników.
        </p>
        <p className="about-text">
          Jako studenci, doskonale rozumiemy, jak ważne jest łączenie teorii z praktyką. Nasza aplikacja jest efektem intensywnej pracy
          zespołowej oraz pasji do nowych technologii, którą wplatamy w każdy detal naszego produktu. Dążymy do tego, by nasze rozwiązanie
          było intuicyjne, wydajne i dostępne dla szerokiego grona użytkowników.
        </p>
        <p className="about-text">
          Naszym celem jest nie tylko tworzenie nowoczesnych aplikacji, ale także rozwój w ramach rynku technologicznego. Stale się rozwijamy,
          uczymy i wprowadzamy innowacyjne podejścia, które czynią nasze aplikacje wyjątkowymi.
        </p>
        <p className="about-text">
          Zapraszamy do odkrywania naszej aplikacji i dołączenia do grona zadowolonych użytkowników!
        </p>
      </div>
    </div>
  );
}

export default About;

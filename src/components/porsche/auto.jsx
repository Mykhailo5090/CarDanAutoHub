import React from "react";
import { Link } from "react-router-dom";
// import "./welcome.scss";

const PorschePage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userName = user ? user.name : "Гість";

  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <span className="welcome-badge">Drive Your Dream</span>
        <h1 className="welcome-title">Привіт, {userName}! 👋</h1>
        <p className="welcome-subtitle">
          Ласкаво просимо до твого персонального автопростору. Знайди свій ідеальний автомобіль або керуй обраними оголошеннями в один клік.
        </p>
        
        <div className="welcome-actions">
          <Link to="/buy" className="welcome-btn btn-primary __jump">
            Каталог авто 🚗
          </Link>
          <Link to="/favorites" className="welcome-btn btn-secondary __jump">
            Обрані ❤️
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PorschePage;
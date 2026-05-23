import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Додаємо useNavigate
import '../header/header.scss';
import logo from '../img/porschelogo.png';
import blackheartlogo from '../img/blackheart.png';
import userimg from '../img/user.png';


const Header = () => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    // Перевіряємо, чи є мітка про візит у пам'яті браузера
    const hasVisited = localStorage.getItem('hasVisitedCarDan');

    if (!hasVisited) {
      // Якщо це перший раз — позначаємо, що користувач був, і ведемо на реєстрацію
      localStorage.setItem('hasVisitedCarDan', 'true');
      navigate('/registration');
    } else {
      // Якщо вже був — ведемо на логін
      navigate('/login');
    }
  };

  return (
    <header className="header__wrapper __wrapper">
      <nav className="nav">
        <div className="hamburger-menu">
          <input id="menu__toggle" type="checkbox" />
          <label className="menu__btn" htmlFor="menu__toggle"><span></span></label>
          
          <div className='header_logo_text'>
            <Link to="/"><p className='p_p'>CarDan AutoHub</p></Link>
          </div>

          <div className='header_porsche_auto'>
            <Link to="/buy" className='porsche_logo_gap'>
              <img className="logo-img" src={logo} alt="logo" />
              <p className='p_p'>Auto</p>
            </Link>
            <Link to="/buy"><p className='p_p'>Buy</p></Link>
            <Link to="/sell"><p className='p_p'>Sell</p></Link>
            <Link to="/insurance"><p className='p_p'>Insurance</p></Link>
            <Link to="/about"><p className='p_p'>About US</p></Link>
          </div>

          <div className='header_login'>
            <Link to="/favorites" className='heart-div'>
              <img className="heart-img" src={blackheartlogo} alt="heart-like" />
            </Link>
            
            {/* Замість Link використовуємо div з нашою функцією кліку */}
            <div className='div_user' onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
              <img className="user_img" src={userimg} alt="user-logo" />
              <p className='p_p p_login'>Login</p>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
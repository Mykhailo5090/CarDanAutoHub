import React from 'react';
import { Link } from 'react-router-dom'; // Додав імпорт
import '../header/header.scss';
import logo from '../img/porschelogo.png';
import blackheartlogo from '../img/blackheart.png';
import userimg from '../img/user.png';

const Header = () => {
  return (
    <header className="header__wrapper __wrapper">
        <nav className="nav">
          <div className="hamburger-menu ">

            <input id="menu__toggle" type="checkbox" />
            <label className="menu__btn" htmlFor="menu__toggle">
              <span></span>
            </label>
      
                <div className='header_logo_text'>
                    <Link to="/"><p className='p_p'>CarDan AutoHub</p></Link>
                </div>

                <div className='header_porsche_auto'>
                    <Link to="/auto" className='porsche_logo_gap'>
                        <img className="logo-img" src={logo} alt="logo" />
                        <p className='p_p'>Auto</p>
                    </Link>
                
                    <Link to="/"><p className='p_p'>Buy</p></Link>
                    <Link to="/"><p className='p_p'>Sell</p></Link>
                    <Link to="/"><p className='p_p'>Insurance</p></Link>
                    <Link to="/"><p className='p_p'>About US</p></Link>
                </div>

                <div className='header_login'>
                    <Link to="/" className='heart-div'>
                        <img className="heart-img" src={blackheartlogo} alt="heart-like" />
                    </Link>
                    
                    <Link to="/" className='div_user'>
                        <img className="user_img" src={userimg} alt="user-logo" />
                        <p className='p_p p_login'>Login</p>
                    </Link>
                </div>

          </div>
        </nav>
    </header>
  );
};

export default Header;
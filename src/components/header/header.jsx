// import React from 'react';
// import { Link } from 'react-router-dom';
import '../header/header.scss';
import logo from '../img/porschelogo.png';
import blackheartlogo from '../img/blackheart.png';
import userimg from '../img/user.png';
// import userprofile from '../assets/images/Header/user-header.png';
// import PropTypes from 'prop-types';

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
                    <p className='p_p'>CarDan AutoHub</p></div>

                <div className='header_porsche_auto'>
                    <div className='porsche_logo_gap'>
                    <img className="logo-img" src={logo} alt="logo" />
                    <p className='p_p'>Auto</p>
                    </div>
                
                <p className='p_p'>Buy</p>
                <p className='p_p'>Sell</p>
                <p className='p_p'>Insurance</p>
                <p className='p_p'>About US</p>
                
                </div>

                <div className='header_login'>
                <img className="heart-img" src={blackheartlogo} alt="heart-like" />
                <div className='div_user'>
                <img className="user_img" src={userimg} alt="user-logo" />
                <p className='p_p p_login'>Login</p>
                </div>
                
            

                </div>

                
           
           
            
            






           
                  
              


          </div>
        </nav>
      
    </header>
  );
};
// Header.propTypes = {
//   onMenuClick: PropTypes.func.isRequired, // Validates that onMenuClick is a function and required
// };

export default Header;



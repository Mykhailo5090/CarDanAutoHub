import React from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom"; 
import "../header/header.scss";
import logo from "./img/porschelogo.png";
import blackheartlogo from "./img/blackheart.png";
import userimg from "./img/user.png";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation(); 

  const handleProfileClick = () => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      navigate("/profile");
    } else {
      const hasVisited = localStorage.getItem("hasVisitedCarDan");

      if (!hasVisited) {
        localStorage.setItem("hasVisitedCarDan", "true");
        navigate("/registration");
      } else {
        navigate("/login");
      }
    }
  };

  const isProfileActive = ["/profile", "/login", "/registration"].includes(
    location.pathname,
  );

  return (
    <header className="header__wrapper __wrapper __shadows_header">
      <nav className="nav">
        <div className="hamburger-menu">
          <input id="menu__toggle" type="checkbox" />
          <label className="menu__btn" htmlFor="menu__toggle">
            <span></span>
          </label>

          <div className="header_logo_text">
            <NavLink to="/" className="__jump">
              <p className="p_p">CarDan AutoHub</p>
            </NavLink>
          </div>

          <div className="header_porsche_auto">
            <NavLink to="/porsche" className="porsche_logo_gap __jump">
              <img className="logo-img" src={logo} alt="logo" />
              <p className="p_p ">Auto</p>
            </NavLink>
            <NavLink to="/buy" className="__jump">
              <p className="p_p">Buy</p>
            </NavLink>
            <NavLink to="/sell" className="__jump">
              <p className="p_p">Sell</p>
            </NavLink>
            <NavLink to="/insurance" className="__jump">
              <p className="p_p">Insurance</p>
            </NavLink>
            <NavLink to="/about" className="__jump">
              <p className="p_p">About US</p>
            </NavLink>
          </div>

          <div className="header_login">
            <NavLink to="/favorites" className="heart-div __jump">
              <img
                className="heart-img"
                src={blackheartlogo}
                alt="heart-like"
              />
            </NavLink>

            <div
              className={`div_user __jump ${isProfileActive ? "active" : ""}`}
              onClick={handleProfileClick}
              style={{ cursor: "pointer" }}
            >
              <img className="user_img" src={userimg} alt="user-logo" />
              <p className="p_p p_login ">
                {localStorage.getItem("user") ? "Profile" : "Login"}
              </p>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;

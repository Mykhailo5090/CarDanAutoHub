import React from 'react';
import './Footer.scss';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        <div className="footer-info">
          <h2 className="footer-logo">CarDan</h2>
          <p>Найкращий маркетплейс автомобілів</p>
          <p>© 2026 Всі права захищені</p>
        </div>

        <div className="footer-maps">
          {/* Карта 1: Офіс (Київ, Майдан) */}
          <div className="map-wrapper">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2540.6136263592185!2d30.51978257691515!3d50.44829378734261!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4ce507b9a5555%3A0x6331903337e6f88d!2z0JzQsNC50LTQsNC9INCd0LXQt9Cw0LvQtdC20L3QvtGB0YLRlg!5e0!3m2!1suk!2sua!4v1716720000000!5m2!1suk!2sua" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          </div>

          {/* Карта 2: Весь Київ */}
          <div className="map-wrapper">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d162580.4449830571!2d30.5238!3d50.4501!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1suk!2sua!4v1716720100000!5m2!1suk!2sua" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
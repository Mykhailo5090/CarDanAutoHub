import React from "react";
import "./footer.scss";
import logo from "../header/img/porschelogo.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="wrapper_footer">
        <div className="footer_maps_container">
          <div className="map_item map_item_1">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d162580.4449830571!2d30.5238!3d50.4501!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1suk!2sua!4v1716720100000!5m2!1suk!2sua"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <div className="text_map_container text_map_container_1">
              <div className="text_bkg">
                <p className="p_text_bkg">CarDan AutoHub</p>
              </div>
              <div className="text_adress">
                {" "}
                <p className="text_adress text_adress_1">Kyiv, Ukraine</p>
              </div>
              <div className="text_adress">
                {" "}
                <p className="text_adress text_adress_1">+38(097)7777777</p>
              </div>
            </div>
          </div>

          <div className="map_item map_item_2">
            <div className="text_map_container text_map_container_2">
              <div className="porsche_right_under">
                <img className="porsche_logo" src={logo} alt="porsche" />
                <p className="porsche_font_1">Porsche</p>
              </div>
              <div className="text_adress">
                {" "}
                <p className="text_adress text_adress_1">Stuttgart, Germany</p>
              </div>
              <div className="text_adress">
                {" "}
                <p className="text_adress text_adress_1">+49(77)7777777</p>
              </div>
            </div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d84196.84518961734!2d9.102234057861329!3d48.778448518991754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4799db34c1fe8ae7%3A0x422b4067b0743b0!2sStuttgart!5e0!3m2!1suk!2sua!4v1717700000000!5m2!1suk!2sua"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

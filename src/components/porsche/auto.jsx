import React from "react";
import "../porsche/auto.scss";

const PorschePage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userName = user ? user.name : "Guest";

  return (
    <div className="__container_profilepage about_page_container welcome_porsche_page">
      <div className="sub-body profile_sub-body about_sub_body auto_sub_body">
        <div className="sub-body__2 profile_sub-body__2 auto_sub_body__2">
          <div className="about_sub_body__2">
            <div className="about_text_card welcome_hero_card __shadows">
              <span className="card_badge">01 // PILOT PROFILE</span>
              <h1 className="welcome_title">Hello, {userName}! 👋</h1>
              <p>
                Welcome to your personal automotive space. Manage elite
                engineering and configure system parameters to match your own
                standards.
              </p>
            </div>

            <div className="porsche_cards_grid">
              <a
                href="https://www.porsche.com"
                target="_blank"
                rel="noopener noreferrer"
                className="about_text_card porsche_clickable_block main_porsche_hub __shadows"
              >
                <div className="block_glow_effect"></div>
                <div className="block_inner_content">
                  <span className="card_badge">🔥 OFFICIAL HUB</span>
                  <h3>Porsche Official</h3>
                  <p>
                    Immerse yourself in the world of the legendary brand,
                    analyze fresh releases, historical heritage, and the latest
                    global trends of Stuttgart engineering.
                  </p>
                  <div className="block_action_footer">
                    <span className="action_link_text">Explore Hub</span>
                    <span className="action_arrow">→</span>
                  </div>
                </div>
              </a>

              <a
                href="https://configurator.porsche.com"
                target="_blank"
                rel="noopener noreferrer"
                className="about_text_card porsche_clickable_block porsche_configurator __shadows"
              >
                <div className="block_glow_effect"></div>
                <div className="block_inner_content">
                  <span className="card_badge">⚙️ RE-ENGINEER</span>
                  <h3>Configurator</h3>
                  <p>
                    Build your unique track weapon. Customize every single
                    detail — from caliper colors and suspension types to the
                    exact stitching shade on the exclusive leather interior.
                  </p>
                  <div className="block_action_footer">
                    <span className="action_link_text">Start Build</span>
                    <span className="action_arrow">⚡</span>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PorschePage;

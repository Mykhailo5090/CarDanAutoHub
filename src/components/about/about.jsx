import React, { useEffect, useRef, useState } from "react";
import "./about.scss";

import porscheSide from "../about/img/right-por.png";
import porscheTopDown from "../about/img/back-por.png";
import porscheTopUp from "../about/img/front-por.png";

const AboutUs = () => {
  const animatedElementsRef = useRef([]);
  const [activeFeature, setActiveFeature] = useState("scrapers");
  const [activeSecurityLayer, setActiveSecurityLayer] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 },
    );

    const elements = animatedElementsRef.current.filter(Boolean);
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const addToRefs = (el) => {
    if (el && !animatedElementsRef.current.includes(el)) {
      animatedElementsRef.current.push(el);
    }
  };

  const featuresData = {
    scrapers: {
      title: "Ultra-Fast Scrapers Core",
      desc: "Our automated background infrastructure runs 24/7/365, sweeping over 50 premium automotive platforms per minute. It filters ghost listings, normalizes pricing anomalies, and updates your dashboard instantly.",
      metric: "50+ sites/min",
    },
    insurance: {
      title: "Instant API Underwriting",
      desc: "Direct encrypted connection with European and Ukrainian insurance registries. Calculates complex custom policies using raw plate numbers and VIN data in under 3.4 seconds.",
      metric: "< 3.4s Response",
    },
    analytics: {
      title: "Predictive Market AI",
      desc: "CarDan doesn't just display current prices. Our statistical models analyze historical depreciation variables, giving you an elite 12-month mathematical projection of vehicle value.",
      metric: "98.4% Accuracy",
    },
  };

  const securityLayers = [
    {
      title: "AES-256 Pipeline",
      detail:
        "All user requests, internal vehicle logs, and custom parsing streams are guarded by military-grade transport layer encryption.",
    },
    {
      title: "VIN Integrity Scan",
      detail:
        "Automated cross-referencing with international databases to instantly flag hidden structural damages or mileage rollbacks.",
    },
    {
      title: "Decentralized Ledger",
      detail:
        "Your saved vehicle portfolios and financial calculations are stored in isolated node environments ensuring absolute privacy.",
    },
  ];

  return (
    <div className="__container_profilepage about_page_container">
      <div className="sub-body profile_sub-body about_sub_body">
        <div className="sub-body__2 profile_sub-body__2 ">
          <div className="about_sub_body__2">
            <div className="about_grid_layout">
              {/* СЕКЦІЯ 1: АСИМЕТРІЯ */}
              <div className="about_section_row section_layout_1">
                <div className="left_vertical_col">
                  <div className="container_profile about_text_card tall_card __shadows">
                    <span className="card_badge">01 // STRATEGY</span>
                    <h2>Our Vision</h2>
                    <p>
                      Welcome to CarDan AutoHub, a premium digital ecosystem
                      where unbridled automotive passion seamlessly converges
                      with next-generation web automation tech. We have
                      radically redefined the boundaries of vehicle market
                      analysis, creating an elite hub tailored for smart buyers,
                      private collectors, and digital-first enthusiasts alike.
                      Our ultimate mission is to remove human error from the
                      procurement cycle entirely.
                    </p>

                    <div className="tech_metrics_grid">
                      <div className="metric_item">
                        <span className="num">240K+</span>
                        <span className="label">Vehicles Parsed Daily</span>
                      </div>
                      <div className="metric_item">
                        <span className="num">142</span>
                        <span className="label">Active Node Proxies</span>
                      </div>
                      <div className="metric_item">
                        <span className="num">&lt; 250ms</span>
                        <span className="label">Database Sync Query</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="right_staggered_col">
                  <div
                    className="about_image_container wrapper_side anim_from_right"
                    ref={addToRefs}
                  >
                    <img
                      src={porscheSide}
                      alt="Porsche Side View"
                      className="porsche_img img_natural_side"
                    />
                  </div>
                  <div className="container_profile about_text_card sub_horizontal_card __shadows">
                    <p>
                      By blending luxury aesthetics with raw mathematical
                      execution, we offer an interface that feels like driving a
                      supercar—effortless, precise, and breathtakingly fast. We
                      believe that tracking, securing, and insuring your vehicle
                      should not require days of administrative friction, but a
                      single, perfectly executed algorithmic cycle.
                    </p>
                  </div>
                </div>
              </div>

              {/* СЕКЦІЯ 2: ДРУГИЙ ПОРШ (БІЛЬШИЙ) */}
              <div className="about_section_row section_layout_2">
                <div className="image_sidebar_col">
                  <div
                    className="about_image_container wrapper_top_down anim_from_bottom"
                    ref={addToRefs}
                  >
                    <img
                      src={porscheTopDown}
                      alt="Porsche Top Down"
                      className="porsche_img img_blend_black"
                    />
                  </div>
                </div>

                <div className="main_content_col">
                  <div className="container_profile about_text_card wide_card __shadows">
                    <span className="card_badge">02 // ARCHITECTURE</span>
                    <h2>Data-Driven Execution</h2>
                    <p>
                      Speed and absolute system uptime are engineered deep into
                      our core architecture. Our environment processes intricate
                      real-time requests across multiple insurance structures,
                      verifying licenses and generating personalized dynamic
                      offers instantly.
                    </p>

                    <div className="insurance_interactive_pills">
                      {Object.keys(featuresData).map((key) => (
                        <button
                          key={key}
                          className={`pill_clicker ${activeFeature === key ? "active" : ""}`}
                          onClick={() => setActiveFeature(key)}
                        >
                          {key === "scrapers"
                            ? "🚀 Core Scrapers"
                            : key === "insurance"
                              ? "🛡️ Insure API"
                              : "📊 Market AI"}
                        </button>
                      ))}
                    </div>

                    <div className="interactive_display_box">
                      <div className="terminal_header">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="terminal_status">
                          STATUS: OPERATIONAL [{" "}
                          {featuresData[activeFeature].metric} ]
                        </span>
                      </div>
                      <h3>{featuresData[activeFeature].title}</h3>
                      <p>{featuresData[activeFeature].desc}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* СЕКЦІЯ 3: ТРЕТІЙ ПОРШ (БІЛЬШИЙ) */}
              <div className="about_section_row section_layout_3">
                <div className="main_content_col">
                  <div className="container_profile about_text_card wide_card __shadows">
                    <span className="card_badge">03 // PROTOCOL</span>
                    <h2>Uncompromised Security</h2>
                    <p>
                      Your automotive assets and search streams deserve the
                      highest tier of structural protection. We handle the
                      complex, dark layers of data validation, legal registry
                      handshakes, and cross-border compliance checks so you can
                      enjoy pure operational freedom.
                    </p>

                    <div className="security_interactive_list">
                      {securityLayers.map((layer, index) => (
                        <div
                          key={index}
                          className={`security_list_item ${activeSecurityLayer === index ? "active" : ""}`}
                          onClick={() => setActiveSecurityLayer(index)}
                        >
                          <div className="item_header">
                            <span className="indicator"></span>
                            <h4>{layer.title}</h4>
                          </div>
                          <div className="item_content">
                            <p>{layer.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="image_sidebar_col">
                  <div
                    className="about_image_container wrapper_top_up anim_from_top"
                    ref={addToRefs}
                  >
                    <img
                      src={porscheTopUp}
                      alt="Porsche Top Up"
                      className="porsche_img"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

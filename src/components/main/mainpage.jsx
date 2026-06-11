import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import "../main/mainpage.scss";
import porschesubheader from "../main/img/porschesubheader.jpg";
import logo from "../header/img/porschelogo.png";
import porschesalon from "../main/img/mainpage_salon.jpg";
import { Link } from "react-router-dom";
import frontphotoins from "../main/img/insurance/main-ins.jpg";
import insimg1 from "../main/img/insurance/arsenal.png";
import insimg2 from "../main/img/insurance/arx.png";
import insimg3 from "../main/img/insurance/axa.png";
import insimg4 from "../main/img/insurance/logo_ingo.png";
import insimg5 from "../main/img/insurance/tas.png";
import insimg6 from "../main/img/insurance/uniqa.png";
import maincall from "../main/img/main-call.jpg";
import '../adaptation.scss';

const MainPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Email field cannot be empty!");
      return;
    }

    if (!trimmedEmail.endsWith("@gmail.com")) {
      setError("Please use a valid @gmail.com address!");
      return;
    }

    setLoading(true);

    const serviceID = "service_7bscywk";
    const templateID = "template_6306tro";
    const publicKey = "s5LE7iiFJysGL5XD2";

    const templateParams = {
      user_email: trimmedEmail,
      message: "Support request received! We will contact you shortly.",
    };

    emailjs
      .send(serviceID, templateID, templateParams, publicKey)
      .then(() => {
        setSuccess(true);
        setEmail("");
      })
      .catch((err) => {
        console.error("EmailJS Error:", err);
        setError("Something went wrong. Try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="main">
      {/* БЛОК 1 */}
      <div className="main_item main_item_1">
        <img
          className="porsche_sub_header_img"
          src={porschesubheader}
          alt="porsche"
        />
        <div className="main_wrapper main_comp_1">
          <div className="sub_header_text_container">
            <p className="p_main_porsche_1">
              CarDan AutoHub - Official Distributor
            </p>
            <p className="p_main_porsche_2">of PORSCHE</p>
          </div>
          <div className="porsche_right_under_container">
            <div className="porsche_right_under">
              <img className="porsche_logo" src={logo} alt="porsche" />
              <p className="porsche_font">Porsche</p>
            </div>
          </div>
        </div>
      </div>

      {/* БЛОК 2 */}
      <div className="main_item main_item_1 main_item_2">
        <img
          className="porsche_sub_header_img"
          src={porschesalon}
          alt="porsche"
        />
        <div className="__wrapper_main">
          <div className="container_deal">
            <div className="deal_item deal_item_1">
              <div className="container_main_left">
                <p className="text_container_main_left">
                  Buy PORSCHE with US - Have a special deal on insurance!{" "}
                </p>
              </div>
              <div className="container_main_right">
                <a
                  href="https://models.porsche.com/uk-UA/model-start"
                  target="_blank"
                  rel="noreferrer"
                  className="constructor_button constructor_button_mainpage_2"
                >
                  Configure now!
                </a>
              </div>
            </div>
            <div className="deal_item deal_item_2">
              <div className="porsche_right_under">
                <img className="porsche_logo" src={logo} alt="porsche" />
                <p className="porsche_font">Porsche</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* БЛОК 3 (СТРАХУВАННЯ) */}
      <div className="main_item main_item_1 main_item_3">
        <div className="div_white">
          <div className="__wrapper_main">
            <div className="main_cont_ins">
              <div className="up_cont_ins">
                <div className="sub_up_cont_1">
                  <img
                    className="main_ins_img"
                    src={frontphotoins}
                    alt="deal"
                  />
                </div>
                <div className="sub_up_cont_2">
                  <div className="sub_text">
                    <p className="p_text_ins">
                      CarDan AutoHub - makes insurance convenient, accessible
                      and profitable for every client
                    </p>
                  </div>

                  <div className="sub_insurance">
                    {/* 1. Arsenal */}
                    <div className="item_ins item_ins_1 location-listing">
                      <a
                        href="https://arsenal-ic.ua/"
                        target="_blank"
                        rel="noreferrer"
                        className="link_button"
                      >
                        <div className="location-image">
                          <img src={insimg1} alt="Arsenal" />
                        </div>
                        <div className="location-title">Arsenal</div>
                      </a>
                    </div>

                    {/* 2. ARX */}
                    <div className="item_ins item_ins_2 location-listing">
                      <a
                        href="https://arx.com.ua/"
                        target="_blank"
                        rel="noreferrer"
                        className="link_button"
                      >
                        <div className="location-image">
                          <img src={insimg2} alt="ARX" />
                        </div>
                        <div className="location-title">ARX</div>
                      </a>
                    </div>

                    {/* 3. AXA */}
                    <div className="item_ins item_ins_3 location-listing">
                      <a
                        href="https://www.axa.com/"
                        target="_blank"
                        rel="noreferrer"
                        className="link_button"
                      >
                        <div className="location-image">
                          <img src={insimg3} alt="AXA" />
                        </div>
                        <div className="location-title">AXA</div>
                      </a>
                    </div>

                    {/* 4. INGO */}
                    <div className="item_ins item_ins_4 location-listing">
                      <a
                        href="https://ingo.ua/"
                        target="_blank"
                        rel="noreferrer"
                        className="link_button"
                      >
                        <div className="location-image">
                          <img src={insimg4} alt="INGO" />
                        </div>
                        <div className="location-title">INGO</div>
                      </a>
                    </div>

                    {/* 5. TAS */}
                    <div className="item_ins item_ins_5 location-listing">
                      <a
                        href="https://sgtas.ua/"
                        target="_blank"
                        rel="noreferrer"
                        className="link_button"
                      >
                        <div className="location-image">
                          <img src={insimg5} alt="TAS" />
                        </div>
                        <div className="location-title">TAS</div>
                      </a>
                    </div>

                    {/* 6. UNIQA */}
                    <div className="item_ins item_ins_6 location-listing">
                      <a
                        href="https://uniqa.ua/"
                        target="_blank"
                        rel="noreferrer"
                        className="link_button"
                      >
                        <div className="location-image">
                          <img src={insimg6} alt="UNIQA" />
                        </div>
                        <div className="location-title">UNIQA</div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="down_cont_ins">
                <div className="paddin-left"></div>
                <div className="container_down_button">
                  <Link
                    to="/inshurance"
                    className="inshurance_button constructor_button"
                  >
                    Insure my car!
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* БЛОК 4 (ПІДТРИМКА ТА ФОРМА) */}
      <div className="main_item main_item_1 main_item_4">
        <img className="porsche_sub_header_img" src={maincall} alt="service" />
        <div className="__wrapper __wrapper_flex">
          <div className="sub_call_left"></div>
          <div className="container_call">
            <div className="padding_right_call"></div>
            <div className="padding_left_call">
              <div className="sub_call sub_call_1">
                <p className="p_sub_call">
                  Our support service is available 24/7 to ensure your safe use.
                  To receive support, enter your email below.
                </p>
              </div>

              <form
                onSubmit={handleSupportSubmit}
                className="sub_call sub_call_2"
              >
                <input
                  type="text"
                  className="input_callito"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="button_callito "
                >
                  {loading ? "Sending..." : "Submit"}
                </button>

                {error && <p className="error_callito">{error}</p>}
                {success && (
                  <p className="success_callito">Letter sent successfully!</p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;

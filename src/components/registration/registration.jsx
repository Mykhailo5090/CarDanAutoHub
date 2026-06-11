import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../registration/registration.scss";
import porschebckg from "../registration/img/porschebkg.jpg";
import logo from "../header/img/porschelogo.png";

const RegistrationPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!agree) {
      alert("You must agree to the terms!");
      return;
    }


    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("Кнопка натиснута!");

    const response = await fetch("http://localhost:5001/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Реєстрація успішна!");
      navigate("/login");
    } else {
      alert(data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="reg_container_1">
      <img className="porsche_bckg" src={porschebckg} alt="porsche" />

      <div className="right_logos">
        <div className="reg_por_logo">
          <img className="logo-img" src={logo} alt="logo" />
          <p className="reg_logo_por">PORSCHE</p>
        </div>

        <p className="p_reg_logo">CarDan AutoHub</p>
      </div>

      <div className="reg_container">
        <div className="div_reg_comp">
          <p className="p_reg_h1">Registration</p>

          <p className="p_input_reg">enter your email:</p>

          <input
            type="text"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input_reg"
          />

          <p className="p_input_reg">enter your password:</p>

          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input_reg"
          />

          <p className="p_input_reg">enter password again:</p>

          <input
            type="password"
            placeholder="confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="input_reg"
          />

          <div className="reg_have">
            <label className="lbl_chk">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="chk_reg"
              />
              I Agree
            </label>

            <Link to="/login">
              <p className="p_link_reg">Have an account?</p>
            </Link>
          </div>

          <button type="submit" className="reg_button">
            Submit
          </button>
        </div>
      </div>
    </form>
  );
};

export default RegistrationPage;

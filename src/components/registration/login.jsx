import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../registration/registration.scss';

import porschebckg from '../registration/img/porschebkg.jpg';
import logo from '../img/porschelogo.png';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agree) {
      alert("Будь ласка, підтвердіть згоду (I Agree)");
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Перевіряємо, де лежать дані користувача
        const userToSave = data.user || data;

        if (userToSave && (userToSave.id || userToSave.email)) {
          localStorage.setItem('user', JSON.stringify(userToSave));
          alert("Вхід успішний!");
          // Використовуємо window.location для повного оновлення стану авторизації
          window.location.href = '/profile';
        } else {
          alert("Помилка: Сервер повернув порожній об'єкт користувача");
        }
      } else {
        alert(data.error || "Неправильний логін або пароль");
      }
    } catch (error) {
      console.error("Помилка:", error);
      alert("Сервер не відповідає. Перевір консоль.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className='reg_container_1'>
      <img className="porsche_bckg" src={porschebckg} alt="porsche" />
      <div className='right_logos'>
        <div className='reg_por_logo'>
          <img className="logo-img" src={logo} alt="logo" />
          <p className='reg_logo_por'>PORSCHE</p>
        </div>
        <p className='p_reg_logo'>CarDan AutoHub</p>
      </div>

      <div className='reg_container'>
        <div className='div_reg_comp'>
          <p className='p_reg_h1'>Login</p>
          <p className='p_input_reg'>enter your email:</p>
          <input
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className='input_reg'
          />
          <p className='p_input_reg'>enter your password:</p>
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className='input_reg'
          />
          <div className='reg_have'>
            <label className='lbl_chk'>
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className='chk_reg'
              />
              I Agree
            </label>
            <Link to="/registration">
              <p className='p_link_reg'>Create account</p>
            </Link>
          </div>
          <button type="submit" className='reg_button'>Submit</button>
        </div>
      </div>
    </form>
  );
};

export default LoginPage;
import React, { useState } from 'react';
import '../registration/login.scss';

const LoginPage = () => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agree) {
      alert("Будь ласка, підтвердіть згоду (I Agree)");
      return;
    }

    try {
      // 2. Відправляємо запит на сервер (порт 5001)
      const response = await fetch('http://localhost:5001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Вхід успішний!");
        // 3. Зберігаємо дані користувача в браузері
        localStorage.setItem('user', JSON.stringify(data.user));
        // Перенаправляємо на сторінку профілю
        window.location.href = '/profile'; 
      } else {
        alert(data.error || "Помилка входу");
      }
    } catch (error) {
      console.error("Помилка:", error);
      alert("Сервер не відповідає. Перевір, чи запущено Node.js на порту 5001");
    }
  };

  return (
    <div style={{ padding: '100px', maxWidth: '300px' }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input 
          type="email" 
          placeholder="enter your email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input 
          type="password" 
          placeholder="enter your password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label>
          <input 
            type="checkbox" 
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          /> I Agree
        </label>
        <button type="submit" style={{ cursor: 'pointer' }}>Submit</button>
      </form>
    </div>
  );
};

export default LoginPage;
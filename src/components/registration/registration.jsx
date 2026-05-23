import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegistrationPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    console.log("Кнопка натиснута!");
    e.preventDefault();
    
    const response = await fetch('http://localhost:5001/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Реєстрація успішна!");
      navigate('/login'); // Після реєстрації ведемо на логін
    } else {
      alert(data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '100px', display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
      <h1>Registration</h1>
      <input 
        type="text" 
        placeholder="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        required 
      />
      <input 
        type="password" 
        placeholder="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        required 
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default RegistrationPage;
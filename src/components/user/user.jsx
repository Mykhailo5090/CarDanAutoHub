import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Беремо дані з localStorage
    const savedUser = localStorage.getItem('user');

    if (savedUser) {
      // 2. Якщо дані є, парсимо їх і зберігаємо в стейт
      setUser(JSON.parse(savedUser));
    } else {
      // 3. Якщо даних немає, тільки тоді відправляємо на логін
      navigate('/login');
    }
    setLoading(false);
  }, [navigate]);

  if (loading) return <div style={{ padding: '50px' }}>Завантаження...</div>;
  if (!user) return null;

  return (
    <div style={{ padding: '50px' }}>
      <h1>Мій профіль</h1>
      <div style={{ 
        border: '1px solid #ccc', 
        padding: '20px', 
        borderRadius: '12px',
        backgroundColor: '#f9f9f9',
        maxWidth: '400px'
      }}>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>User ID:</strong> {user.id}</p>
        {/* Тут будуть інші дані, які ти додаси в базу */}
      </div>

      <button 
        onClick={() => {
          localStorage.removeItem('user'); // Очищуємо пам'ять
          navigate('/login'); // Переходимо на логін
        }}
        style={{ 
          marginTop: '20px', 
          padding: '10px 20px', 
          backgroundColor: '#ff4d4d', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Вийти з аккаунту
      </button>
    </div>
  );
};

export default ProfilePage;
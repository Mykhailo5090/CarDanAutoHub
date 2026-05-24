import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [myCars, setMyCars] = useState([]); // Стан для списку машин
  const [showCars, setShowCars] = useState(false); // Чи показувати список
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      navigate('/login');
    }
    setLoading(false);
  }, [navigate]);

  // Функція завантаження оголошень
  const fetchMyCars = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/my-cars/${user.id}`);
      const data = await response.json();
      setMyCars(data);
      setShowCars(true);
    } catch (err) {
      console.error("Помилка завантаження:", err);
    }
  };

  // Функція видалення
  const handleDelete = async (carId) => {
    if (window.confirm("Ви впевнені, що хочете видалити це оголошення?")) {
      try {
        const response = await fetch(`http://localhost:5001/api/cars/${carId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          // Оновлюємо список локально після видалення
          setMyCars(myCars.filter(car => car.id !== carId));
        }
      } catch (err) {
        console.error("Помилка видалення:", err);
      }
    }
  };

  if (loading) return <div style={{ padding: '50px' }}>Завантаження...</div>;
  if (!user) return null;

  return (
    <div style={{ padding: '50px' }}>
      <h1>Мій профіль</h1>
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '12px', backgroundColor: '#f9f9f9', maxWidth: '400px' }}>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>User ID:</strong> {user.id}</p>
      </div>

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={fetchMyCars} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Показати мої діючі оголошення
        </button>

        <button onClick={() => { localStorage.removeItem('user'); navigate('/login'); }} style={{ padding: '10px 20px', backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Вийти
        </button>
      </div>

      {/* Список оголошень */}
      {showCars && (
        <div style={{ marginTop: '30px' }}>
          <h2>Ваші оголошення</h2>
          {myCars.length === 0 ? <p>У вас ще немає оголошень.</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {myCars.map(car => (
                <div key={car.id} style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
                  {/* Відображення першого фото */}
                  {car.images && (
                    <img 
                      src={`http://localhost:5001${JSON.parse(car.images)[0]}`} 
                      alt="car" 
                      style={{ width: '100px', height: '70px', objectFit: 'cover', borderRadius: '4px' }} 
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0' }}>{car.brand} {car.model}</h3>
                    <p style={{ margin: '5px 0' }}>Ціна: ${car.price}</p>
                  </div>
                  <button 
                    onClick={() => handleDelete(car.id)}
                    style={{ padding: '5px 10px', backgroundColor: 'transparent', color: '#ff4d4d', border: '1px solid #ff4d4d', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Видалити
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
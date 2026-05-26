import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [myCars, setMyCars] = useState([]);
  const [showCars, setShowCars] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const savedUser = localStorage.getItem('user');
        
        // Перевіряємо: чи є дані, і чи не є вони помилковим рядком "undefined"
        if (savedUser && savedUser !== "undefined") {
          const parsedUser = JSON.parse(savedUser);
          if (parsedUser && parsedUser.id) {
            setUser(parsedUser);
          } else {
            throw new Error("Invalid user data");
          }
        } else {
          navigate('/login');
        }
      } catch (err) {
        console.error("Auth error:", err);
        localStorage.removeItem('user'); // Чистимо биті дані
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const fetchMyCars = async () => {
    if (!user?.id) return;
    
    try {
      const response = await fetch(`http://localhost:5001/api/my-cars/${user.id}`);
      if (!response.ok) throw new Error("Server error");
      
      const data = await response.json();
      setMyCars(Array.isArray(data) ? data : []); // Гарантуємо, що це масив
      setShowCars(true);
    } catch (err) {
      console.error("Помилка завантаження машин:", err);
      alert("Не вдалося завантажити список оголошень");
    }
  };

  const handleDelete = async (carId) => {
    if (!window.confirm("Ви впевнені?")) return;
    
    try {
      const response = await fetch(`http://localhost:5001/api/cars/${carId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setMyCars(prev => prev.filter(car => car.id !== carId));
      }
    } catch (err) {
      console.error("Помилка видалення:", err);
    }
  };

  if (loading) return <div style={{ padding: '50px' }}>Завантаження профілю...</div>;
  if (!user) return null;

  return (
    <div style={{ padding: '50px' }}>
      <h1>Мій профіль</h1>
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '12px', backgroundColor: '#f9f9f9', maxWidth: '400px' }}>
        <p><strong>Email:</strong> {user?.email || 'Не вказано'}</p>
        <p><strong>User ID:</strong> {user?.id || 'ID відсутній'}</p>
      </div>

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={fetchMyCars} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Показати мої діючі оголошення
        </button>

        <button onClick={() => { localStorage.clear(); navigate('/login'); }} style={{ padding: '10px 20px', backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Вийти
        </button>
      </div>

      {showCars && (
        <div style={{ marginTop: '30px' }}>
          <h2>Ваші оголошення</h2>
          {myCars.length === 0 ? <p>У вас ще немає оголошень.</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {myCars.map(car => (
                <div key={car.id} style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
                  {/* Безпечне відображення фото */}
                  {car.images && car.images !== "null" && (
                    <img 
                      src={`http://localhost:5001${JSON.parse(car.images)[0]}`} 
                      alt="car" 
                      style={{ width: '100px', height: '70px', objectFit: 'cover', borderRadius: '4px' }} 
                      onError={(e) => e.target.style.display = 'none'} 
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0' }}>{car.brand} {car.model}</h3>
                    <p style={{ margin: '5px 0' }}>Ціна: ${car.price}</p>
                  </div>
                  <button onClick={() => handleDelete(car.id)} style={{ padding: '5px 10px', backgroundColor: 'transparent', color: '#ff4d4d', border: '1px solid #ff4d4d', borderRadius: '4px', cursor: 'pointer' }}>
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
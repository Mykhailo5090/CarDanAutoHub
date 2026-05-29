import React, { useEffect, useState } from 'react';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchFavorites = () => {
    if (!user) return;
    fetch(`http://localhost:5001/api/favorites/${user.id}`)
      .then(res => res.json())
      .then(data => setFavorites(data));
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const removeFromFavorite = async (carId) => {
    await fetch(`http://localhost:5001/api/favorites/${user.id}/${carId}`, { method: 'DELETE' });
    fetchFavorites(); 
  };

  if (!user) return <div style={{ padding: '20px' }}>Будь ласка, увійдіть в аккаунт.</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>Мої обрані оголошення ❤️</h2>
      {favorites.length === 0 ? <p>У вас поки немає обраних авто.</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {favorites.map(car => (
            <div key={car.id} style={{ border: '1px solid #ddd', borderRadius: '12px', overflow: 'hidden', background: '#fff' }}>
              <div style={{ position: 'relative' }}>
                <img 
                  src={`http://localhost:5001${JSON.parse(car.images)[0]}`} 
                  alt="car" 
                  style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                />
                <button 
                  onClick={() => removeFromFavorite(car.id)}
                  style={{ position: 'absolute', top: '10px', right: '10px', background: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer' }}
                >
                  ❌
                </button>
              </div>
              <div style={{ padding: '15px' }}>
                <h3>{car.brand} {car.model}</h3>
                <p style={{ color: '#d91d1d', fontWeight: 'bold', fontSize: '20px' }}>${car.price}</p>
                <p style={{ fontSize: '14px', color: '#666' }}>{car.region} • {car.year}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
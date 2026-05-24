import React, { useEffect, useState } from 'react';

const BuyPage = () => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5001/api/cars')
      .then(res => res.json())
      .then(data => setCars(data));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Всі оголошення</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {cars.map(car => (
          <div key={car.id} style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
            {/* Виводимо перше фото з масиву */}
            {car.images && (
  <img 
    src={(() => {
      try {
        const imagePath = car.images.startsWith('[') 
          ? JSON.parse(car.images)[0] 
          : car.images;
        const finalUrl = `http://localhost:5001${imagePath}`;
        // Цей лог покаже нам в консолі реальний шлях до фото
        console.log("Спроба завантажити фото:", finalUrl); 
        return finalUrl;
      } catch (e) {
        console.error("Помилка обробки car.images:", car.images);
        return "";
      }
    })()} 
    alt="car" 
    style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
    onError={(e) => {
      console.log("Остаточна помилка завантаження (src):", e.target.src);
    }}
  />
)}
            <div style={{ padding: '15px' }}>
              <h3>{car.brand} {car.model} ({car.year})</h3>
              <p style={{ color: '#d91d1d', fontWeight: 'bold', fontSize: '20px' }}>${car.price}</p>
              <p>{car.region} • {car.mileage} км • {car.transmission}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyPage;
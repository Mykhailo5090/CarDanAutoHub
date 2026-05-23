import React, { useState } from 'react';

const SellPage = () => {
  const [formData, setFormData] = useState({
    brand: '', model: '', year: '', price: '', mileage: '', 
    fuel_type: '', transmission: '', engine_volume: '', region: '', description: ''
  });
  const [images, setImages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    
    const data = new FormData();
    data.append('user_id', user.id);
    // Додаємо всі текстові поля
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    // Додаємо файли
    images.forEach(img => data.append('images', img));

    try {
      const response = await fetch('http://localhost:5001/api/cars', {
        method: 'POST',
        body: data, // Для FormData заголовок Content-Type ставити не треба!
      });
      if (response.ok) alert("Оголошення додано!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '50px' }}>
      <h1>Додати оголошення</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '500px' }}>
        <input placeholder="Марка (напр. Audi)" onChange={e => setFormData({...formData, brand: e.target.value})} required />
        <input placeholder="Модель" onChange={e => setFormData({...formData, model: e.target.value})} required />
        <input type="number" placeholder="Рік" onChange={e => setFormData({...formData, year: e.target.value})} required />
        <input type="number" placeholder="Ціна ($)" onChange={e => setFormData({...formData, price: e.target.value})} required />
        <input type="file" multiple onChange={e => setImages(Array.from(e.target.files))} />
        <button type="submit">Опублікувати</button>
      </form>
    </div>
  );
};
export default SellPage;
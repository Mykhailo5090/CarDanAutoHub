import React, { useState } from 'react';

const SellPage = () => {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    price: '',
    mileage: '0', // Додаємо значення за замовчуванням
    fuel_type: 'Бензин',
    transmission: 'Автомат',
    engine_volume: '',
    region: '',
    description: ''
  });
  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    
    const data = new FormData();
    data.append('user_id', user.id);
    // Додаємо всі текстові поля автоматично
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    // Додаємо файли
    images.forEach(img => data.append('images', img));

    try {
      const response = await fetch('http://localhost:5001/api/cars', {
        method: 'POST',
        body: data,
      });
      if (response.ok) {
        alert("Оголошення успішно додано!");
      } else {
        const errorData = await response.json();
        alert("Помилка: " + errorData.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '50px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Продати авто</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <input name="brand" placeholder="Марка (напр. Audi)" onChange={handleChange} required />
        <input name="model" placeholder="Модель" onChange={handleChange} required />
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <input name="year" type="number" placeholder="Рік" onChange={handleChange} required style={{ flex: 1 }} />
          <input name="price" type="number" placeholder="Ціна ($)" onChange={handleChange} required style={{ flex: 1 }} />
        </div>

        <input name="mileage" type="number" placeholder="Пробіг (км)" onChange={handleChange} required />
        <input name="engine_volume" placeholder="Об'єм двигуна (напр. 2.0)" onChange={handleChange} />
        <input name="region" placeholder="Місто/Регіон" onChange={handleChange} />

        {/* Вибір типу палива */}
        <label>Тип палива:
          <select name="fuel_type" onChange={handleChange} style={{ width: '100%', padding: '8px' }}>
            <option value="Бензин">Бензин</option>
            <option value="Дизель">Дизель</option>
            <option value="Електро">Електро</option>
            <option value="Гібрид">Гібрид</option>
            <option value="Газ/Бензин">Газ/Бензин</option>
          </select>
        </label>

        {/* Вибір коробки передач */}
        <label>Коробка передач:
          <select name="transmission" onChange={handleChange} style={{ width: '100%', padding: '8px' }}>
            <option value="Автомат">Автомат</option>
            <option value="Механіка">Механіка</option>
            <option value="Варіатор">Варіатор</option>
            <option value="Робот">Робот</option>
          </select>
        </label>

        <textarea name="description" placeholder="Опис авто" onChange={handleChange} rows="4" />

        <input type="file" multiple onChange={e => setImages(Array.from(e.target.files))} accept="image/*" />

        <button type="submit" style={{ padding: '12px', backgroundColor: '#d91d1d', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Опублікувати оголошення
        </button>
      </form>
    </div>
  );
};

export default SellPage;
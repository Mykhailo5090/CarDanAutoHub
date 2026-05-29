import React, { useState } from 'react';

const SellPage = () => {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    price: '',
    mileage: '0',
    fuel_type: 'Бензин',
    transmission: 'Автомат',
    engine_volume: '',
    region: '',
    description: '',
    license_plate: '' 
  });
  const [images, setImages] = useState([]);

  const handleChange = (e) => {
  
    const value = e.target.name === 'license_plate' ? e.target.value.toUpperCase() : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!formData.license_plate) return alert("Введіть державний номер авто!");

    const data = new FormData();
    data.append('user_id', user.id);
    

    Object.keys(formData).forEach(key => data.append(key, formData[key]));
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
    <div style={{ padding: '50px', maxWidth: '600px', margin: '0 auto', color: '#fff' }}>
      <h1 style={{ color: '#fff' }}>Продати авто</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        

        <div style={{ backgroundColor: '#2c2c2c', padding: '15px', borderRadius: '10px' }}>
            <label style={{ fontSize: '12px', color: '#aaa', display: 'block', marginBottom: '5px' }}>Державний номер (для страхування та перевірок)</label>
            <input 
                name="license_plate" 
                placeholder="Напр: AA1234BB" 
                value={formData.license_plate}
                onChange={handleChange} 
                required 
                style={{ 
                    width: '100%', 
                    padding: '12px', 
                    fontSize: '18px', 
                    textAlign: 'center', 
                    fontWeight: 'bold', 
                    borderRadius: '5px',
                    border: '2px solid #d91d1d'
                }} 
            />
        </div>

        <input name="brand" placeholder="Марка (напр. Audi)" onChange={handleChange} required style={inputStyle} />
        <input name="model" placeholder="Модель" onChange={handleChange} required style={inputStyle} />
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <input name="year" type="number" placeholder="Рік" onChange={handleChange} required style={{ ...inputStyle, flex: 1 }} />
          <input name="price" type="number" placeholder="Ціна ($)" onChange={handleChange} required style={{ ...inputStyle, flex: 1 }} />
        </div>

        <input name="mileage" type="number" placeholder="Пробіг (км)" onChange={handleChange} required style={inputStyle} />
        <input name="engine_volume" placeholder="Об'єм двигуна (напр. 2.0)" onChange={handleChange} style={inputStyle} />
        <input name="region" placeholder="Місто/Регіон" onChange={handleChange} style={inputStyle} />

        <label>Тип палива:
          <select name="fuel_type" onChange={handleChange} style={selectStyle}>
            <option value="Бензин">Бензин</option>
            <option value="Дизель">Дизель</option>
            <option value="Електро">Електро</option>
            <option value="Гібрид">Гібрид</option>
            <option value="Газ/Бензин">Газ/Бензин</option>
          </select>
        </label>

        <label>Коробка передач:
          <select name="transmission" onChange={handleChange} style={selectStyle}>
            <option value="Автомат">Автомат</option>
            <option value="Механіка">Механіка</option>
            <option value="Варіатор">Варіатор</option>
            <option value="Робот">Робот</option>
          </select>
        </label>

        <textarea name="description" placeholder="Опис авто" onChange={handleChange} rows="4" style={inputStyle} />

        <input type="file" multiple onChange={e => setImages(Array.from(e.target.files))} accept="image/*" />

        <button type="submit" style={{ padding: '15px', backgroundColor: '#d91d1d', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
          Опублікувати оголошення
        </button>
      </form>
    </div>
  );
};


const inputStyle = { padding: '12px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#222', color: '#fff' };
const selectStyle = { width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#222', color: '#fff', marginTop: '5px' };

export default SellPage;
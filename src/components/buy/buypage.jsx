import React, { useEffect, useState } from 'react';

const BuyPage = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [photoIndices, setPhotoIndices] = useState({}); 

  const user = JSON.parse(localStorage.getItem('user'));


  const [filters, setFilters] = useState({
    region: '', transmission: '', fuel_type: '',
    minYear: '', maxYear: '', 
    minPrice: '', maxPrice: '',
    maxMileage: '', 
    minEngine: '', maxEngine: '',
    search: '' 
  });

  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetch('http://localhost:5001/api/cars')
      .then(res => res.json())
      .then(data => {
        setCars(data);
        setFilteredCars(data);
        const indices = {};
        data.forEach(car => indices[car.id] = 0);
        setPhotoIndices(indices);
      });

    if (user) {
      fetch(`http://localhost:5001/api/favorites/${user.id}`)
        .then(res => res.json())
        .then(data => setFavorites(data.map(f => f.id)));
    }
  }, []);

  // ФУНКЦІЯ ДЛЯ ДИНАМІЧНИХ СПИСКІВ
  const getUniqueValues = (key) => {
    return [...new Set(cars.map(car => car[key]).filter(v => v !== null && v !== ''))];
  };

  useEffect(() => {
    let result = [...cars];


    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(c => 
        c.brand.toLowerCase().includes(s) || 
        c.model.toLowerCase().includes(s) || 
        (c.description && c.description.toLowerCase().includes(s))
      );
    }


    if (filters.region) result = result.filter(c => c.region === filters.region);
    if (filters.transmission) result = result.filter(c => c.transmission === filters.transmission);
    if (filters.fuel_type) result = result.filter(c => c.fuel_type === filters.fuel_type);
    if (filters.minYear) result = result.filter(c => c.year >= Number(filters.minYear));
    if (filters.maxYear) result = result.filter(c => c.year <= Number(filters.maxYear));
    if (filters.minPrice) result = result.filter(c => Number(c.price) >= Number(filters.minPrice));
    if (filters.maxPrice) result = result.filter(c => Number(c.price) <= Number(filters.maxPrice));
    if (filters.maxMileage) result = result.filter(c => Number(c.mileage) <= Number(filters.maxMileage));
    if (filters.minEngine) result = result.filter(c => Number(c.engine_volume) >= Number(filters.minEngine));
    if (filters.maxEngine) result = result.filter(c => Number(c.engine_volume) <= Number(filters.maxEngine));
    if (sortBy === 'cheap') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'expensive') result.sort((a, b) => b.price - a.price);
    if (sortBy === 'newest') result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    setFilteredCars(result);
  }, [filters, sortBy, cars]);

  // ГОРТАННЯ ФОТО
  const changePhoto = (carId, direction, max) => {
    setPhotoIndices(prev => {
      let newIdx = (prev[carId] || 0) + direction;
      if (newIdx < 0) newIdx = max - 1;
      if (newIdx >= max) newIdx = 0;
      return { ...prev, [carId]: newIdx };
    });
  };

  const handleFavorite = async (carId) => {
    if (!user) return alert("Login first!");
    const isFav = favorites.includes(carId);
    if (isFav) {
      await fetch(`http://localhost:5001/api/favorites/${user.id}/${carId}`, { method: 'DELETE' });
      setFavorites(favorites.filter(id => id !== carId));
    } else {
      await fetch('http://localhost:5001/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, car_id: carId })
      });
      setFavorites([...favorites, carId]);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      

      <div style={filterBoxStyle}>
        <input placeholder="Search (brand, model...)" style={inputStyle} onChange={e => setFilters({...filters, search: e.target.value})} />
        
        <select style={inputStyle} onChange={e => setFilters({...filters, region: e.target.value})}>
          <option value="">Region: All</option>
          {getUniqueValues('region').map(v => <option key={v} value={v}>{v}</option>)}
        </select>

        <select style={inputStyle} onChange={e => setFilters({...filters, transmission: e.target.value})}>
          <option value="">Gear-box: All</option>
          {getUniqueValues('transmission').map(v => <option key={v} value={v}>{v}</option>)}
        </select>

        <select style={inputStyle} onChange={e => setFilters({...filters, fuel_type: e.target.value})}>
          <option value="">Petrol type: All</option>
          {getUniqueValues('fuel_type').map(v => <option key={v} value={v}>{v}</option>)}
        </select>

        <div style={rangeStyle}>
          <input type="number" placeholder="Year Min" style={smallInput} onChange={e => setFilters({...filters, minYear: e.target.value})} />
          <input type="number" placeholder="Max" style={smallInput} onChange={e => setFilters({...filters, maxYear: e.target.value})} />
        </div>

        <div style={rangeStyle}>
          <input type="number" placeholder="Price Min" style={smallInput} onChange={e => setFilters({...filters, minPrice: e.target.value})} />
          <input type="number" placeholder="Max" style={smallInput} onChange={e => setFilters({...filters, maxPrice: e.target.value})} />
        </div>

        <input type="number" placeholder="Mileage max" style={inputStyle} onChange={e => setFilters({...filters, maxMileage: e.target.value})} />
        
        <select style={inputStyle} onChange={e => setSortBy(e.target.value)}>
          <option value="newest">Sort: Newest</option>
          <option value="cheap">Sort: Cheap</option>
          <option value="expensive">Sort: Expensive</option>
        </select>
      </div>


      <div style={gridStyle}>
        {filteredCars.map(car => {
          const images = JSON.parse(car.images);
          const currentIdx = photoIndices[car.id] || 0;

          return (
            <div key={car.id} style={cardStyle}>

              <div style={{ position: 'relative', height: '220px', background: '#000' }}>
                <img src={`http://localhost:5001${images[currentIdx]}`} alt="car" style={imgStyle} />
                {images.length > 1 && (
                  <>
                    <button onClick={() => changePhoto(car.id, -1, images.length)} style={{...navBtn, left: '5px'}}>←</button>
                    <button onClick={() => changePhoto(car.id, 1, images.length)} style={{...navBtn, right: '5px'}}>→</button>
                    <div style={counterStyle}>{currentIdx + 1} / {images.length}</div>
                  </>
                )}
                <button onClick={() => handleFavorite(car.id)} style={{...favStyle, color: favorites.includes(car.id) ? 'red' : '#ccc'}}>❤</button>
              </div>

              <div style={{ padding: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h3 style={{ margin: 0 }}>{car.brand} {car.model}</h3>
                  <span style={{ color: '#d32f2f', fontWeight: 'bold' }}>${car.price}</span>
                </div>
                <p style={subTextStyle}>{car.year} • {car.fuel_type} • {car.transmission} • {car.engine_volume}L</p>
                <p style={subTextStyle}>📍 {car.region} • 🛣️ {car.mileage} km</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


const filterBoxStyle = { display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '15px', background: '#f8f9fa', borderRadius: '8px', marginBottom: '20px' };
const inputStyle = { padding: '8px', borderRadius: '5px', border: '1px solid #ddd', minWidth: '150px' };
const smallInput = { padding: '8px', borderRadius: '5px', border: '1px solid #ddd', width: '85px' };
const rangeStyle = { display: 'flex', gap: '4px', alignItems: 'center' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '20px' };
const cardStyle = { borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', background: '#fff' };
const imgStyle = { width: '100%', height: '100%', objectFit: 'cover' };
const navBtn = { position: 'absolute', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.7)', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', fontWeight: 'bold' };
const counterStyle = { position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.5)', color: '#fff', padding: '2px 8px', borderRadius: '10px', fontSize: '12px' };
const favStyle = { position: 'absolute', top: '10px', right: '10px', background: '#fff', border: 'none', borderRadius: '50%', width: '35px', height: '35px', cursor: 'pointer', fontSize: '18px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' };
const subTextStyle = { fontSize: '13px', color: '#666', margin: '5px 0' };

export default BuyPage;
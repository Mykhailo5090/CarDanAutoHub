import React, { useState, useEffect } from 'react';

const InsurancePage = () => {
  // Безпечне отримання юзера
  const savedUser = localStorage.getItem('user');
  const user = savedUser && savedUser !== "undefined" ? JSON.parse(savedUser) : null;

  const [step, setStep] = useState(1);
  const [plate, setPlate] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [myCars, setMyCars] = useState([]);

  const [formData, setFormData] = useState({
    surname: '', name: '', inn: '', email: '', phone: '380', vin: '', 
    docSeries: '', docNumber: ''
  });

  useEffect(() => {
    if (user?.id) {
      fetch(`http://localhost:5001/api/my-cars/${user.id}`)
        .then(r => r.json())
        .then(data => setMyCars(Array.isArray(data) ? data : []))
        .catch(e => console.log("Помилка завантаження авто:", e));
    }
  }, []);

  const handleSearch = async (p = plate) => {
    if (!p) return alert("Введіть номер");
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5001/api/insurance/get-price', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plate: p })
      });
      const data = await res.json();
      
      if (data.success) {
        setResult(data);
        setFormData(prev => ({ ...prev, vin: data?.car?.vin || '' }));
        setStep(2);
      } else {
        alert("Бот не знайшов дані для цього номера");
      }
    } catch (e) { 
      alert("Помилка зв'язку з сервером"); 
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.vin || formData.vin.length < 5) return alert("Перевірте VIN-код");
    setLoading(true);
    
    // Тут твій об'єкт payload...
    try {
      const res = await fetch('http://localhost:5001/api/insurance/create-contract', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, pkgId: selectedPkg?.id })
      });
      const data = await res.json();
      if (data.result === "success") alert(`Договір створено! Код: ${data.mainCode}`);
      else alert(data.errorMessage || "Помилка оформлення");
    } catch (e) { alert("Помилка мережі"); }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={{textAlign: 'center', color: '#fff'}}>CarDan Страхування</h1>

        {step === 1 && (
          <div style={styles.card}>
            <div style={styles.row}>
              <input 
                style={styles.inputPlate} 
                placeholder="AO5090HM" 
                value={plate} 
                onChange={e => setPlate(e.target.value.toUpperCase())} 
              />
              <button style={styles.btnMain} onClick={() => handleSearch()} disabled={loading}>
                {loading ? 'Шукаємо...' : 'Знайти'}
              </button>
            </div>
            {myCars.length > 0 && (
              <div style={{marginTop: '20px'}}>
                <p style={{color: '#666', fontSize: '12px'}}>Швидкий вибір:</p>
                {myCars.map(c => (
                  <button key={c.id} style={styles.carTag} onClick={() => handleSearch(c.license_plate)}>
                    {c.license_plate}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 2 && result && (
          <div>
            <div style={styles.carHeader}>
              <button onClick={() => setStep(1)} style={styles.closeBtn}>✕</button>
              <h3 style={{margin:0}}>{result.car?.brand} {result.car?.model}</h3>
              <p style={{margin:0, opacity:0.8}}>{result.car?.year} р. | {plate}</p>
            </div>
            <div style={styles.grid}>
              {/* БЕЗПЕЧНИЙ MAP: використовуємо ?. для перевірки */}
              {result.packages?.map(pkg => (
                <div key={pkg.id} style={styles.pkgCard}>
                {pkg.logo && <img src={pkg.logo} alt={pkg.name} style={{height: '30px', marginBottom: '10px'}} />}
                <h4>{pkg.name}</h4>
                <div style={styles.price}>{pkg.price} грн</div>
                <p style={{fontSize: '12px', color: '#666'}}>Франшиза: {pkg.franchise} грн</p>
                <button style={styles.btnSelect} onClick={() => { setSelectedPkg(pkg); setStep(3); }}>Обрати</button>
              </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={styles.card}>
            <h3>Анкета страхувальника</h3>
            <div style={styles.formGrid}>
              <input placeholder="Прізвище" style={styles.input} onChange={e => setFormData({...formData, surname: e.target.value})}/>
              <input placeholder="Ім'я" style={styles.input} onChange={e => setFormData({...formData, name: e.target.value})}/>
              <input placeholder="ІПН" style={styles.input} onChange={e => setFormData({...formData, inn: e.target.value})}/>
              <input placeholder="VIN" style={styles.input} value={formData.vin} onChange={e => setFormData({...formData, vin: e.target.value.toUpperCase()})}/>
            </div>
            <button style={styles.btnConfirm} onClick={handleCreate} disabled={loading}>
              {loading ? "Зачекайте..." : `Оформити за ${selectedPkg?.price} грн`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ... твої стилі без змін ...
const styles = {
  page: { minHeight: '100vh', background: '#0f172a', padding: '50px 20px', fontFamily: 'sans-serif' },
  container: { maxWidth: '800px', margin: '0 auto' },
  card: { background: '#fff', padding: '25px', borderRadius: '16px' },
  row: { display: 'flex', gap: '10px' },
  inputPlate: { flex: 1, padding: '15px', fontSize: '20px', border: '2px solid #ddd', borderRadius: '10px', textAlign: 'center' },
  btnMain: { background: '#3b82f6', color: '#fff', border: 'none', padding: '0 30px', borderRadius: '10px', cursor: 'pointer' },
  carTag: { background: '#f1f5f9', border: 'none', padding: '5px 10px', borderRadius: '5px', marginRight: '5px', cursor: 'pointer' },
  carHeader: { background: '#1e293b', color: '#fff', padding: '15px', borderRadius: '12px', marginBottom: '15px', position: 'relative' },
  closeBtn: { position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
  pkgCard: { background: '#fff', padding: '20px', borderRadius: '12px', textAlign: 'center', border: '1px solid #eee' },
  price: { fontSize: '24px', fontWeight: 'bold', color: '#10b981', margin: '10px 0' },
  btnSelect: { width: '100%', background: '#f59e0b', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', margin: '15px 0' },
  input: { padding: '12px', border: '1px solid #ddd', borderRadius: '8px' },
  btnConfirm: { width: '100%', background: '#10b981', color: '#fff', border: 'none', padding: '15px', borderRadius: '10px', fontSize: '18px', cursor: 'pointer' }
};
export default InsurancePage;
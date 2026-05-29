import React, { useState, useEffect } from 'react';

const InsurancePage = () => {
  const savedUser = localStorage.getItem('user');
  const user = savedUser && savedUser !== "undefined" ? JSON.parse(savedUser) : null;

  const [step, setStep] = useState(1);
  const [plate, setPlate] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [myCars, setMyCars] = useState([]);

  const [formData, setFormData] = useState({
    surname: '', name: '', middleName: '', inn: '', birthday: '', 
    phone: '380', email: '', docType: 'PASSPORT', docSeries: '', 
    docNumber: '', docIssuedBy: '', docDate: '', city: '', 
    street: '', house: '', flat: '', vin: ''
  });

  useEffect(() => {
    if (user?.id) {
      fetch(`http://localhost:5001/api/my-cars/${user.id}`)
        .then(r => r.json())
        .then(data => setMyCars(Array.isArray(data) ? data : []))
        .catch(e => console.log("Помилка завантаження авто:", e));
    }
  }, [user?.id]);

  const handleSearch = async (p = plate) => {
    const targetPlate = p.toUpperCase().replace(/\s/g, '');
    if (!targetPlate) return alert("Введіть номер");
    
    setPlate(targetPlate);
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5001/api/insurance/get-price', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plate: targetPlate })
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

  const handleOrder = async () => {
    if (!formData.surname || !formData.inn || !formData.phone) {
        return alert("Заповніть основні поля (Прізвище, ІПН, Телефон)");
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5001/api/insurance/create-contract', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            ...formData, 
            plateNumber: plate,
            offerIndex: result.packages.indexOf(selectedPkg)
        })
      });
      const data = await res.json();
      if (data.success) alert("Дані успішно передані боту!");
      else alert("Помилка: " + data.error);
    } catch (e) { alert("Помилка мережі"); }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={{textAlign: 'center', color: '#fff', marginBottom: '30px'}}>CarDan Insurance</h1>


        {step === 1 && (
          <div>
            <div style={styles.card}>
              <h3 style={{marginTop: 0, color: '#333'}}>Перевірка за номером</h3>
              <div style={styles.row}>
                <input 
                  style={styles.inputPlate} 
                  placeholder="AA1234AA" 
                  value={plate} 
                  onChange={e => setPlate(e.target.value.toUpperCase())} 
                />
                <button style={styles.btnMain} onClick={() => handleSearch()} disabled={loading}>
                  {loading ? 'Шукаємо...' : 'Знайти ціни'}
                </button>
              </div>
            </div>

            {myCars.length > 0 && (
              <div style={{marginTop: '30px'}}>
                <h3 style={{color: '#fff', marginBottom: '15px'}}>Ваші оголошення</h3>
                <div style={styles.myCarsGrid}>
                  {myCars.map(car => (
                    <div 
                      key={car.id} 
                      style={styles.myCarCard} 
                      onClick={() => handleSearch(car.license_plate)}
                    >
                      <div style={styles.carInfo}>
                        <div style={styles.carPlateTag}>{car.license_plate}</div>
                        <strong style={{fontSize: '16px'}}>{car.brand} {car.model}</strong>
                        <span style={{fontSize: '13px', color: '#666'}}>{car.year} рік</span>
                      </div>
                      <div style={styles.selectText}>Обрати →</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}


        {step === 2 && result && (
          <div>
            <div style={styles.carHeader}>
              <button onClick={() => setStep(1)} style={styles.backBtn}>← Назад</button>
              <h3 style={{margin:0}}>{result.car?.brand} {result.car?.model}</h3>
              <p style={{margin:0, opacity:0.8}}>{result.car?.year} р. | {plate}</p>
            </div>
            <div style={styles.grid}>
              {result.packages?.map(pkg => (
                <div key={pkg.id} style={styles.pkgCard}>
                  <div style={styles.logoRow}>
                    {pkg.logo && <img src={pkg.logo} alt={pkg.name} style={styles.logoImg} />}
                    <span style={styles.companyName}>{pkg.name}</span>
                  </div>
                  <div style={styles.price}>{pkg.price} <small>грн</small></div>
                  <p style={styles.franchise}>Франшиза: {pkg.franchise}</p>
                  <button style={styles.btnSelect} onClick={() => { setSelectedPkg(pkg); setStep(3); }}>Обрати</button>
                </div>
              ))}
            </div>
          </div>
        )}


        {step === 3 && (
          <div style={styles.card}>
            <button onClick={() => setStep(2)} style={styles.backBtn}>← До списку цін</button>
            <h3 style={{marginTop: '15px'}}>Анкета для {selectedPkg?.name}</h3>

            <div style={styles.formSection}>
              <div style={styles.formGrid}>
                <input placeholder="Прізвище" style={styles.input} onChange={e => setFormData({...formData, surname: e.target.value})}/>
                <input placeholder="Ім'я" style={styles.input} onChange={e => setFormData({...formData, name: e.target.value})}/>
                <input placeholder="ІПН" style={styles.input} onChange={e => setFormData({...formData, inn: e.target.value})}/>
                <input placeholder="Телефон" style={styles.input} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}/>
              </div>
            </div>
            <button style={styles.btnConfirm} onClick={handleOrder} disabled={loading}>
              {loading ? "Зачекайте..." : `Оформити за ${selectedPkg?.price} грн`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#1a1a1a', padding: '40px 20px' },
  container: { maxWidth: '900px', margin: '0 auto' },
  card: { backgroundColor: '#fff', padding: '25px', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)' },
  row: { display: 'flex', gap: '10px' },
  inputPlate: { flex: 1, padding: '15px', fontSize: '20px', borderRadius: '10px', border: '2px solid #ddd', textAlign: 'center', fontWeight: 'bold' },
  btnMain: { padding: '0 30px', backgroundColor: '#2196F3', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
  

  myCarsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' },
  myCarCard: { 
    backgroundColor: '#fff', 
    padding: '15px', 
    borderRadius: '12px', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    border: '1px solid #333'
  },
  carInfo: { display: 'flex', flexDirection: 'column', gap: '4px' },
  carPlateTag: { 
    backgroundColor: '#f0f0f0', 
    padding: '2px 8px', 
    borderRadius: '4px', 
    fontSize: '12px', 
    fontWeight: 'bold', 
    width: 'fit-content',
    border: '1px solid #ccc'
  },
  selectText: { color: '#2196F3', fontWeight: 'bold', fontSize: '14px' },


  carHeader: { backgroundColor: '#2c2c2c', color: '#fff', padding: '20px', borderRadius: '12px', marginBottom: '20px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' },
  pkgCard: { backgroundColor: '#fff', padding: '20px', borderRadius: '12px', textAlign: 'center' },
  logoRow: { height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px', gap: '10px' },
  logoImg: { maxHeight: '30px' },
  price: { fontSize: '24px', fontWeight: 'bold', color: '#2ecc71', margin: '10px 0' },
  btnSelect: { width: '100%', padding: '10px', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #ccc', width: '100%' },
  btnConfirm: { width: '100%', padding: '18px', backgroundColor: '#2ecc71', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' },
  backBtn: { background: 'none', border: 'none', color: '#2196F3', cursor: 'pointer', marginBottom: '10px' },
};

export default InsurancePage;
import React from 'react';

const OffersGrid = ({ result, plate, setStep, setSelectedPkg, styles }) => {
  // Безпечно дістаємо пакети (перевіряємо і packages, і offers про всяк випадок)
  const packages = result?.packages || result?.offers || [];

  return (
    <div>
      {/* Шапка з даними про авто */}
      <div style={styles.carHeader}>
        <button onClick={() => setStep(1)} style={styles.backBtn}>← Назад</button>
        <h3 style={{ margin: '5px 0 0 0', color: '#fff' }}>
          {result?.car?.brand || 'Авто'} {result?.car?.model || ''}
        </h3>
        <p style={{ margin: '5px 0 0 0', opacity: 0.8, color: '#fff' }}>
          {result?.car?.year ? `${result.car.year} р.` : ''} | {plate}
        </p>
      </div>
      
      {/* Якщо масив порожній, показуємо повідомлення та сирі дані для розробника */}
      {packages.length === 0 ? (
        <div style={{ 
          backgroundColor: '#fff', 
          padding: '30px', 
          borderRadius: '15px', 
          color: '#333', 
          textAlign: 'center',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
        }}>
          <h3 style={{color: '#e74c3c', marginTop: 0}}>⚠️ Пропозиції не знайдено</h3>
          <p>Бот відпрацював, але масив страхових пакетів порожній або прийшов у невідомому форматі.</p>
          
          <div style={{
            textAlign: 'left', 
            background: '#f5f5f5', 
            padding: '15px', 
            borderRadius: '8px', 
            marginTop: '15px',
            overflowX: 'auto'
          }}>
            <strong style={{fontSize: '13px'}}>Відповідь від сервера (Діагностика):</strong>
            <pre style={{fontSize: '12px', margin: '5px 0 0 0'}}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      ) : (
        /* Якщо дані є — малюємо картки */
        <div style={styles.grid}>
          {packages.map((pkg, index) => (
            <div key={pkg.id || index} style={styles.pkgCard}>
              <div style={styles.logoRow}>
                {pkg.logo && <img src={pkg.logo} alt={pkg.name} style={styles.logoImg} />}
                <span style={{fontWeight: 'bold', color: '#333'}}>{pkg.name || pkg.company}</span>
              </div>
              <div style={styles.price}>{pkg.price} <small>грн</small></div>
              <p style={{color: '#666', fontSize: '14px', margin: '5px 0 15px 0'}}>
                Франшиза: {pkg.franchise}
              </p>
              <button 
                style={styles.btnSelect} 
                onClick={() => { setSelectedPkg(pkg); setStep(3); }}
              >
                Обрати
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OffersGrid;
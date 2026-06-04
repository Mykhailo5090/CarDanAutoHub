import React from 'react';

const InsuranceForm = ({ selectedPkg, formData, setFormData, handleOrder, loading, setStep, styles }) => {
  return (
    <div style={styles.card}>
      <button onClick={() => setStep(2)} style={styles.backBtn}>← До списку цін</button>
      <h3 style={{ marginTop: '15px' }}>Анкета для {selectedPkg?.name}</h3>

      <div style={styles.formSection}>
        <div style={styles.formGrid}>
          <input 
            placeholder="Прізвище" 
            style={styles.input} 
            value={formData.surname}
            onChange={e => setFormData({ ...formData, surname: e.target.value })}
          />
          <input 
            placeholder="Ім'я" 
            style={styles.input} 
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
          <input 
            placeholder="ІПН" 
            style={styles.input} 
            value={formData.inn}
            onChange={e => setFormData({ ...formData, inn: e.target.value })}
          />
          <input 
            placeholder="Телефон" 
            style={styles.input} 
            value={formData.phone} 
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
      </div>
      
      <button style={styles.btnConfirm} onClick={handleOrder} disabled={loading}>
        {loading ? "Зачекайте..." : `Оформити за ${selectedPkg?.price} грн`}
      </button>
    </div>
  );
};

export default InsuranceForm;
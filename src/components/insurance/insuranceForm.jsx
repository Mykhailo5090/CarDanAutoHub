import React from "react";

const InsuranceForm = ({
  selectedPkg,
  formData,
  setFormData,
  handleOrder,
  loading,
  setStep,
}) => {
  return (
    <div className="insurance-card form-card">
      <button onClick={() => setStep(2)} className="back-btn">
        ← До списку цін
      </button>
      <h3 className="form-title">Анкета для {selectedPkg?.name}</h3>

      <div className="form-section">
        <div className="form-grid">
          <input
            placeholder="Прізвище"
            className="form-input"
            value={formData.surname}
            onChange={(e) =>
              setFormData({ ...formData, surname: e.target.value })
            }
          />
          <input
            placeholder="Ім'я"
            className="form-input"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            placeholder="ІПН"
            className="form-input"
            value={formData.inn}
            onChange={(e) => setFormData({ ...formData, inn: e.target.value })}
          />
          <input
            placeholder="Телефон"
            className="form-input"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
        </div>
      </div>

      <button className="btn-confirm" onClick={handleOrder} disabled={loading}>
        {loading ? "Зачекайте..." : `Оформити за ${selectedPkg?.price} грн`}
      </button>
    </div>
  );
};

export default InsuranceForm;

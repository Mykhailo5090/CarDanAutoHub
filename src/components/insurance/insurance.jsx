import React, { useState, useEffect } from "react";
import OffersGrid from "./offersGrid";
import InsuranceForm from "./insuranceForm";
import "../insurance/insurance.scss";
import "../buy/buypage.scss";
import '../user/user.scss';

const InsurancePage = () => {
  const savedUser = localStorage.getItem("user");
  const user =
    savedUser && savedUser !== "undefined" ? JSON.parse(savedUser) : null;

  const [step, setStep] = useState(1);
  const [plate, setPlate] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [myCars, setMyCars] = useState([]);

  const [formData, setFormData] = useState({
    surname: "",
    name: "",
    middleName: "",
    inn: "",
    birthday: "",
    phone: "380",
    email: "",
    docType: "PASSPORT",
    docSeries: "",
    docNumber: "",
    docIssuedBy: "",
    docDate: "",
    city: "",
    street: "",
    house: "",
    flat: "",
    vin: "",
  });

  useEffect(() => {
    if (user?.id) {
      fetch(`http://localhost:5001/api/my-cars/${user.id}`)
        .then((r) => r.json())
        .then((data) => setMyCars(Array.isArray(data) ? data : []))
        .catch((e) => console.log("Помилка завантаження авто:", e));
    }
  }, [user?.id]);

  const handleSearch = async (p = plate) => {
    const targetPlate = p.toUpperCase().replace(/\s/g, "");
    if (!targetPlate) return alert("Введіть номер");

    setPlate(targetPlate);
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/insurance/get-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plate: targetPlate }),
      });
      const data = await res.json();

      if (data.success) {
        setResult(data);
        setFormData((prev) => ({ ...prev, vin: data?.car?.vin || "" }));
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
      const res = await fetch(
        "http://localhost:5001/api/insurance/create-contract",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            plateNumber: plate,
            offerIndex: result.packages.indexOf(selectedPkg),
          }),
        },
      );
      const data = await res.json();
      if (data.success) alert("Дані успішно передані боту!");
      else alert("Помилка: " + data.error);
    } catch (e) {
      alert("Помилка мережі");
    }
    setLoading(false);
  };

  return (
    <div className="insurance-page">
      <div className="sub-body">
        <div className="sub-body__2">
          <div className="container_flex_insurance_page">
            <div className="item_flex_insurance item_flex_insurance_1"></div>
            <div className="insurance-container __shadows_mini">
              <div className="container_buypage_filtration container_buypage_filtration_1 __shadows __borders">
                <p className="p_buypage_filtration p_ins_page ">
                  CarDan Insurance
                </p>
                <hr className="hr_select_filtration" />
              </div>

              {/* КРОК 1: Пошук авто та вибір зі збережених */}
              {step === 1 && (
                <div className="__shadows __borders ">
                  <div className="insurance-card __shadows">
                    <div className="insurance-row">
                      <input
                        className="input-plate __shadows_mini"
                        placeholder="AA1234AA"
                        value={plate}
                        onChange={(e) => setPlate(e.target.value.toUpperCase())}
                      />
                      <button
                        className="btn-main btn-blk __shadows_mini"
                        onClick={() => handleSearch()}
                        disabled={loading}
                      >
                        {loading ? "Searching..." : "Search price"}
                      </button>
                    </div>
                  </div>

                  {myCars.length > 0 && (
                    <div className="my-cars-section __shadows __margin-top __borders">
                      <p className="p_buypage_filtration  ">Your cars: </p>
                      <div className="my-cars-grid  ">
                        {myCars.map((car) => (
                          <div
                            key={car.id}
                            className="my-car-card __shadows_mini"
                            onClick={() => handleSearch(car.license_plate)}
                          >
                            <div className="car-info-stack">
                              <div className="car-plate-tag">
                                {car.license_plate}
                              </div>
                              <strong className="car-brand-text">
                                {car.brand} {car.model}
                              </strong>
                              <span className="car-year-text">
                                {car.year} year
                              </span>
                            </div>
                            <div className="select-text">Took →</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* КРОК 2: Виведення результатів парсингу */}
              {step === 2 && result && (
                <OffersGrid
                  result={result}
                  plate={plate}
                  setStep={setStep}
                  setSelectedPkg={setSelectedPkg}
                />
              )}

              {/* КРОК 3: Анкета клієнта */}
              {step === 3 && (
                <InsuranceForm
                  selectedPkg={selectedPkg}
                  formData={formData}
                  setFormData={setFormData}
                  handleOrder={handleOrder}
                  loading={loading}
                  setStep={setStep}
                />
              )}
            </div>
            <div className="item_flex_insurance item_flex_insurance_2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsurancePage;

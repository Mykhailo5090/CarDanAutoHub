import React, { useState } from "react";
import "./sell.scss";
import "../buy/buypage.scss";

const SellPage = () => {
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    price: "",
    mileage: "0",
    fuel_type: "Бензин",
    transmission: "Автомат",
    engine_volume: "",
    region: "",
    description: "",
    license_plate: "",
  });
  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    const value =
      e.target.name === "license_plate"
        ? e.target.value.toUpperCase()
        : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));

    if (!formData.license_plate) return alert("Введіть державний номер авто!");

    const data = new FormData();
    data.append("user_id", user.id);

    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    images.forEach((img) => data.append("images", img));

    try {
      const response = await fetch("http://localhost:5001/api/cars", {
        method: "POST",
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
    <div className="main">
      <div className="sub-body">
        <div className="sub-body__2">
          <div className="main_container_sellpage">
            <div className="sub_container_sellpage sub_container_sellpage_1"></div>
            <div className="sub_container_sellpage sub_container_sellpage_2">
              <form onSubmit={handleSubmit} className="sell-form">
                {/* Блок з номером авто */}
                <div className="license-plate-box">
                  <div className="license_plate_container license_plate_container_1">
                    <p className="p_gov_number_auto">Number plate <b className="b_gov_numb">* Obligatory plate *</b></p>
                    <hr className="hr_select_filtration"/>
                 
                  <input
                    name="license_plate"
                    placeholder="AA1234AA"
                    value={formData.license_plate}
                    onChange={handleChange}
                    required
                    className="license-plate-input"
                  />

                  </div>
                  
                </div>

                <input
                  name="brand"
                  placeholder="Марка (напр. Audi)"
                  onChange={handleChange}
                  required
                  className="filter-input"
                />
                <input
                  name="model"
                  placeholder="Модель"
                  onChange={handleChange}
                  required
                  className="filter-input"
                />

                {/* Рядок: Рік + Ціна */}
                <div className="form-row">
                  <input
                    name="year"
                    type="number"
                    placeholder="Рік"
                    onChange={handleChange}
                    required
                    className="filter-input"
                  />
                  <input
                    name="price"
                    type="number"
                    placeholder="Ціна ($)"
                    onChange={handleChange}
                    required
                    className="filter-input"
                  />
                </div>

                <input
                  name="mileage"
                  type="number"
                  placeholder="Пробіг (км)"
                  onChange={handleChange}
                  required
                  className="filter-input"
                />
                <input
                  name="engine_volume"
                  placeholder="Об'єм двигуна (напр. 2.0)"
                  onChange={handleChange}
                  className="filter-input"
                />
                <input
                  name="region"
                  placeholder="Місто/Регіон"
                  onChange={handleChange}
                  className="filter-input"
                />

                <label className="form-label">
                  Тип палива:
                  <select
                    name="fuel_type"
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="Бензин">Бензин</option>
                    <option value="Дизель">Дизель</option>
                    <option value="Електро">Електро</option>
                    <option value="Гібрид">Гібрид</option>
                    <option value="Газ/Бензин">Газ/Бензин</option>
                  </select>
                </label>

                <label className="form-label">
                  Коробка передач:
                  <select
                    name="transmission"
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="Автомат">Автомат</option>
                    <option value="Механіка">Механіка</option>
                    <option value="Варіатор">Варіатор</option>
                    <option value="Робот">Робот</option>
                  </select>
                </label>

                <textarea
                  name="description"
                  placeholder="Опис авто"
                  onChange={handleChange}
                  rows="4"
                  className="form-textarea"
                />

                <input
                  type="file"
                  multiple
                  onChange={(e) => setImages(Array.from(e.target.files))}
                  accept="image/*"
                  className="file-input"
                />

                <button type="submit" className="submit-btn">
                  Опублікувати оголошення
                </button>
              </form>
            </div>
            <div className="sub_container_sellpage sub_container_sellpage_1"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellPage;

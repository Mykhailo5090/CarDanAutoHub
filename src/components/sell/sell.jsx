import React, { useState } from "react";
import "./sell.scss";
import "../buy/buypage.scss";
import addimg from "../buy/img/photo-add.png";

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
                <div className="license-plate-box __shadows">
                  <div className="sellpage_container_to_p">
                    <p className="p_buypage_filtration p_buypage_filtration_sellpage">
                      Sell your car
                    </p>
                  </div>
                  <div className="license_plate_container license_plate_container_1">
                    <div className="flex_header_sellpage">
                      <p className="p_gov_number_auto">
                        {" "}
                        <b className="b_gov_numb">* Obligatory plate *</b>
                      </p>
                    </div>
                    <hr className="hr_select_filtration" />
                    <div className="sellpage_container_input_plate">
                      <div className="sellpage_padding_plate"></div>
                      <input
                        name="license_plate"
                        placeholder="AA1234AA"
                        value={formData.license_plate}
                        onChange={handleChange}
                        required
                        className="license-plate-input"
                      />
                      <div className="sellpage_padding_plate"></div>
                    </div>
                  </div>
                </div>
                <div className="license-plate-box __shadows license-plate-box_1">
                  <div className="container_sellpage_plate_2 container_sellpage_plate_2_1">
                    <input
                      name="brand"
                      placeholder="Brand (Audi,Ford)"
                      onChange={handleChange}
                      required
                      className="filter-input"
                    />
                    <input
                      name="model"
                      placeholder="Model (A6)"
                      onChange={handleChange}
                      required
                      className="filter-input"
                    />
                  </div>
                  <hr className="hr_select_filtration" />
                  <div className="container_sellpage_plate_2 container_sellpage_plate_2_2">
                    <label className="form-label">
                      <select
                        name="fuel_type"
                        onChange={handleChange}
                        className="filter_right_sort filter_right_sort_sellpage"
                      >
                        <option value="Бензин">Бензин</option>
                        <option value="Дизель">Дизель</option>
                        <option value="Електро">Електро</option>
                        <option value="Гібрид">Гібрид</option>
                        <option value="Газ/Бензин">Газ/Бензин</option>
                      </select>
                    </label>
                    <input
                      name="engine_volume"
                      placeholder="Engine: (2.0)"
                      onChange={handleChange}
                      className="filter-input filter-input_sellpage"
                    />
                    <input
                      name="year"
                      type="number"
                      placeholder="Year: (2000)"
                      onChange={handleChange}
                      required
                      className="filter-input filter-input_sellpage"
                    />
                  </div>

                  <hr className="hr_select_filtration" />

                  <div className="container_sellpage_plate_2 container_sellpage_plate_2_3">
                    <label className="form-label">
                      <select
                        name="transmission"
                        onChange={handleChange}
                        className="filter_right_sort filter_right_sort_sellpage"
                      >
                        <option value="Автомат">Автомат</option>
                        <option value="Механіка">Механіка</option>
                        <option value="Варіатор">Варіатор</option>
                        <option value="Робот">Робот</option>
                      </select>
                    </label>
                    <input
                      name="mileage"
                      type="number"
                      placeholder="Пробіг (км)"
                      onChange={handleChange}
                      required
                      className="filter-input filter-input_sellpage"
                    />
                    <input
                      name="region"
                      placeholder="Місто/Регіон"
                      onChange={handleChange}
                      className="filter-input filter-input_sellpage"
                    />
                  </div>
                </div>
                <div className="license-plate-box __shadows license-plate-box_2">
                  <div className="container_foot_sellpage container_foot_sellpage_1">
                    <div className="upload-container __shadow">
                      <label className="custom-file-upload">
                        {/* Твоя стокова фотка або заглушка */}
                        <img
                          src={addimg} // Шлях до твоєї стокової картинки в public або імпорту
                          alt="Додати фото"
                          className="upload-img-sellpage"
                        />
                        <span className="upload-text">
                          Press, to add photo's
                        </span>

                        {/* Сама магія: інпут живе тут, але схований */}
                        <input
                          type="file"
                          multiple
                          onChange={(e) =>
                            setImages(Array.from(e.target.files))
                          }
                          accept="image/*"
                          className="hidden-file-input"
                        />
                      </label>

                      {/* Бонус: виведемо плашку з кількістю вибраних файлів, щоб юзер бачив, що все спрацювало */}
                      {images && images.length > 0 && (
                        <div className="selected-files-badge">
                          Обрано фото: <strong>{images.length}</strong>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="container_foot_seelpage container_foot_sellpage_2">
                    <textarea
                      name="description"
                      placeholder="Text your car: "
                      onChange={handleChange}
                      rows="4"
                      className="filter-input filter-input-form-area"
                    />
                  </div>
                </div>
                <div className="license-plate-box __shadows license-plate-box_3">
                  <input
                    name="price"
                    type="number"
                    placeholder="Price: ($)"
                    onChange={handleChange}
                    required
                    className="filter-input filter_input_submit_sellpage"
                  />
                  <button type="submit" className="submit-btn">
                    Public
                  </button>
                </div>
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

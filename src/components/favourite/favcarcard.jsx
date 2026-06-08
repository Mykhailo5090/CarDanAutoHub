import React, { useState } from "react";

import yearimg from "../buy/img/year-img.png";
import engineimg from "../buy/img/engine-img.png";
import gearimg from "../buy/img/gear-box-img.png";
import mileageimg from "../buy/img/mileage-img.png";
import locationimg from "../buy/img/location-img.png";
import phoneimg from "../buy/img/telephone.png";

const FavCarCard = ({ car, isChecked, onSelectToggle, onRemove }) => {
  const images = JSON.parse(car.images);
  const [currentIdx, setCurrentIdx] = useState(0);

  const changePhoto = (e, direction) => {
    e.stopPropagation();
    let newIdx = currentIdx + direction;
    if (newIdx < 0) newIdx = images.length - 1;
    if (newIdx >= images.length) newIdx = 0;
    setCurrentIdx(newIdx);
  };

  return (
   
    <div className={`car-card fav-car-card  ${isChecked ? "car-card-selected" : ""}`}>
      
      {/* ЧЕКБОКС НА КАРТЦІ (Новий ізольований клас) */}
      <div className="fav-car-card-checkbox-wrapper">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => onSelectToggle(car.id)}
        />
      </div>

      {/* НОВИЙ ВЕРХНІЙ КОНТЕЙНЕР (Новий ізольований клас) */}
      <div className="fav-car-card-main-row">
        
        {/* 1. БЛОК З ФОТОГРАФІЄЮ ТА КАРУСЕЛЛЮ */}
        <div className="car-card-image-wrapper">
          <img
            src={`http://localhost:5001${images[currentIdx]}`}
            alt="car"
            className="car-card-img"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => changePhoto(e, -1)}
                className="car-card-nav-btn btn-left"
              >
                ←
              </button>
              <button
                onClick={(e) => changePhoto(e, 1)}
                className="car-card-nav-btn btn-right"
              >
                →
              </button>
              <div className="car-card-counter">
                {currentIdx + 1} / {images.length}
              </div>
            </>
          )}
          <button
            onClick={() => onRemove(car.id)}
            className="car-card-fav-btn active"
            title="Видалити з обраного"
          >
            ❤
          </button>
        </div>

        {/* 2. ІНФОРМАЦІЙНИЙ БЛОК КАРТКИ */}
        <div className="car-card-info ">
          {/* Заголовок: Бренд та Ціна */}
          <div className="car-card-header">
            <h3 className="car-card-title">{car.brand}</h3>
            <span className="car-card-price">${car.price}</span>
          </div>

          {/* Суб-заголовок: Модель та Рік */}
          <div className="car-card-header car-car-sub-header">
            <h5 className="car-card-title">{car.model}</h5>
            <div className="year_container_car_card">
              <img src={yearimg} alt="year-img" className="img_car_card" />
              <h5 className="car-card-title">Year: {car.year}</h5>
            </div>
          </div>

          {/* Контейнер з деталями та продавцем */}
          <div className="car-card-container">
            {/* Технічні характеристики */}
            <div className="car-card-item_1">
              <div className="year_container_car_card year_container_car_card_1">
                <img src={engineimg} alt="engine" className="img_car_card" />
                <h6 className="car-card-title">
                  {car.engine_volume}L {car.fuel_type}
                </h6>
              </div>

              <div className="year_container_car_card year_container_car_card_1">
                <img src={gearimg} alt="gearbox" className="img_car_card" />
                <h6 className="car-card-title">{car.transmission}</h6>
              </div>

              <div className="year_container_car_card year_container_car_card_1">
                <img src={mileageimg} alt="mileage" className="img_car_card" />
                <h6 className="car-card-title">{car.mileage} km</h6>
              </div>

              <div className="year_container_car_card year_container_car_card_1">
                <img
                  src={locationimg}
                  alt="location"
                  className="img_car_card"
                />
                <h6 className="car-card-title">{car.region}</h6>
              </div>

              <div className="year_container_car_card year_container_car_card_1">
                <img src={phoneimg} alt="phone" className="img_car_card" />
                <h6 className="car-card-title">
                  {car.owner_phone || "Не вказано"}
                </h6>
              </div>
            </div>

            {/* Блок продавця */}
            <div className="car-card-seller">
              <div className="car_card_sell_container car_card_sell_container_1">
                {car.owner_avatar ? (
                  <img
                    src={`http://localhost:5001${car.owner_avatar}`}
                    alt="Seller"
                    className="seller-avatar"
                  />
                ) : (
                  <div className="seller-avatar-placeholder">👤</div>
                )}
                <p className="car-card-title_22">
                  {car.owner_name || "Продавець"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
      {/* КІНЕЦЬ ВЕРХНЬОГО КОНТЕЙНЕРА */}

      {/* 3. ОКРЕМЙ НИЖНІЙ БЛОК (Нові ізольовані класи) */}
      {car.description && (
        <div className="fav-car-card-description-block">
          <div className="car-card-item_1 fav-car-card-item-description">
            <h5 className="car-card-title">Description from the owner:</h5>
            <h6 className="car-card-title">{car.description}</h6>
          </div>
        </div>
      )}
    </div>
  );
};

export default FavCarCard
import React, { useEffect, useState } from "react";
import "./buypage.scss";
import yearimg from "../buy/img/year-img.png";
import engineimg from "../buy/img/engine-img.png";
// import fuelimg from "../buy/img/fuel-img.png";
import gearimg from "../buy/img/gear-box-img.png";
import mileageimg from "../buy/img/mileage-img.png";
import locationimg from "../buy/img/location-img.png";

const BuyPage = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [photoIndices, setPhotoIndices] = useState({});

  // --- СТЕЙТ ДЛЯ ПАГІНАЦІЇ ---
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 10;

  const user = JSON.parse(localStorage.getItem("user"));

  const [filters, setFilters] = useState({
    region: "",
    transmission: "",
    fuel_type: "",
    minYear: "",
    maxYear: "",
    minPrice: "",
    maxPrice: "",
    maxMileage: "",
    minEngine: "",
    maxEngine: "",
    search: "",
  });

  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetch("http://localhost:5001/api/cars")
      .then((res) => res.json())
      .then((data) => {
        setCars(data);
        setFilteredCars(data);
        const indices = {};
        data.forEach((car) => (indices[car.id] = 0));
        setPhotoIndices(indices);
      });

    if (user) {
      fetch(`http://localhost:5001/api/favorites/${user.id}`)
        .then((res) => res.json())
        .then((data) => setFavorites(data.map((f) => f.id)));
    }
  }, []);

  const getUniqueValues = (key) => {
    return [
      ...new Set(
        cars.map((car) => car[key]).filter((v) => v !== null && v !== ""),
      ),
    ];
  };

  // Логіка фільтрації + Скидання сторінки при пошуку
  useEffect(() => {
    let result = [...cars];

    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.brand.toLowerCase().includes(s) ||
          c.model.toLowerCase().includes(s) ||
          (c.description && c.description.toLowerCase().includes(s)),
      );
    }

    if (filters.region)
      result = result.filter((c) => c.region === filters.region);
    if (filters.transmission)
      result = result.filter((c) => c.transmission === filters.transmission);
    if (filters.fuel_type)
      result = result.filter((c) => c.fuel_type === filters.fuel_type);
    if (filters.minYear)
      result = result.filter((c) => c.year >= Number(filters.minYear));
    if (filters.maxYear)
      result = result.filter((c) => c.year <= Number(filters.maxYear));
    if (filters.minPrice)
      result = result.filter(
        (c) => Number(c.price) >= Number(filters.minPrice),
      );
    if (filters.maxPrice)
      result = result.filter(
        (c) => Number(c.price) <= Number(filters.maxPrice),
      );
    if (filters.maxMileage)
      result = result.filter(
        (c) => Number(c.mileage) <= Number(filters.maxMileage),
      );
    if (filters.minEngine)
      result = result.filter(
        (c) => Number(c.engine_volume) >= Number(filters.minEngine),
      );
    if (filters.maxEngine)
      result = result.filter(
        (c) => Number(c.engine_volume) <= Number(filters.maxEngine),
      );
    if (sortBy === "cheap") result.sort((a, b) => a.price - b.price);
    if (sortBy === "expensive") result.sort((a, b) => b.price - a.price);
    if (sortBy === "newest")
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    setFilteredCars(result);
    setCurrentPage(1); // Коли юзер щось відфільтрував — кидаємо його на першу сторінку
  }, [filters, sortBy, cars]);

  // --- РОЗРАХУНОК ПАГІНАЦІЇ ---
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);

  const changePhoto = (carId, direction, max) => {
    setPhotoIndices((prev) => {
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
      await fetch(`http://localhost:5001/api/favorites/${user.id}/${carId}`, {
        method: "DELETE",
      });
      setFavorites(favorites.filter((id) => id !== carId));
    } else {
      await fetch("http://localhost:5001/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, car_id: carId }),
      });
      setFavorites([...favorites, carId]);
    }
  };

  return (
    <div className="main">
      <div className="sub-body">
        <div className="sub-body__2">
          <div className="__wrapper_buypage">
            <div className="filter-box">
              <div className="container_buypage_filtration container_buypage_filtration_1">
                <p className="p_buypage_filtration">Select Filtration</p>
                <hr className="hr_select_filtration" />
              </div>
              <div className="container_hr">
                <hr className="hr_filtration" />
              </div>
              <div className="container_buypage_filtration container_buypage_filtration_2">
                <input
                  placeholder="Search (brand, model...)"
                  className="filter-input filter-input_1"
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                />

                <select
                  className="filter_drop"
                  onChange={(e) =>
                    setFilters({ ...filters, region: e.target.value })
                  }
                >
                  <option value="">Region: All</option>
                  {getUniqueValues("region").map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>

                <select
                  className="filter_drop"
                  onChange={(e) =>
                    setFilters({ ...filters, transmission: e.target.value })
                  }
                >
                  <option value="">Gear-box: All</option>
                  {getUniqueValues("transmission").map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>

                <select
                  className="filter_drop"
                  onChange={(e) =>
                    setFilters({ ...filters, fuel_type: e.target.value })
                  }
                >
                  <option value="">Petrol type: All</option>
                  {getUniqueValues("fuel_type").map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              <div className="container_hr">
                <hr className="hr_filtration" />
              </div>

              <div className="container_buypage_filtration container_buypage_filtration_3">
                <div className="filter-range filter-range_1">
                  <div className="container_filter_range container_filter_range_1">
                    <p className="p_filter_range">Year:</p>
                  </div>
                  <div className="container_filter_range container_filter_range_2">
                    <input
                      type="number"
                      placeholder="Min:"
                      className="filter-input"
                      onChange={(e) =>
                        setFilters({ ...filters, minYear: e.target.value })
                      }
                    />
                    <input
                      type="number"
                      placeholder="Max:"
                      className="filter-input"
                      onChange={(e) =>
                        setFilters({ ...filters, maxYear: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="container_hr">
                <hr className="hr_filtration" />
              </div>

              <div className="container_buypage_filtration container_buypage_filtration_3">
                <div className="filter-range filter_range_1">
                  <div className="container_filter_range container_filter_range_1">
                    <p className="p_filter_range">Price:</p>
                  </div>
                  <div className="container_filter_range container_filter_range_2">
                    <input
                      type="number"
                      placeholder="Min:"
                      className="filter-input"
                      onChange={(e) =>
                        setFilters({ ...filters, minPrice: e.target.value })
                      }
                    />
                    <input
                      type="number"
                      placeholder="Max:"
                      className="filter-input"
                      onChange={(e) =>
                        setFilters({ ...filters, maxPrice: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="container_hr">
                <hr className="hr_filtration" />
              </div>

              <div className="container_buypage_filtration container_buypage_filtration_3">
                <div className="filter-range filter_range_1">
                  <div className="container_filter_range container_filter_range_1">
                    <p className="p_filter_range">Mileage:</p>
                  </div>
                  <div className="container_filter_range container_filter_range_2">
                    <input
                      type="number"
                      placeholder="Max:"
                      className="filter-input"
                      onChange={(e) =>
                        setFilters({ ...filters, maxMileage: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="container_hr">
                <hr className="hr_filtration" />
              </div>
            </div>

           
            <div className="cars-grid">
              {currentCars.map((car) => {
                const images = JSON.parse(car.images);
                const currentIdx = photoIndices[car.id] || 0;

                return (
                  <div key={car.id} className="car-card">
                    <div className="car-card-image-wrapper">
                      <img
                        src={`http://localhost:5001${images[currentIdx]}`}
                        alt="car"
                        className="car-card-img"
                      />
                      {images.length > 1 && (
                        <>
                          <button
                            onClick={() =>
                              changePhoto(car.id, -1, images.length)
                            }
                            className="car-card-nav-btn btn-left"
                          >
                            ←
                          </button>
                          <button
                            onClick={() =>
                              changePhoto(car.id, 1, images.length)
                            }
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
                        onClick={() => handleFavorite(car.id)}
                        className={`car-card-fav-btn ${favorites.includes(car.id) ? "active" : ""}`}
                      >
                        ❤
                      </button>
                    </div>

                    <div className="car-card-info">
                      <div className="car-card-header">
                        <h3 className="car-card-title">{car.brand}</h3>

                        <span className="car-card-price">${car.price}</span>
                      </div>
                      <div className="car-card-header car-car-sub-header">
                        <h5 className="car-card-title">{car.model}</h5>
                        <div className="year_container_car_card">
                          <img
                            src={yearimg}
                            alt="year-img"
                            className="img_car_card img_car_card_1"
                          />
                          <h5 className="car-card-title">Year: {car.year}</h5>
                        </div>
                      </div>

                      <div className="car-card-container">
                        <div className="car-card-item_1">
                          <div className="year_container_car_card year_container_car_card_1">
                            <img
                              src={engineimg}
                              alt="year-img"
                              className="img_car_card img_car_card_1"
                            />
                            <h6 className="car-card-title">
                               {car.engine_volume}L {car.fuel_type}
                            </h6>
                          </div>

                          <div className="year_container_car_card year_container_car_card_1">
                            <img
                              src={gearimg}
                              alt="year-img"
                              className="img_car_card img_car_card_1"
                            />
                            <h6 className="car-card-title">
                               {car.transmission} 
                            </h6>
                          </div>

                          <div className="year_container_car_card year_container_car_card_1">
                            <img
                              src={mileageimg}
                              alt="year-img"
                              className="img_car_card img_car_card_1"
                            />
                            <h6 className="car-card-title">
                               {car.mileage} km
                            </h6>
                          </div>
                          <div className="year_container_car_card year_container_car_card_1">
                            <img
                              src={locationimg}
                              alt="year-img"
                              className="img_car_card img_car_card_1"
                            />
                            <h6 className="car-card-title">
                               {car.region}  
                            </h6>
                          </div>
                          <div className="seller-details">
                            
                            <h6 className="car-card-title">
                               📞  {car.owner_phone || "Не вказано"}
                            </h6>
                            
                          </div>

                         
                          
                        </div>

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
                          <div className="car_card_sell_container car_card_sell_container_2">

                          </div>
                          
                          
                          
                        </div>


                      </div>

                      {/* --- ДОДАНИЙ БЛОК КОРИСТУВАЧА (ПРОДАВЦЯ) --- */}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="container_buypage_filter">
              <select
                className="filter_right_sort"
                onChange={(e) => setSortBy(e.target.value)}
              >
                
                <option value="newest">
                  Newest
                  </option>
                <option value="cheap">Cheap</option>
                <option value="expensive">Expensive</option>
              </select>
            </div>
          </div>

          {/* --- БЛОК ПАГІНАЦІЇ --- */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="pagination-arrow"
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`pagination-number ${currentPage === index + 1 ? "active" : ""}`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="pagination-arrow"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyPage;

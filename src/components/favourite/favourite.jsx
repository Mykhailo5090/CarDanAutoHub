import React, { useEffect, useState } from "react";
import "../buy/buypage.scss";
import "../favourite/favourite.scss";
import FavCarCard from "./favcarcard";
import CarFilters from "./carfilters";
import '../adaptation.scss';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [isComparing, setIsComparing] = useState(false);

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

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchFavorites = () => {
    if (!user) return;
    fetch(`http://localhost:5001/api/favorites/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setFavorites(data);
        setFilteredFavorites(data);
      });
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  useEffect(() => {
    let result = [...favorites];

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

    if (sortBy === "cheap") result.sort((a, b) => a.price - b.price);
    if (sortBy === "expensive") result.sort((a, b) => b.price - a.price);
    if (sortBy === "newest")
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    setFilteredFavorites(result);
  }, [filters, sortBy, favorites]);

  const removeFromFavorite = async (carId) => {
    await fetch(`http://localhost:5001/api/favorites/${user.id}/${carId}`, {
      method: "DELETE",
    });
    setSelectedIds((prev) => prev.filter((id) => id !== carId));
    setCompareList((prev) => prev.filter((car) => car.id !== carId));
    fetchFavorites();
  };

  const handleSelectToggle = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredFavorites.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredFavorites.map((car) => car.id));
    }
  };

  const handleDeleteSelected = async () => {
    if (
      window.confirm(
        `Видалити вибрані авто (${selectedIds.length}) з обраного?`,
      )
    ) {
      await Promise.all(
        selectedIds.map((carId) =>
          fetch(`http://localhost:5001/api/favorites/${user.id}/${carId}`, {
            method: "DELETE",
          }),
        ),
      );
      setSelectedIds([]);
      fetchFavorites();
    }
  };

  const handleCompareSelected = () => {
    const carsToCompare = favorites.filter((car) =>
      selectedIds.includes(car.id),
    );
    setCompareList(carsToCompare);
    setIsComparing(true);
  };

  const handleRemoveFromCompare = (carId) => {
    const updated = compareList.filter((car) => car.id !== carId);
    setCompareList(updated);
    if (updated.length === 0) setIsComparing(false);
  };

  if (!user) {
    return (
      <div className="__wrapper_buypage">
        <p className="p_alert_favourites">Будь ласка, увійдіть в аккаунт.</p>
      </div>
    );
  }

  /* ================= СТОРІНКА ПОРІВНЯННЯ ================= */
  if (isComparing) {
    return (
      <div className="__wrapper_buypage comparison-page-view">
        <div className="comparison-page-header">
          <button
            className="bulk-btn btn-back"
            onClick={() => setIsComparing(false)}
          >
            ← Back to Favourite's
          </button>
        </div>

        <div className="comparison-board-wrapper __shadows">
          <table className="comparison-board-table">
            <thead>
              <tr>
                <th className="sticky-spec-column">
                  {" "}
                  <strong>Car:</strong>{" "}
                </th>
                {compareList.map((car) => {
                  const images = JSON.parse(car.images);
                  return (
                    <th key={car.id} className="car-header-cell">
                      <button
                        className="remove-from-comp-btn"
                        onClick={() => handleRemoveFromCompare(car.id)}
                      >
                        ✕ Delete
                      </button>
                      <div className="comp-card-preview">
                        <img
                          src={`http://localhost:5001${images[0]}`}
                          alt="car"
                          className="comp-card-img"
                        />
                        <div className="comp-card-meta">
                          <h3>{car.brand}</h3>
                          <h4>{car.model}</h4>
                          <span className="comp-card-price">${car.price}</span>
                        </div>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="sticky-spec-column">
                  <strong>Year:</strong>
                </td>
                {compareList.map((car) => (
                  <td key={car.id} className="comp-data-cell">
                    {car.year}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="sticky-spec-column">
                  <strong>Mileage</strong>
                </td>
                {compareList.map((car) => (
                  <td key={car.id} className="comp-data-cell">
                    {car.mileage} km
                  </td>
                ))}
              </tr>
              <tr>
                <td className="sticky-spec-column">
                  <strong>Engine / Fuel</strong>
                </td>
                {compareList.map((car) => (
                  <td key={car.id} className="comp-data-cell">
                    {car.engine_volume}L ({car.fuel_type})
                  </td>
                ))}
              </tr>
              <tr>
                <td className="sticky-spec-column">
                  <strong>Gear-Box</strong>
                </td>
                {compareList.map((car) => (
                  <td key={car.id} className="comp-data-cell">
                    {car.transmission}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="sticky-spec-column">
                  <strong>Location</strong>
                </td>
                {compareList.map((car) => (
                  <td key={car.id} className="comp-data-cell">
                    {car.region}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="sticky-spec-column">
                  <strong>Phone Number</strong>
                </td>
                {compareList.map((car) => (
                  <td key={car.id} className="comp-data-cell">
                    {car.owner_phone || "Не вказано"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="sticky-spec-column">
                  <strong>Seller</strong>
                </td>
                {compareList.map((car) => (
                  <td key={car.id} className="comp-data-cell">
                    <div className="comp-seller-info">
                      {car.owner_avatar ? (
                        <img
                          src={`http://localhost:5001${car.owner_avatar}`}
                          alt="avatar"
                          className="comp-seller-avatar"
                        />
                      ) : (
                        "👤 "
                      )}
                      <span>{car.owner_name || "Продавець"}</span>
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="sticky-spec-column">
                  <strong>Description from the owner:</strong>
                </td>
                {compareList.map((car) => (
                  <td key={car.id} className="comp-data-cell comp-desc-cell">
                    <p>{car.description || "Опис відсутній"}</p>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  /* ================= ГОЛОВНИЙ ЕКРАН ОБРАНОГО ================= */
  return (
    <div className="main">
      <div className="sub-body">
        <div className="sub-body__2">
          <div className="__wrapper_buypage">
            {/* Фільтри */}
            <CarFilters
              cars={favorites}
              filters={filters}
              setFilters={setFilters}
              favoritesLength={favorites.length}
              selectedCount={selectedIds.length}
              onSelectAll={handleSelectAll}
              onCompare={handleCompareSelected}
              onDeleteBulk={handleDeleteSelected}
              isAllSelected={
                selectedIds.length === filteredFavorites.length &&
                filteredFavorites.length > 0
              }
            />

            {/* Грід з картками */}
            <div className="cars-grid">
              {filteredFavorites.length === 0 ? (
                <p
                  className="p_alert_favourites"
                  style={{ gridColumn: "1/-1", textAlign: "center" }}
                >
                  Нічого не знайдено за вказаними фільтрами.
                </p>
              ) : (
                filteredFavorites.map((car) => (
                  <FavCarCard
                    key={car.id}
                    car={car}
                    isChecked={selectedIds.includes(car.id)}
                    onSelectToggle={handleSelectToggle}
                    onRemove={removeFromFavorite}
                  />
                ))
              )}
            </div>

            {/* ТОЧНЕ ПОВТОРЕННЯ СТРУКТУРИ З BUYPAGE — БЛОК СОРТУВАННЯ ЗПРАВА ПІСЛЯ ГРІДА */}
            <div className="container_buypage_filter">
              <select
                className="filter_right_sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="cheap">Cheap</option>
                <option value="expensive">Expensive</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;

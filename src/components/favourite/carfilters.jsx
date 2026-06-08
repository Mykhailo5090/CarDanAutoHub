import React from "react";
import "../buy/buypage.scss";
import "../favourite/favourite.scss";

const CarFilters = ({
  cars,
  filters,
  setFilters,
  favoritesLength,
  selectedCount,
  onSelectAll,
  onCompare,
  onDeleteBulk,
  isAllSelected
}) => {
  
  const getUniqueValues = (key) => {
    return [
      ...new Set(
        cars.map((car) => car[key]).filter((v) => v !== null && v !== "")
      ),
    ];
  };

  return (
    <div className="filter-box">
      <div className="container_buypage_filtration container_buypage_filtration_1">
        <p className="p_buypage_filtration">Select Filtration</p>
        <hr className="hr_select_filtration" />
      </div>
      
      

      {/* Функціонал масових дій з чекбоксами (залишається у фільтрах за твоїм планом) */}
      {favoritesLength > 0 && (
        <div className="container_buypage_filtration bulk-actions-filter-group" >
            <div className="container_hr">
        <hr className="hr_filtration" />
      </div>
          <label className="bulk-checkbox-label" >
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={onSelectAll}
              
            />
            <span className="p_checkbox_fav">Select All ({favoritesLength})</span>
          </label>

          {selectedCount > 0 && (
            <div className="bulk-buttons" >
              <button className="bulk-btn btn-compare" onClick={onCompare} >
                📊 Compare ({selectedCount})
              </button>
              <button className="bulk-btn btn-delete" onClick={onDeleteBulk} >
                🗑️ Delete ({selectedCount})
              </button>
            </div>
          )}
          <div className="container_hr" ><hr className="hr_filtration" /></div>
        </div>
      )}

      <div className="container_buypage_filtration container_buypage_filtration_2">
        <input
          placeholder="Search (brand, model...)"
          className="filter-input filter-input_1"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />

        <select
          className="filter_drop"
          value={filters.region}
          onChange={(e) => setFilters({ ...filters, region: e.target.value })}
        >
          <option value="">Region: All</option>
          {getUniqueValues("region").map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>

        <select
          className="filter_drop"
          value={filters.transmission}
          onChange={(e) => setFilters({ ...filters, transmission: e.target.value })}
        >
          <option value="">Gear-box: All</option>
          {getUniqueValues("transmission").map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>

        <select
          className="filter_drop"
          value={filters.fuel_type}
          onChange={(e) => setFilters({ ...filters, fuel_type: e.target.value })}
        >
          <option value="">Petrol type: All</option>
          {getUniqueValues("fuel_type").map((v) => (
            <option key={v} value={v}>{v}</option>
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
              value={filters.minYear}
              onChange={(e) => setFilters({ ...filters, minYear: e.target.value })}
            />
            <input
              type="number"
              placeholder="Max:"
              className="filter-input"
              value={filters.maxYear}
              onChange={(e) => setFilters({ ...filters, maxYear: e.target.value })}
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
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            />
            <input
              type="number"
              placeholder="Max:"
              className="filter-input"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
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
              value={filters.maxMileage}
              onChange={(e) => setFilters({ ...filters, maxMileage: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="container_hr">
        <hr className="hr_filtration" />
      </div>
    </div>
  );
};

export default CarFilters;
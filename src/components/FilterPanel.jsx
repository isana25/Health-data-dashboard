import React, { useState, useEffect } from 'react';
import _ from 'lodash';

const FilterPanel = ({ filters, onFilterChange, data }) => {
  const [availableCountries, setAvailableCountries] = useState([]);
  const [availableRegions, setAvailableRegions] = useState([]);
  const [availableIndicators, setAvailableIndicators] = useState([]);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    if (data.length > 0) {
      const countries = _.uniq(data.map(d => d.country)).sort();
      const regions = _.uniq(data.map(d => d.region)).sort();
      const indicators = _.uniq(data.map(d => d.indicator)).sort();
      
      setAvailableCountries(countries);
      setAvailableRegions(regions);
      setAvailableIndicators(indicators);
    }
  }, [data]);

  const handleCountryChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    onFilterChange({ ...filters, countries: selected });
  };

  const handleRegionChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    onFilterChange({ ...filters, regions: selected });
  };

  const handleIndicatorChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    onFilterChange({ ...filters, indicators: selected });
  };

  const handleYearChange = (e, type) => {
    const newYearRange = [...filters.yearRange];
    if (type === 'min') {
      newYearRange[0] = parseInt(e.target.value);
    } else {
      newYearRange[1] = parseInt(e.target.value);
    }
    onFilterChange({ ...filters, yearRange: newYearRange });
  };

  const resetFilters = () => {
    onFilterChange({
      countries: [],
      regions: [],
      indicators: ['Life Expectancy', 'Infant Mortality Rate'],
      yearRange: [2000, 2023]
    });
  };

  return (
    <aside className={`filter-panel ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="filter-header">
        <h2>Filters</h2>
        <button 
          className="toggle-btn"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label="Toggle filters"
        >
          {isExpanded ? '←' : '→'}
        </button>
      </div>
      
      {isExpanded && (
        <div className="filter-content">
          <div className="filter-section">
            <label>
              <span className="filter-label">Regions</span>
              <select 
                multiple 
                value={filters.regions}
                onChange={handleRegionChange}
                className="filter-select"
              >
                <option value="">All Regions</option>
                {availableRegions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="filter-section">
            <label>
              <span className="filter-label">Countries</span>
              <select 
                multiple 
                value={filters.countries}
                onChange={handleCountryChange}
                className="filter-select"
              >
                <option value="">All Countries</option>
                {availableCountries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="filter-section">
            <label>
              <span className="filter-label">Health Indicators</span>
              <select 
                multiple 
                value={filters.indicators}
                onChange={handleIndicatorChange}
                className="filter-select"
              >
                {availableIndicators.map(indicator => (
                  <option key={indicator} value={indicator}>{indicator}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="filter-section">
            <label>
              <span className="filter-label">Year Range</span>
              <div className="year-range">
                <input 
                  type="number" 
                  min="2000" 
                  max="2023"
                  value={filters.yearRange[0]}
                  onChange={(e) => handleYearChange(e, 'min')}
                  className="year-input"
                />
                <span>to</span>
                <input 
                  type="number" 
                  min="2000" 
                  max="2023"
                  value={filters.yearRange[1]}
                  onChange={(e) => handleYearChange(e, 'max')}
                  className="year-input"
                />
              </div>
            </label>
          </div>

          <button className="reset-btn" onClick={resetFilters}>
            Reset All Filters
          </button>
        </div>
      )}
    </aside>
  );
};

export default FilterPanel;

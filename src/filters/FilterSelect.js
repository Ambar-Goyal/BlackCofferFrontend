import React from 'react';
import { useDataContext } from '../context/DataContext';

const FilterSelect = ({ label, filterKey, options }) => {
  const { filters, setFilter } = useDataContext();

  return (
    <div className="filter-select">
      <label>{label}</label>
      <select
        value={filters[filterKey] || ''}
        onChange={e => setFilter(filterKey, e.target.value)}
      >
        <option value="">All</option>
        {options.map(opt => (
          <option key={opt || 'unknown'} value={opt}>
            {opt || 'Unknown'}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterSelect;

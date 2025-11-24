import React from 'react';
import FilterSelect from '../filters/FilterSelect';
import { useDataContext } from '../context/DataContext';

const Sidebar = () => {
  const { filterOptions, loadingFilters } = useDataContext();

  if (loadingFilters) {
    return <aside className="sidebar">Loading filters...</aside>;
  }

  return (
    <aside className="sidebar">
      <h2>Filters</h2>

      <FilterSelect
        label="End Year"
        filterKey="end_year"
        options={filterOptions?.end_years || []}
      />

      <FilterSelect
        label="Topic"
        filterKey="topic"
        options={filterOptions?.topics || []}
      />

      <FilterSelect
        label="Sector"
        filterKey="sector"
        options={filterOptions?.sectors || []}
      />

      <FilterSelect
        label="Region"
        filterKey="region"
        options={filterOptions?.regions || []}
      />

      <FilterSelect
        label="PESTLE"
        filterKey="pestle"
        options={filterOptions?.pestles || []}
      />

      <FilterSelect
        label="Source"
        filterKey="source"
        options={filterOptions?.sources || []}
      />

      <FilterSelect
        label="SWOT"
        filterKey="swot"
        options={filterOptions?.swots || []}
      />

      <FilterSelect
        label="Country"
        filterKey="country"
        options={filterOptions?.countries || []}
      />

      <FilterSelect
        label="City"
        filterKey="city"
        options={filterOptions?.cities || []}
      />
    </aside>
  );
};

export default Sidebar;

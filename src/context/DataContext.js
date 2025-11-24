import React, { createContext, useContext, useEffect, useState } from 'react';
import apiClient from '../api/apiClient';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    end_year: '',
    topic: '',
    sector: '',
    region: '',
    pestle: '',
    source: '',
    swot: '',
    country: '',
    city: ''
  });

  const [filterOptions, setFilterOptions] = useState({
    topics: [],
    sectors: [],
    regions: [],
    pestles: [],
    swots: [],
    countries: [],
    cities: [],
    end_years: []
  });

  const [data, setData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [loadingFilters, setLoadingFilters] = useState(false);
  const [error, setError] = useState(null);

  // Fetch filter options once
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        setLoadingFilters(true);
        const res = await apiClient.get('/api/filters');
        if (res.data.success) {
          setFilterOptions(res.data.filters);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load filters');
      } finally {
        setLoadingFilters(false);
      }
    };
    fetchFilters();
  }, []);

  // Fetch data whenever filters change
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        setError(null);
        const params = {};
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params[key] = value;
        });

        const res = await apiClient.get('/api/data', { params });
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load data');
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [filters]);

  const setFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <DataContext.Provider
      value={{
        data,
        filters,
        filterOptions,
        loadingData,
        loadingFilters,
        error,
        setFilter
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => useContext(DataContext);

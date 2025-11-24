import React from 'react';
import { useDataContext } from '../context/DataContext';
import IntensityByCountryBarChart from '../charts/IntensityByCountryBarChart';
import LikelihoodByRegionBarChart from '../charts/LikelihoodByRegionBarChart';
import RelevanceByYearLineChart from '../charts/RelevanceByYearLineChart';
import TopicDistributionPieChart from '../charts/TopicDistributionPieChart';
import RegionBubbleChart from '../charts/RegionBubbleChart';
import SectorBarChart from '../charts/SectorBarChart';

const Dashboard = () => {
  const { data, loadingData, error } = useDataContext();

  if (loadingData) return <div>Loading data...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard">
      <div className="chart-grid">
        <div className="chart-card">
          <h3>Intensity vs Country</h3>
          <IntensityByCountryBarChart data={data} />
        </div>
        <div className="chart-card">
          <h3>Likelihood vs Region</h3>
          <LikelihoodByRegionBarChart data={data} />
        </div>
        <div className="chart-card">
          <h3>Relevance vs Year</h3>
          <RelevanceByYearLineChart data={data} />
        </div>
        <div className="chart-card">
          <h3>Topic Distribution</h3>
          <TopicDistributionPieChart data={data} />
        </div>
        <div className="chart-card">
          <h3>Region-wise Bubble Chart</h3>
          <RegionBubbleChart data={data} />
        </div>
        <div className="chart-card">
          <h3>Sector-wise Bar Chart</h3>
          <SectorBarChart data={data} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

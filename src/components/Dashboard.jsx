import React, { useState, useEffect } from 'react';
import Header from './Header';
import FilterPanel from './FilterPanel';
import ChartContainer from './ChartContainer';
import InsightPanel from './InsightPanel';
import { getHealthData } from '../data/healthData';
import { filterData, aggregateData } from '../utils/dataProcessor';
import { generateInsights } from '../utils/insightEngine';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    countries: [],
    regions: [],
    indicators: ['Life Expectancy', 'Infant Mortality Rate'],
    yearRange: [2000, 2023]
  });
  const [insights, setInsights] = useState([]);
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const healthData = await getHealthData();
      setData(healthData);
      setFilteredData(healthData);
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const filtered = filterData(data, filters);
      setFilteredData(filtered);
      
      // Generate insights from filtered data
      const newInsights = generateInsights(filtered, filters);
      setInsights(newInsights);
    }
  }, [filters, data]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleInsightClick = (insight) => {
    setSelectedInsight(insight);
    // Update filters to focus on the insight
    setFilters({
      ...filters,
      countries: insight.countries || filters.countries,
      indicators: insight.indicators || filters.indicators,
      yearRange: insight.yearRange || filters.yearRange
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading Global Health Data...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Header />
      <div className="dashboard-content">
        <FilterPanel 
          filters={filters} 
          onFilterChange={handleFilterChange}
          data={data}
        />
        <div className="main-content">
          <InsightPanel 
            insights={insights}
            onInsightClick={handleInsightClick}
            selectedInsight={selectedInsight}
          />
          <ChartContainer 
            data={filteredData}
            filters={filters}
            selectedInsight={selectedInsight}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

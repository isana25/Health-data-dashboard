import _ from 'lodash';

export const filterData = (data, filters) => {
  let filtered = [...data];

  // Filter by countries
  if (filters.countries && filters.countries.length > 0) {
    filtered = filtered.filter(d => filters.countries.includes(d.country));
  }

  // Filter by regions
  if (filters.regions && filters.regions.length > 0) {
    filtered = filtered.filter(d => filters.regions.includes(d.region));
  }

  // Filter by indicators
  if (filters.indicators && filters.indicators.length > 0) {
    filtered = filtered.filter(d => filters.indicators.includes(d.indicator));
  }

  // Filter by year range
  if (filters.yearRange) {
    filtered = filtered.filter(d => 
      d.year >= filters.yearRange[0] && d.year <= filters.yearRange[1]
    );
  }

  return filtered;
};

export const aggregateData = (data, filters) => {
  // Return data aggregated by selected dimensions
  return data;
};

export const detectAnomalies = (data) => {
  const anomalies = [];
  
  // Group by country and indicator
  const grouped = _.groupBy(data, d => `${d.country}-${d.indicator}`);
  
  Object.keys(grouped).forEach(key => {
    const series = _.sortBy(grouped[key], 'year');
    const values = series.map(d => d.value);
    
    if (values.length < 3) return;
    
    const mean = _.mean(values);
    const stdDev = Math.sqrt(_.mean(values.map(v => Math.pow(v - mean, 2))));
    
    series.forEach(point => {
      const zScore = Math.abs((point.value - mean) / stdDev);
      if (zScore > 2.5) { // Outlier detection
        anomalies.push({
          ...point,
          zScore: zScore.toFixed(2)
        });
      }
    });
  });
  
  return anomalies.slice(0, 10); // Return top 10 anomalies
};

export const calculateTrend = (data, country, indicator) => {
  const filtered = data.filter(d => 
    d.country === country && d.indicator === indicator
  );
  
  if (filtered.length < 2) return null;
  
  const sorted = _.sortBy(filtered, 'year');
  const firstValue = sorted[0].value;
  const lastValue = sorted[sorted.length - 1].value;
  const percentChange = ((lastValue - firstValue) / firstValue) * 100;
  
  return {
    firstYear: sorted[0].year,
    lastYear: sorted[sorted.length - 1].year,
    firstValue,
    lastValue,
    percentChange: percentChange.toFixed(2),
    direction: percentChange > 0 ? 'increase' : 'decrease'
  };
};

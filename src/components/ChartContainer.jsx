import React, { useMemo } from 'react';
import Plot from 'react-plotly.js';
import { aggregateData, detectAnomalies } from '../utils/dataProcessor';

const ChartContainer = ({ data, filters, selectedInsight }) => {
  const chartData = useMemo(() => {
    return aggregateData(data, filters);
  }, [data, filters]);

  const anomalies = useMemo(() => {
    return detectAnomalies(chartData);
  }, [chartData]);

  // Time Series Chart
  const timeSeriesData = useMemo(() => {
    const traces = [];
    
    filters.indicators.forEach(indicator => {
      const indicatorData = chartData.filter(d => d.indicator === indicator);
      const groupedByCountry = {};
      
      indicatorData.forEach(d => {
        if (!groupedByCountry[d.country]) {
          groupedByCountry[d.country] = { years: [], values: [] };
        }
        groupedByCountry[d.country].years.push(d.year);
        groupedByCountry[d.country].values.push(d.value);
      });

      Object.keys(groupedByCountry).forEach(country => {
        traces.push({
          x: groupedByCountry[country].years,
          y: groupedByCountry[country].values,
          type: 'scatter',
          mode: 'lines+markers',
          name: `${country} - ${indicator}`,
          line: { width: 2 },
          marker: { size: 6 }
        });
      });
    });

    return traces;
  }, [chartData, filters.indicators]);

  // Regional Comparison Bar Chart
  const regionalData = useMemo(() => {
    const traces = [];
    
    filters.indicators.forEach(indicator => {
      const indicatorData = chartData.filter(d => d.indicator === indicator);
      const groupedByRegion = {};
      
      indicatorData.forEach(d => {
        if (!groupedByRegion[d.region]) {
          groupedByRegion[d.region] = [];
        }
        groupedByRegion[d.region].push(d.value);
      });

      const regions = Object.keys(groupedByRegion);
      const averages = regions.map(region => 
        groupedByRegion[region].reduce((a, b) => a + b, 0) / groupedByRegion[region].length
      );

      traces.push({
        x: regions,
        y: averages,
        type: 'bar',
        name: indicator,
        text: averages.map(v => v.toFixed(2)),
        textposition: 'auto'
      });
    });

    return traces;
  }, [chartData, filters.indicators]);

  // Country Comparison Heatmap
  const heatmapData = useMemo(() => {
    if (filters.indicators.length === 0 || chartData.length === 0) return [];

    const countries = [...new Set(chartData.map(d => d.country))];
    const years = [...new Set(chartData.map(d => d.year))].sort();
    const indicator = filters.indicators[0];

    const matrix = years.map(year => {
      return countries.map(country => {
        const point = chartData.find(
          d => d.year === year && d.country === country && d.indicator === indicator
        );
        return point ? point.value : null;
      });
    });

    return [{
      z: matrix,
      x: countries,
      y: years,
      type: 'heatmap',
      colorscale: 'Viridis',
      hoverongaps: false
    }];
  }, [chartData, filters.indicators]);

  const commonLayout = {
    paper_bgcolor: 'rgba(255,255,255,0.95)',
    plot_bgcolor: 'rgba(255,255,255,0.95)',
    font: { family: 'Inter, sans-serif' },
    margin: { t: 40, r: 40, b: 60, l: 60 }
  };

  return (
    <div className="chart-container">
      <div className="chart-wrapper">
        <h3 className="chart-title">📈 Trend Analysis Over Time</h3>
        <Plot
          data={timeSeriesData}
          layout={{
            ...commonLayout,
            title: '',
            xaxis: { title: 'Year', gridcolor: '#e0e0e0' },
            yaxis: { title: 'Value', gridcolor: '#e0e0e0' },
            hovermode: 'closest',
            showlegend: true,
            legend: { orientation: 'v', x: 1.02, y: 1 }
          }}
          config={{ responsive: true, displayModeBar: true }}
          style={{ width: '100%', height: '450px' }}
        />
      </div>

      <div className="chart-wrapper">
        <h3 className="chart-title">🌍 Regional Comparison</h3>
        <Plot
          data={regionalData}
          layout={{
            ...commonLayout,
            title: '',
            xaxis: { title: 'Region' },
            yaxis: { title: 'Average Value' },
            barmode: 'group',
            showlegend: true
          }}
          config={{ responsive: true, displayModeBar: true }}
          style={{ width: '100%', height: '400px' }}
        />
      </div>

      {chartData.length > 0 && (
        <div className="chart-wrapper">
          <h3 className="chart-title">🔥 Country-Year Heatmap</h3>
          <Plot
            data={heatmapData}
            layout={{
              ...commonLayout,
              title: '',
              xaxis: { title: 'Country', side: 'bottom' },
              yaxis: { title: 'Year' }
            }}
            config={{ responsive: true, displayModeBar: true }}
            style={{ width: '100%', height: '500px' }}
          />
        </div>
      )}

      {anomalies.length > 0 && (
        <div className="anomaly-section">
          <h3>⚠️ Detected Anomalies</h3>
          <div className="anomaly-list">
            {anomalies.map((anomaly, index) => (
              <div key={index} className="anomaly-card">
                <strong>{anomaly.country}</strong> - {anomaly.indicator}
                <br />
                <span>Year {anomaly.year}: {anomaly.value.toFixed(2)} (unusual pattern detected)</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartContainer;

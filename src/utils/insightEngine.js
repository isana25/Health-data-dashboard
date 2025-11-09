import _ from 'lodash';
import { calculateTrend } from './dataProcessor';

export const generateInsights = (data, filters) => {
  const insights = [];
  
  if (data.length === 0) return insights;

  // Group data by country and indicator
  const grouped = _.groupBy(data, d => `${d.country}-${d.indicator}`);
  
  // Find dramatic improvements (>30% positive change)
  Object.keys(grouped).forEach(key => {
    const [country, indicator] = key.split('-');
    const series = _.sortBy(grouped[key], 'year');
    
    if (series.length < 5) return;
    
    const startValue = series[0].value;
    const endValue = series[series.length - 1].value;
    const percentChange = ((endValue - startValue) / startValue) * 100;
    
    // Positive indicators (higher is better)
    const positiveIndicators = ['Life Expectancy', 'Healthcare Expenditure (% GDP)', 'Hospital Beds (per 1000)'];
    const isPositiveIndicator = positiveIndicators.some(ind => indicator.includes(ind));
    
    // Negative indicators (lower is better)
    const negativeIndicators = ['Mortality', 'Infant Mortality'];
    const isNegativeIndicator = negativeIndicators.some(ind => indicator.includes(ind));
    
    if (isPositiveIndicator && percentChange > 15) {
      insights.push({
        type: 'Improvement',
        icon: '📈',
        title: `${country}: Major Progress in ${indicator}`,
        description: `${country} has improved ${indicator} by ${Math.abs(percentChange).toFixed(1)}% from ${series[0].year} to ${series[series.length - 1].year}`,
        impact: `+${Math.abs(percentChange).toFixed(1)}%`,
        countries: [country],
        indicators: [indicator],
        yearRange: [series[0].year, series[series.length - 1].year]
      });
    }
    
    if (isNegativeIndicator && percentChange < -15) {
      insights.push({
        type: 'Improvement',
        icon: '✅',
        title: `${country}: Significant Reduction in ${indicator}`,
        description: `${country} has reduced ${indicator} by ${Math.abs(percentChange).toFixed(1)}% from ${series[0].year} to ${series[series.length - 1].year}`,
        impact: `${percentChange.toFixed(1)}%`,
        countries: [country],
        indicators: [indicator],
        yearRange: [series[0].year, series[series.length - 1].year]
      });
    }
  });

  // Find regional leaders
  const regions = _.uniq(data.map(d => d.region));
  filters.indicators.forEach(indicator => {
    const indicatorData = data.filter(d => d.indicator === indicator);
    const latestYear = Math.max(...indicatorData.map(d => d.year));
    const latestData = indicatorData.filter(d => d.year === latestYear);
    
    if (latestData.length === 0) return;
    
    const bestPerformer = _.maxBy(latestData, 'value');
    if (bestPerformer) {
      insights.push({
        type: 'Leader',
        icon: '🏆',
        title: `${bestPerformer.country} Leads in ${indicator}`,
        description: `In ${latestYear}, ${bestPerformer.country} achieved the highest ${indicator} value of ${bestPerformer.value.toFixed(2)}`,
        impact: 'Best in Region',
        countries: [bestPerformer.country],
        indicators: [indicator],
        yearRange: [latestYear, latestYear]
      });
    }
  });

  // Find rapid changes in recent years
  const recentYears = 5;
  const currentYear = Math.max(...data.map(d => d.year));
  const recentData = data.filter(d => d.year >= currentYear - recentYears);
  
  const recentGrouped = _.groupBy(recentData, d => `${d.country}-${d.indicator}`);
  
  Object.keys(recentGrouped).forEach(key => {
    const [country, indicator] = key.split('-');
    const series = _.sortBy(recentGrouped[key], 'year');
    
    if (series.length < 3) return;
    
    // Calculate year-over-year changes
    const changes = [];
    for (let i = 1; i < series.length; i++) {
      const change = Math.abs(series[i].value - series[i-1].value);
      changes.push(change);
    }
    
    const avgChange = _.mean(changes);
    const maxChange = _.max(changes);
    
    if (maxChange > avgChange * 2) {
      insights.push({
        type: 'Alert',
        icon: '⚡',
        title: `Rapid Change in ${country}`,
        description: `${indicator} in ${country} showed unusual volatility in recent years`,
        impact: 'High Volatility',
        countries: [country],
        indicators: [indicator],
        yearRange: [currentYear - recentYears, currentYear]
      });
    }
  });

  // Sort insights by impact and return top 8
  return insights.slice(0, 8);
};

// Simulated health data based on World Bank indicators
// In production, this would fetch from World Bank API or load from CSV

export const getHealthData = async () => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const countries = [
    { name: 'United States', region: 'North America' },
    { name: 'Canada', region: 'North America' },
    { name: 'Mexico', region: 'North America' },
    { name: 'Brazil', region: 'South America' },
    { name: 'Argentina', region: 'South America' },
    { name: 'United Kingdom', region: 'Europe' },
    { name: 'Germany', region: 'Europe' },
    { name: 'France', region: 'Europe' },
    { name: 'Italy', region: 'Europe' },
    { name: 'Spain', region: 'Europe' },
    { name: 'China', region: 'Asia' },
    { name: 'India', region: 'Asia' },
    { name: 'Japan', region: 'Asia' },
    { name: 'South Korea', region: 'Asia' },
    { name: 'Indonesia', region: 'Asia' },
    { name: 'Nigeria', region: 'Africa' },
    { name: 'South Africa', region: 'Africa' },
    { name: 'Kenya', region: 'Africa' },
    { name: 'Egypt', region: 'Africa' },
    { name: 'Australia', region: 'Oceania' },
  ];

  const indicators = [
    { 
      name: 'Life Expectancy', 
      baseValues: { 
        'North America': 78, 'South America': 75, 'Europe': 80, 
        'Asia': 73, 'Africa': 63, 'Oceania': 82 
      },
      trend: 0.15
    },
    { 
      name: 'Infant Mortality Rate', 
      baseValues: { 
        'North America': 6, 'South America': 15, 'Europe': 4, 
        'Asia': 20, 'Africa': 45, 'Oceania': 4 
      },
      trend: -0.5
    },
    { 
      name: 'Maternal Mortality Ratio', 
      baseValues: { 
        'North America': 19, 'South America': 60, 'Europe': 12, 
        'Asia': 120, 'Africa': 400, 'Oceania': 6 
      },
      trend: -2
    },
    { 
      name: 'Healthcare Expenditure (% GDP)', 
      baseValues: { 
        'North America': 16, 'South America': 8, 'Europe': 10, 
        'Asia': 5, 'Africa': 5, 'Oceania': 9 
      },
      trend: 0.08
    },
    { 
      name: 'Hospital Beds (per 1000)', 
      baseValues: { 
        'North America': 2.8, 'South America': 2.2, 'Europe': 5.0, 
        'Asia': 3.5, 'Africa': 1.3, 'Oceania': 3.8 
      },
      trend: 0.02
    },
  ];

  const years = Array.from({ length: 24 }, (_, i) => 2000 + i);
  const data = [];

  countries.forEach(country => {
    indicators.forEach(indicator => {
      const baseValue = indicator.baseValues[country.region];
      
      years.forEach(year => {
        const yearOffset = year - 2000;
        const randomVariation = (Math.random() - 0.5) * baseValue * 0.1;
        const trendValue = indicator.trend * yearOffset;
        
        // Add special case: dramatic improvement
        let specialBoost = 0;
        if (country.name === 'Rwanda' && indicator.name === 'Life Expectancy' && year > 2010) {
          specialBoost = (year - 2010) * 0.8; // Dramatic improvement
        }
        
        const value = Math.max(0, baseValue + trendValue + randomVariation + specialBoost);
        
        data.push({
          country: country.name,
          region: country.region,
          indicator: indicator.name,
          year: year,
          value: parseFloat(value.toFixed(2))
        });
      });
    });
  });

  // Add Rwanda as example of dramatic improvement
  const rwanda = { name: 'Rwanda', region: 'Africa' };
  indicators.forEach(indicator => {
    const baseValue = indicator.baseValues['Africa'];
    years.forEach(year => {
      const yearOffset = year - 2000;
      let value = baseValue + indicator.trend * yearOffset;
      
      // Dramatic improvement after 2010
      if (year > 2010 && indicator.name === 'Life Expectancy') {
        value += (year - 2010) * 1.2;
      }
      if (year > 2010 && indicator.name === 'Infant Mortality Rate') {
        value -= (year - 2010) * 2.5;
      }
      
      data.push({
        country: rwanda.name,
        region: rwanda.region,
        indicator: indicator.name,
        year: year,
        value: Math.max(0, parseFloat(value.toFixed(2)))
      });
    });
  });

  return data;
};

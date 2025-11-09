import React from 'react';

const InsightPanel = ({ insights, onInsightClick, selectedInsight }) => {
  if (insights.length === 0) {
    return (
      <div className="insight-panel empty">
        <div className="insight-header">
          <h3>🔍 Guided Insights</h3>
        </div>
        <p className="empty-message">Apply filters to discover insights in your data</p>
      </div>
    );
  }

  return (
    <div className="insight-panel">
      <div className="insight-header">
        <h3>🔍 Guided Insights</h3>
        <span className="insight-count">{insights.length} insights found</span>
      </div>
      <div className="insights-list">
        {insights.map((insight, index) => (
          <div 
            key={index}
            className={`insight-card ${selectedInsight === insight ? 'selected' : ''}`}
            onClick={() => onInsightClick(insight)}
          >
            <div className="insight-icon">{insight.icon}</div>
            <div className="insight-content">
              <h4>{insight.title}</h4>
              <p>{insight.description}</p>
              <div className="insight-meta">
                <span className="insight-badge">{insight.type}</span>
                <span className="insight-impact">{insight.impact}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsightPanel;

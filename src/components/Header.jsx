import React from 'react';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <div className="logo">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="18" stroke="white" strokeWidth="2"/>
              <path d="M20 8 L20 32 M8 20 L32 20" stroke="white" strokeWidth="2"/>
              <circle cx="20" cy="12" r="2" fill="white"/>
              <circle cx="20" cy="28" r="2" fill="white"/>
              <circle cx="12" cy="20" r="2" fill="white"/>
              <circle cx="28" cy="20" r="2" fill="white"/>
            </svg>
          </div>
          <div className="header-text">
            <h1>Global Health Data Explorer</h1>
            <p>Interactive visualization of health indicators worldwide</p>
          </div>
        </div>
        <div className="header-right">
          <button className="help-button" title="Help & Documentation">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

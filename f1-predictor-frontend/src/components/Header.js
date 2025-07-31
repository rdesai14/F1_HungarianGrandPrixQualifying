import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo-section">
            <div className="f1-logo">
              <span className="f1-text">F1</span>
              <span className="predictor-text">LAP PREDICTOR</span>
            </div>
            <p className="tagline">AI-Powered Qualifying Predictions</p>
          </div>
          
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-value">2025</span>
              <span className="stat-label">Season</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">24</span>
              <span className="stat-label">Races</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">94%</span>
              <span className="stat-label">Accuracy</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-container fade-in">
      <div className="loading-content">
        <div className="f1-car-loader">
          <div className="car-body"></div>
          <div className="car-wheels">
            <div className="wheel wheel-front"></div>
            <div className="wheel wheel-rear"></div>
          </div>
          <div className="track-line"></div>
        </div>
        
        <h3>Analyzing Race Data</h3>
        <div className="loading-steps">
          <div className="step active">
            <span className="step-icon">📊</span>
            <span className="step-text">Fetching qualifying data...</span>
          </div>
          <div className="step">
            <span className="step-icon">🤖</span>
            <span className="step-text">Running ML predictions...</span>
          </div>
          <div className="step">
            <span className="step-icon">🏁</span>
            <span className="step-text">Generating results...</span>
          </div>
        </div>
        
        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;

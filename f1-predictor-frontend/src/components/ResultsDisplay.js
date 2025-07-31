import React from 'react';
import './ResultsDisplay.css';

const ResultsDisplay = ({ predictions, metrics }) => {
  return (
    <div className="results-container">
      <h3>Qualifying Predictions</h3>
      <div className="metrics">
        <p>Mean Absolute Error: {metrics.meanAbsoluteError.toFixed(2)} seconds</p>
        <p>R² Score: {metrics.r2Score.toFixed(2)}</p>
        <p>Data Points Used: {metrics.dataPointsUsed}</p>
      </div>
      <table className="results-table">
        <thead>
          <tr>
            <th>Position</th>
            <th>Driver</th>
            <th>Team</th>
            <th>Predicted Time</th>
            <th>Actual Time</th>
            <th>Difference</th>
          </tr>
        </thead>
        <tbody>
          {predictions.map((prediction, index) => (
            <tr key={index}>
              <td>{prediction.position}</td>
              <td>{prediction.driver}</td>
              <td>{prediction.team}</td>
              <td>{prediction.predictedTime}</td>
              <td>{prediction.actualTime}</td>
              <td>{prediction.difference.toFixed(3)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsDisplay;


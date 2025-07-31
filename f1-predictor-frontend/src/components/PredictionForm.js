import React, { useState } from 'react';
import './PredictionForm.css';

const PredictionForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    year: 2025,
    round: 13, // Hungarian GP
    sessionType: 'qualifying'
  });

  const races2025 = [
    { round: 1, name: 'Australian Grand Prix', location: 'Melbourne' },
    { round: 2, name: 'Chinese Grand Prix', location: 'Shanghai' },
    { round: 3, name: 'Japanese Grand Prix', location: 'Suzuka' },
    { round: 4, name: 'Bahrain Grand Prix', location: 'Sakhir' },
    { round: 5, name: 'Saudi Arabian Grand Prix', location: 'Jeddah' },
    { round: 6, name: 'Miami Grand Prix', location: 'Miami' },
    { round: 7, name: 'Emilia Romagna Grand Prix', location: 'Imola' },
    { round: 8, name: 'Monaco Grand Prix', location: 'Monaco' },
    { round: 9, name: 'Canadian Grand Prix', location: 'Montreal' },
    { round: 10, name: 'Spanish Grand Prix', location: 'Barcelona' },
    { round: 11, name: 'Austrian Grand Prix', location: 'Spielberg' },
    { round: 12, name: 'British Grand Prix', location: 'Silverstone' },
    { round: 13, name: 'Hungarian Grand Prix', location: 'Budapest' },
    { round: 14, name: 'Belgian Grand Prix', location: 'Spa-Francorchamps' },
    { round: 15, name: 'Dutch Grand Prix', location: 'Zandvoort' },
    { round: 16, name: 'Italian Grand Prix', location: 'Monza' },
    { round: 17, name: 'Azerbaijan Grand Prix', location: 'Baku' },
    { round: 18, name: 'Singapore Grand Prix', location: 'Marina Bay' },
    { round: 19, name: 'United States Grand Prix', location: 'Austin' },
    { round: 20, name: 'Mexico City Grand Prix', location: 'Mexico City' },
    { round: 21, name: 'São Paulo Grand Prix', location: 'São Paulo' },
    { round: 22, name: 'Las Vegas Grand Prix', location: 'Las Vegas' },
    { round: 23, name: 'Qatar Grand Prix', location: 'Lusail' },
    { round: 24, name: 'Abu Dhabi Grand Prix', location: 'Yas Marina' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' || name === 'round' ? parseInt(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const selectedRace = races2025.find(race => race.round === formData.round);

  return (
    <div className="prediction-form-container fade-in">
      <div className="form-header">
        <h2>F1 Qualifying Prediction</h2>
        <p>Generate AI-powered lap time predictions for Formula 1 qualifying sessions</p>
      </div>

      <form onSubmit={handleSubmit} className="prediction-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="year">
              Season
              <span className="form-icon">🏁</span>
            </label>
            <select
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              disabled={loading}
            >
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="round">
              Grand Prix
              <span className="form-icon">🏆</span>
            </label>
            <select
              id="round"
              name="round"
              value={formData.round}
              onChange={handleChange}
              disabled={loading}
            >
              {races2025.map(race => (
                <option key={race.round} value={race.round}>
                  Round {race.round}: {race.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="sessionType">
              Session Type
              <span className="form-icon">⏱️</span>
            </label>
            <select
              id="sessionType"
              name="sessionType"
              value={formData.sessionType}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="qualifying">Qualifying</option>
            </select>
          </div>
        </div>

        {selectedRace && (
          <div className="race-info">
            <div className="race-card">
              <h3>{selectedRace.name}</h3>
              <p className="race-location">{selectedRace.location}</p>
              <div className="race-details">
                <span className="race-round">Round {selectedRace.round}</span>
                <span className="race-year">{formData.year}</span>
              </div>
            </div>
          </div>
        )}

        <button 
          type="submit" 
          className={`submit-btn ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Generating Predictions...
            </>
          ) : (
            <>
              <span className="btn-icon">🚀</span>
              Generate Predictions
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default PredictionForm;

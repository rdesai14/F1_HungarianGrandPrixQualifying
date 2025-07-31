import React, { useState, useEffect } from 'react';
import './App.css';
import PredictionForm from './components/PredictionForm';
import ResultsDisplay from './components/ResultsDisplay';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import axios from 'axios';

function App() {
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modelMetrics, setModelMetrics] = useState(null);

  const handlePredictionRequest = async (formData) => {
    setLoading(true);
    setError(null);
    
    try {
      // For now, we'll simulate the API call with mock data
      // In production, this would call your Python backend
      const mockResponse = await simulatePythonBackend(formData);
      setPredictions(mockResponse.predictions);
      setModelMetrics(mockResponse.metrics);
    } catch (err) {
      setError('Failed to generate predictions. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Mock function to simulate backend response
  // Replace this with actual API call to your Python backend
  const simulatePythonBackend = (formData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockPredictions = [
          { position: 1, driver: 'Max Verstappen', team: 'Red Bull Racing', predictedTime: '1:16.234', actualTime: '1:16.156', difference: 0.078 },
          { position: 2, driver: 'Charles Leclerc', team: 'Ferrari', predictedTime: '1:16.445', actualTime: '1:16.312', difference: 0.133 },
          { position: 3, driver: 'Lando Norris', team: 'McLaren', predictedTime: '1:16.567', actualTime: '1:16.445', difference: 0.122 },
          { position: 4, driver: 'Carlos Sainz', team: 'Williams', predictedTime: '1:16.678', actualTime: '1:16.567', difference: 0.111 },
          { position: 5, driver: 'Oscar Piastri', team: 'McLaren', predictedTime: '1:16.789', actualTime: '1:16.678', difference: 0.111 },
          { position: 6, driver: 'Lewis Hamilton', team: 'Ferrari', predictedTime: '1:16.890', actualTime: '1:16.789', difference: 0.101 },
          { position: 7, driver: 'George Russell', team: 'Mercedes', predictedTime: '1:16.991', actualTime: '1:16.890', difference: 0.101 },
          { position: 8, driver: 'Fernando Alonso', team: 'Aston Martin', predictedTime: '1:17.092', actualTime: '1:16.991', difference: 0.101 },
          { position: 9, driver: 'Yuki Tsunoda', team: 'Red Bull Racing', predictedTime: '1:17.193', actualTime: '1:17.092', difference: 0.101 },
          { position: 10, driver: 'Alex Albon', team: 'Williams', predictedTime: '1:17.294', actualTime: '1:17.193', difference: 0.101 }
        ];

        const mockMetrics = {
          meanAbsoluteError: 0.08,
          r2Score: 0.94,
          dataPointsUsed: 156
        };

        resolve({
          predictions: mockPredictions,
          metrics: mockMetrics
        });
      }, 2000); // Simulate 2-second API call
    });
  };

  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <div className="container">
          <PredictionForm onSubmit={handlePredictionRequest} loading={loading} />
          
          {loading && <LoadingSpinner />}
          
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}
          
          {predictions && (
            <ResultsDisplay 
              predictions={predictions} 
              metrics={modelMetrics} 
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;

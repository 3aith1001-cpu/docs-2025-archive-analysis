import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './styles/App.css';

// Pages
import Dashboard from './pages/Dashboard';
import MarketOverview from './pages/MarketOverview';
import PricingAnalysis from './pages/PricingAnalysis';
import CompetitorAnalysis from './pages/CompetitorAnalysis';
import RegionalAnalysis from './pages/RegionalAnalysis';
import ServiceDemand from './pages/ServiceDemand';
import IndustryTrends from './pages/IndustryTrends';

// API Service
import api from './services/api';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    checkAPIStatus();
  }, []);

  const checkAPIStatus = async () => {
    try {
      const response = await api.get('/health');
      setApiStatus('connected');
      setIsLoading(false);
    } catch (error) {
      setApiStatus('disconnected');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading Market Analysis Dashboard...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <nav className="sidebar">
          <div className="sidebar-header">
            <h2>Market Analysis</h2>
            <div className={`status-indicator ${apiStatus}`}>
              <span className="status-dot"></span>
              <span className="status-text">{apiStatus === 'connected' ? 'Live' : 'Offline'}</span>
            </div>
          </div>

          <ul className="nav-links">
            <li>
              <Link to="/">
                <span className="icon">📊</span>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/market">
                <span className="icon">📈</span>
                Market Overview
              </Link>
            </li>
            <li>
              <Link to="/pricing">
                <span className="icon">💰</span>
                Pricing Analysis
              </Link>
            </li>
            <li>
              <Link to="/competitors">
                <span className="icon">🏢</span>
                Competitors
              </Link>
            </li>
            <li>
              <Link to="/regional">
                <span className="icon">🌍</span>
                Regional Data
              </Link>
            </li>
            <li>
              <Link to="/services">
                <span className="icon">🔧</span>
                Service Demand
              </Link>
            </li>
            <li>
              <Link to="/trends">
                <span className="icon">🚀</span>
                Industry Trends
              </Link>
            </li>
          </ul>

          <div className="sidebar-footer">
            <p>Property & Building Maintenance Market</p>
            <p className="version">v1.0.0</p>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/market" element={<MarketOverview />} />
            <Route path="/pricing" element={<PricingAnalysis />} />
            <Route path="/competitors" element={<CompetitorAnalysis />} />
            <Route path="/regional" element={<RegionalAnalysis />} />
            <Route path="/services" element={<ServiceDemand />} />
            <Route path="/trends" element={<IndustryTrends />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

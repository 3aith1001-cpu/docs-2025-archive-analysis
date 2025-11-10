import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Area } from 'recharts';
import { marketAPI } from '../services/api';
import '../styles/Page.css';

function MarketOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await marketAPI.getOverview();
      setData(response.data);
    } catch (error) {
      console.error('Error fetching market data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;

  const marketData = data?.market_data || [];
  const analysis = data?.statistical_analysis || {};

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Market Overview & Growth Analysis</h1>
      </header>

      <div className="stats-row">
        <div className="stat-box">
          <h3>CAGR</h3>
          <p className="stat-value">{analysis?.cagr_percent?.toFixed(2)}%</p>
          <span className="stat-label">Compound Annual Growth Rate</span>
        </div>
        <div className="stat-box">
          <h3>R² Score</h3>
          <p className="stat-value">{analysis?.linear_trend?.r_squared?.toFixed(4)}</p>
          <span className="stat-label">Linear Trend Fit</span>
        </div>
        <div className="stat-box">
          <h3>Trend Strength</h3>
          <p className="stat-value">{analysis?.growth_insights?.trend_strength}</p>
          <span className="stat-label">Statistical Assessment</span>
        </div>
        <div className="stat-box">
          <h3>Avg Growth</h3>
          <p className="stat-value">${analysis?.growth_insights?.avg_annual_growth_billions?.toFixed(2)}B</p>
          <span className="stat-label">Annual Average</span>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-container">
          <h2>Market Size Evolution & Segments</h2>
          <ResponsiveContainer width="100%" height={450}>
            <ComposedChart data={marketData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="year" stroke="#ccc" />
              <YAxis stroke="#ccc" label={{ value: 'Billions USD', angle: -90, position: 'insideLeft', fill: '#ccc' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                formatter={(value) => `$${value?.toFixed(2)}B`}
              />
              <Legend />
              <Area type="monotone" dataKey="segment_residential" stackId="1" stroke="#8884d8" fill="#8884d8" name="Residential" />
              <Area type="monotone" dataKey="segment_commercial" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Commercial" />
              <Area type="monotone" dataKey="segment_industrial" stackId="1" stroke="#ffc658" fill="#ffc658" name="Industrial" />
              <Line type="monotone" dataKey="market_size_billions" stroke="#ff7300" strokeWidth={3} name="Total Market" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="analysis-cards">
          <div className="analysis-card">
            <h3>Statistical Analysis</h3>
            <div className="analysis-content">
              <div className="analysis-item">
                <label>Linear Trend Slope:</label>
                <span>{analysis?.linear_trend?.slope?.toFixed(4)}</span>
              </div>
              <div className="analysis-item">
                <label>Standard Error:</label>
                <span>{analysis?.linear_trend?.std_error?.toFixed(3)}</span>
              </div>
              <div className="analysis-item">
                <label>Polynomial R²:</label>
                <span>{analysis?.polynomial_trend?.r_squared?.toFixed(4)}</span>
              </div>
              <div className="analysis-item">
                <label>Volatility (σ):</label>
                <span>${analysis?.growth_insights?.volatility?.toFixed(2)}B</span>
              </div>
            </div>
          </div>

          <div className="analysis-card">
            <h3>Market Insights</h3>
            <ul className="insights-list">
              <li>✓ Consistent upward trajectory with {analysis?.cagr_percent?.toFixed(1)}% CAGR</li>
              <li>✓ {analysis?.growth_insights?.trend_strength} statistical correlation (R² = {analysis?.linear_trend?.r_squared?.toFixed(3)})</li>
              <li>✓ Residential segment dominates with ~62% market share</li>
              <li>✓ Average annual growth of ${analysis?.growth_insights?.avg_annual_growth_billions?.toFixed(1)}B</li>
              <li>✓ Low volatility indicates stable market conditions</li>
            </ul>
          </div>
        </div>

        <div className="chart-container">
          <h2>Segment Distribution Over Time</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={marketData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="year" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                formatter={(value) => `$${value?.toFixed(2)}B`}
              />
              <Legend />
              <Bar dataKey="segment_residential" fill="#8884d8" name="Residential" />
              <Bar dataKey="segment_commercial" fill="#82ca9d" name="Commercial" />
              <Bar dataKey="segment_industrial" fill="#ffc658" name="Industrial" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default MarketOverview;

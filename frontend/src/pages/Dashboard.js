import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { dashboardAPI } from '../services/api';
import '../styles/Dashboard.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getSummary();
      setData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-spinner">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  const keyMetrics = data?.key_metrics || {};
  const forecasts = data?.forecasts || {};
  const marketStructure = data?.market_structure || {};
  const topCompetitors = data?.top_competitors || [];

  // Prepare forecast chart data
  const forecastChartData = forecasts.forecast_years?.map((year, index) => ({
    year,
    ensemble: forecasts.forecasts?.ensemble[index],
    linear: forecasts.forecasts?.linear[index],
    exponential: forecasts.forecasts?.exponential[index],
    lower95: forecasts.confidence_intervals?.[index]?.lower_95,
    upper95: forecasts.confidence_intervals?.[index]?.upper_95,
  })) || [];

  // Prepare competitor pie chart
  const competitorPieData = topCompetitors.slice(0, 5).map(comp => ({
    name: comp.name,
    value: comp.market_share
  }));

  return (
    <div className="page-container dashboard">
      <header className="page-header">
        <h1>Property Maintenance Market Dashboard</h1>
        <button onClick={fetchData} className="refresh-btn">
          🔄 Refresh Data
        </button>
      </header>

      {/* Key Metrics Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">💼</div>
          <div className="metric-content">
            <h3>Current Market Size</h3>
            <p className="metric-value">${keyMetrics.current_market_size_billions?.toFixed(2)}B</p>
            <span className="metric-label">USD Billions</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📈</div>
          <div className="metric-content">
            <h3>CAGR</h3>
            <p className="metric-value">{keyMetrics.cagr_percent?.toFixed(2)}%</p>
            <span className="metric-label">Compound Annual Growth Rate</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🌍</div>
          <div className="metric-content">
            <h3>Global Market</h3>
            <p className="metric-value">${keyMetrics.total_global_market?.toFixed(2)}B</p>
            <span className="metric-label">Total Market Value</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⚡</div>
          <div className="metric-content">
            <h3>Growth Rate</h3>
            <p className="metric-value">{keyMetrics.weighted_growth_rate?.toFixed(2)}%</p>
            <span className="metric-label">Weighted Average</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Market Forecast Chart */}
        <div className="chart-card full-width">
          <h2>Market Size Forecast (Next 5 Years)</h2>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={forecastChartData}>
              <defs>
                <linearGradient id="colorEnsemble" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="year" stroke="#ccc" />
              <YAxis stroke="#ccc" label={{ value: 'Billions USD', angle: -90, position: 'insideLeft', fill: '#ccc' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                formatter={(value) => `$${value?.toFixed(2)}B`}
              />
              <Legend />
              <Area type="monotone" dataKey="upper95" fill="url(#colorConfidence)" stroke="none" />
              <Area type="monotone" dataKey="lower95" fill="url(#colorConfidence)" stroke="none" />
              <Area type="monotone" dataKey="ensemble" stroke="#8884d8" fillOpacity={1} fill="url(#colorEnsemble)" />
              <Line type="monotone" dataKey="linear" stroke="#82ca9d" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="exponential" stroke="#ffc658" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="chart-footnote">
            <p>Ensemble forecast combines Linear Regression, Exponential Smoothing, and Moving Average models</p>
            <p>Shaded area represents 95% confidence interval</p>
          </div>
        </div>

        {/* Market Structure */}
        <div className="chart-card">
          <h2>Market Concentration</h2>
          <div className="market-structure-info">
            <div className="structure-metric">
              <label>HHI Index</label>
              <span className="structure-value">{marketStructure.hhi_index?.toFixed(0)}</span>
            </div>
            <div className="structure-metric">
              <label>Concentration Level</label>
              <span className="structure-value">{marketStructure.market_concentration}</span>
            </div>
            <div className="structure-metric">
              <label>Top 4 Share (CR4)</label>
              <span className="structure-value">{marketStructure.cr4_ratio?.toFixed(1)}%</span>
            </div>
            <div className="structure-metric">
              <label>Total Players</label>
              <span className="structure-value">{marketStructure.number_of_players}</span>
            </div>
          </div>
          <div className="info-box">
            <h4>Market Structure Analysis</h4>
            <p>The Herfindahl-Hirschman Index (HHI) measures market concentration. Values above 2500 indicate high concentration.</p>
            <p className="highlight">Current Status: {marketStructure.market_concentration}</p>
          </div>
        </div>

        {/* Top Competitors Pie Chart */}
        <div className="chart-card">
          <h2>Top 5 Competitors by Market Share</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={competitorPieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {competitorPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Competitors Table */}
        <div className="chart-card full-width">
          <h2>Market Leaders</h2>
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Company</th>
                  <th>Market Share</th>
                  <th>Revenue (M)</th>
                  <th>Growth YoY</th>
                  <th>Employees</th>
                  <th>Satisfaction</th>
                </tr>
              </thead>
              <tbody>
                {topCompetitors.slice(0, 10).map((comp, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td className="company-name">{comp.name}</td>
                    <td>
                      <div className="progress-cell">
                        <div className="progress-bar" style={{ width: `${comp.market_share * 5}%` }}></div>
                        <span>{comp.market_share?.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td>${comp.revenue_millions?.toLocaleString()}M</td>
                    <td className={comp.growth_rate_yoy > 5 ? 'positive' : ''}>
                      {comp.growth_rate_yoy?.toFixed(1)}%
                    </td>
                    <td>{comp.employee_count?.toLocaleString()}</td>
                    <td>
                      <span className="rating">{comp.customer_satisfaction?.toFixed(1)}/10</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="dashboard-footer">
        <div className="footer-stat">
          <span className="stat-label">Data Source:</span>
          <span className="stat-value">Market Research & Statistical Analysis</span>
        </div>
        <div className="footer-stat">
          <span className="stat-label">Last Updated:</span>
          <span className="stat-value">{new Date().toLocaleString()}</span>
        </div>
        <div className="footer-stat">
          <span className="stat-label">Analysis Methods:</span>
          <span className="stat-value">Regression, Forecasting, Statistical Testing</span>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

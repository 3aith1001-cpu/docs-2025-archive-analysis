import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { serviceAPI } from '../services/api';
import '../styles/Page.css';

const SERVICE_COLORS = {
  'Preventive Maintenance': '#8884d8',
  'Emergency Repairs': '#ff8042',
  'Inspections': '#00C49F',
  'Cleaning Services': '#FFBB28',
  'Energy Management': '#82ca9d',
  'Compliance Audits': '#8dd1e1'
};

function ServiceDemand() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await serviceAPI.getServices();
      setData(response.data);
    } catch (error) {
      console.error('Error fetching service demand data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;

  const serviceData = data?.service_data || [];
  const forecasts = data?.forecasts || {};

  // Group data by date for multi-line chart
  const groupedByDate = serviceData.reduce((acc, item) => {
    if (!acc[item.date]) {
      acc[item.date] = { date: item.date };
    }
    acc[item.date][item.service_type] = item.demand_score;
    return acc;
  }, {});

  const timeSeriesData = Object.values(groupedByDate);

  // Filter data if a service is selected
  const filteredData = selectedService === 'all'
    ? serviceData
    : serviceData.filter(item => item.service_type === selectedService);

  // Get unique service types
  const serviceTypes = [...new Set(serviceData.map(item => item.service_type))];

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Service Demand Analysis & Forecasting</h1>
        <div className="service-selector">
          <label>Filter Service:</label>
          <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
            <option value="all">All Services</option>
            {serviceTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </header>

      <div className="stats-row">
        <div className="stat-box">
          <h3>Avg Demand Score</h3>
          <p className="stat-value">{forecasts?.overall_statistics?.total_demand_score?.toFixed(1)}</p>
          <span className="stat-label">Across All Services</span>
        </div>
        <div className="stat-box">
          <h3>Highest Demand</h3>
          <p className="stat-value">{forecasts?.overall_statistics?.highest_demand_service}</p>
          <span className="stat-label">Top Service</span>
        </div>
        <div className="stat-box">
          <h3>Fastest Growing</h3>
          <p className="stat-value">{forecasts?.overall_statistics?.fastest_growing_service}</p>
          <span className="stat-label">By Trend Magnitude</span>
        </div>
        <div className="stat-box">
          <h3>Last Updated</h3>
          <p className="stat-value">{forecasts?.last_updated}</p>
          <span className="stat-label">Data Freshness</span>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-container full-width">
          <h2>Demand Trends Over Time (All Services)</h2>
          <ResponsiveContainer width="100%" height={450}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#ccc" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#ccc" label={{ value: 'Demand Score', angle: -90, position: 'insideLeft', fill: '#ccc' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                formatter={(value) => value?.toFixed(1)}
              />
              <Legend />
              {serviceTypes.map(type => (
                <Line
                  key={type}
                  type="monotone"
                  dataKey={type}
                  stroke={SERVICE_COLORS[type] || '#8884d8'}
                  strokeWidth={2}
                  dot={false}
                  name={type}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="service-forecast-grid">
          {forecasts?.service_forecasts && Object.entries(forecasts.service_forecasts).map(([service, forecast]) => (
            <div key={service} className="forecast-card">
              <h3>{service}</h3>
              <div className="forecast-metrics">
                <div className="forecast-metric">
                  <label>Current Demand</label>
                  <span className="metric-value">{forecast.current_demand?.toFixed(1)}</span>
                </div>
                <div className="forecast-metric">
                  <label>Trend</label>
                  <span className={`trend-indicator ${forecast.trend?.toLowerCase()}`}>
                    {forecast.trend}
                  </span>
                </div>
                <div className="forecast-metric">
                  <label>Avg Ticket Value</label>
                  <span className="metric-value">${forecast.avg_ticket_value?.toFixed(0)}</span>
                </div>
                <div className="forecast-metric">
                  <label>YTD Volume</label>
                  <span className="metric-value">{forecast.total_volume_ytd?.toLocaleString()}</span>
                </div>
              </div>
              <div className="mini-forecast-chart">
                <h4>6-Month Forecast</h4>
                <ResponsiveContainer width="100%" height={120}>
                  <AreaChart data={forecast.forecast_6m?.map((val, idx) => ({ month: idx + 1, value: val }))}>
                    <defs>
                      <linearGradient id={`gradient-${service}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={SERVICE_COLORS[service] || '#8884d8'} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={SERVICE_COLORS[service] || '#8884d8'} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" hide />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', fontSize: '12px' }}
                      formatter={(value) => [`${value.toFixed(1)}`, 'Demand']}
                      labelFormatter={(label) => `Month ${label}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={SERVICE_COLORS[service] || '#8884d8'}
                      fill={`url(#gradient-${service})`}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>

        {selectedService !== 'all' && (
          <div className="chart-container">
            <h2>{selectedService} - Detailed View</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#ccc" angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#ccc" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                  formatter={(value, name) => {
                    if (name === 'Demand Score') return value?.toFixed(1);
                    if (name === 'Ticket Value') return `$${value?.toFixed(0)}`;
                    return value;
                  }}
                />
                <Legend />
                <Bar dataKey="demand_score" fill="#8884d8" name="Demand Score" />
                <Bar dataKey="volume" fill="#82ca9d" name="Volume" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="data-table-container">
          <h2>Service Demand Summary</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Service Type</th>
                <th>Current Demand</th>
                <th>Trend</th>
                <th>Trend Magnitude</th>
                <th>Avg Ticket Value</th>
                <th>YTD Volume</th>
                <th>6M Forecast</th>
              </tr>
            </thead>
            <tbody>
              {forecasts?.service_forecasts && Object.entries(forecasts.service_forecasts).map(([service, forecast]) => (
                <tr key={service}>
                  <td className="service-name">{service}</td>
                  <td>
                    <div className="demand-indicator">
                      <div
                        className="demand-bar"
                        style={{ width: `${forecast.current_demand}%`, backgroundColor: SERVICE_COLORS[service] }}
                      ></div>
                      <span>{forecast.current_demand?.toFixed(1)}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`trend-badge ${forecast.trend?.toLowerCase()}`}>
                      {forecast.trend}
                    </span>
                  </td>
                  <td>{forecast.trend_magnitude?.toFixed(2)}</td>
                  <td>${forecast.avg_ticket_value?.toFixed(0)}</td>
                  <td>{forecast.total_volume_ytd?.toLocaleString()}</td>
                  <td className="forecast-preview">
                    {forecast.forecast_6m?.slice(0, 3).map((val, idx) => (
                      <span key={idx}>{val.toFixed(0)}</span>
                    ))}
                    <span>...</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ServiceDemand;

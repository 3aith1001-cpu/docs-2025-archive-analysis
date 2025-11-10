import React, { useState, useEffect } from 'react';
import { BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { pricingAPI } from '../services/api';
import '../styles/Page.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

function PricingAnalysis() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await pricingAPI.getPricing();
      setData(response.data);
    } catch (error) {
      console.error('Error fetching pricing data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;

  const pricingData = data?.pricing_data || [];
  const analysis = data?.statistical_analysis || {};

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Pricing Analysis & Market Rates</h1>
      </header>

      <div className="stats-row">
        <div className="stat-box">
          <h3>Mean Hourly Rate</h3>
          <p className="stat-value">${analysis?.descriptive_stats?.mean_hourly_rate?.toFixed(2)}</p>
          <span className="stat-label">Industry Average</span>
        </div>
        <div className="stat-box">
          <h3>Median Rate</h3>
          <p className="stat-value">${analysis?.descriptive_stats?.median_hourly_rate?.toFixed(2)}</p>
          <span className="stat-label">50th Percentile</span>
        </div>
        <div className="stat-box">
          <h3>Price Variability</h3>
          <p className="stat-value">{analysis?.insights?.price_variability}</p>
          <span className="stat-label">CV: {analysis?.descriptive_stats?.coefficient_of_variation?.toFixed(2)}</span>
        </div>
        <div className="stat-box">
          <h3>Price-Demand Correlation</h3>
          <p className="stat-value">{analysis?.correlation_with_demand?.toFixed(3)}</p>
          <span className="stat-label">{analysis?.insights?.demand_price_relationship}</span>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-container">
          <h2>Service Pricing Overview</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={pricingData} layout="vertical" margin={{ left: 150 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis type="number" stroke="#ccc" label={{ value: 'USD per Hour', position: 'bottom', fill: '#ccc' }} />
              <YAxis type="category" dataKey="service" stroke="#ccc" width={140} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                formatter={(value) => `$${value?.toFixed(2)}`}
              />
              <Legend />
              <Bar dataKey="min_rate" fill="#82ca9d" name="Min Rate" />
              <Bar dataKey="avg_hourly_rate" fill="#8884d8" name="Avg Rate" />
              <Bar dataKey="max_rate" fill="#ffc658" name="Max Rate" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h2>Price vs. Market Demand</h2>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis
                type="number"
                dataKey="avg_hourly_rate"
                name="Hourly Rate"
                stroke="#ccc"
                label={{ value: 'Avg Hourly Rate ($)', position: 'bottom', fill: '#ccc' }}
              />
              <YAxis
                type="number"
                dataKey="market_demand_score"
                name="Demand Score"
                stroke="#ccc"
                label={{ value: 'Market Demand Score', angle: -90, position: 'insideLeft', fill: '#ccc' }}
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                formatter={(value, name) => {
                  if (name === 'Hourly Rate') return `$${value?.toFixed(2)}`;
                  return value?.toFixed(1);
                }}
              />
              <Scatter name="Services" data={pricingData} fill="#8884d8">
                {pricingData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          <div className="chart-footnote">
            <p>Correlation coefficient: {analysis?.correlation_with_demand?.toFixed(3)} ({analysis?.insights?.demand_price_relationship} relationship)</p>
          </div>
        </div>

        <div className="data-table-container">
          <h2>Detailed Pricing Table</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Hourly Rate</th>
                <th>Min - Max</th>
                <th>Monthly Contract</th>
                <th>Demand Score</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {pricingData.map((service, index) => (
                <tr key={index}>
                  <td className="service-name">{service.service}</td>
                  <td className="price-value">${service.avg_hourly_rate?.toFixed(2)}</td>
                  <td className="price-range">${service.min_rate?.toFixed(2)} - ${service.max_rate?.toFixed(2)}</td>
                  <td className="monthly-value">${service.avg_contract_monthly?.toLocaleString()}</td>
                  <td>
                    <div className="demand-indicator">
                      <div className="demand-bar" style={{ width: `${service.market_demand_score * 10}%` }}></div>
                      <span>{service.market_demand_score?.toFixed(1)}/10</span>
                    </div>
                  </td>
                  <td>
                    <span className={`trend-badge ${service.price_trend?.toLowerCase()}`}>
                      {service.price_trend}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="analysis-cards">
          <div className="analysis-card">
            <h3>Statistical Summary</h3>
            <div className="analysis-content">
              <div className="analysis-item">
                <label>Standard Deviation:</label>
                <span>${analysis?.descriptive_stats?.std_dev?.toFixed(2)}</span>
              </div>
              <div className="analysis-item">
                <label>Price Range:</label>
                <span>${analysis?.descriptive_stats?.price_range?.min?.toFixed(2)} - ${analysis?.descriptive_stats?.price_range?.max?.toFixed(2)}</span>
              </div>
              <div className="analysis-item">
                <label>Interquartile Range:</label>
                <span>${analysis?.descriptive_stats?.price_range?.iqr?.toFixed(2)}</span>
              </div>
              <div className="analysis-item">
                <label>Coefficient of Variation:</label>
                <span>{(analysis?.descriptive_stats?.coefficient_of_variation * 100)?.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <div className="analysis-card">
            <h3>Top Value Services</h3>
            <div className="top-services-list">
              {analysis?.top_value_services?.slice(0, 5).map((service, index) => (
                <div key={index} className="top-service-item">
                  <span className="rank">#{index + 1}</span>
                  <div className="service-info">
                    <strong>{service.service}</strong>
                    <span className="service-details">
                      ${service.avg_hourly_rate?.toFixed(2)}/hr | Demand: {service.market_demand_score?.toFixed(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PricingAnalysis;

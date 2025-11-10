import React, { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { competitorAPI } from '../services/api';
import '../styles/Page.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0'];

function CompetitorAnalysis() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await competitorAPI.getCompetitors();
      setData(response.data);
    } catch (error) {
      console.error('Error fetching competitor data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;

  const competitors = data?.competitors || [];
  const analysis = data?.analysis || {};
  const marketStructure = analysis?.market_structure || {};

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Competitive Landscape Analysis</h1>
      </header>

      <div className="stats-row">
        <div className="stat-box">
          <h3>HHI Index</h3>
          <p className="stat-value">{marketStructure?.hhi_index?.toFixed(0)}</p>
          <span className="stat-label">{marketStructure?.market_concentration}</span>
        </div>
        <div className="stat-box">
          <h3>Top 4 Share</h3>
          <p className="stat-value">{marketStructure?.cr4_ratio?.toFixed(1)}%</p>
          <span className="stat-label">CR4 Concentration Ratio</span>
        </div>
        <div className="stat-box">
          <h3>Market Players</h3>
          <p className="stat-value">{marketStructure?.number_of_players}</p>
          <span className="stat-label">Active Competitors</span>
        </div>
        <div className="stat-box">
          <h3>Avg Revenue/Employee</h3>
          <p className="stat-value">${(analysis?.efficiency_metrics?.avg_revenue_per_employee / 1000)?.toFixed(0)}K</p>
          <span className="stat-label">Efficiency Metric</span>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-container half-width">
          <h2>Market Share Distribution</h2>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={competitors}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, market_share }) => `${name}: ${market_share.toFixed(1)}%`}
                outerRadius={130}
                fill="#8884d8"
                dataKey="market_share"
              >
                {competitors.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container half-width">
          <h2>Revenue vs. Growth Rate</h2>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis
                type="number"
                dataKey="revenue_millions"
                name="Revenue"
                stroke="#ccc"
                label={{ value: 'Revenue (Millions $)', position: 'bottom', offset: 40, fill: '#ccc' }}
              />
              <YAxis
                type="number"
                dataKey="growth_rate_yoy"
                name="Growth"
                stroke="#ccc"
                label={{ value: 'Growth Rate YoY (%)', angle: -90, position: 'insideLeft', fill: '#ccc' }}
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                formatter={(value, name) => {
                  if (name === 'Revenue') return `$${value.toFixed(0)}M`;
                  if (name === 'Growth') return `${value.toFixed(1)}%`;
                  return value;
                }}
                labelFormatter={(value) => competitors[value]?.name || ''}
              />
              <Scatter name="Competitors" data={competitors} fill="#8884d8">
                {competitors.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          <div className="chart-footnote">
            <p>Correlation: {analysis?.correlations?.size_growth?.toFixed(3)}</p>
          </div>
        </div>

        <div className="chart-container">
          <h2>Fastest Growing Companies</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={analysis?.fastest_growing || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" label={{ value: 'Growth Rate YoY (%)', angle: -90, position: 'insideLeft', fill: '#ccc' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                formatter={(value) => `${value.toFixed(1)}%`}
              />
              <Legend />
              <Bar dataKey="growth_rate_yoy" fill="#82ca9d" name="YoY Growth %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="data-table-container">
          <h2>Detailed Competitor Comparison</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Company</th>
                <th>Market Share</th>
                <th>Revenue</th>
                <th>Growth YoY</th>
                <th>Employees</th>
                <th>Revenue/Employee</th>
                <th>Satisfaction</th>
                <th>Digital Score</th>
              </tr>
            </thead>
            <tbody>
              {competitors.map((comp, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td className="company-name">{comp.name}</td>
                  <td>
                    <div className="progress-cell">
                      <div className="progress-bar" style={{ width: `${comp.market_share * 5}%`, backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <span>{comp.market_share?.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td>${comp.revenue_millions?.toLocaleString()}M</td>
                  <td className={comp.growth_rate_yoy > 8 ? 'positive' : comp.growth_rate_yoy < 5 ? 'negative' : ''}>
                    {comp.growth_rate_yoy?.toFixed(1)}%
                  </td>
                  <td>{comp.employee_count?.toLocaleString()}</td>
                  <td>${((comp.revenue_millions * 1000000) / comp.employee_count).toFixed(0)}</td>
                  <td>
                    <span className="rating">{comp.customer_satisfaction?.toFixed(1)}/10</span>
                  </td>
                  <td>
                    <span className="rating">{comp.digital_adoption_score?.toFixed(1)}/10</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="analysis-cards">
          <div className="analysis-card">
            <h3>Market Structure Analysis</h3>
            <div className="analysis-content">
              <p className="info-text">
                <strong>Herfindahl-Hirschman Index (HHI):</strong> {marketStructure?.hhi_index?.toFixed(0)}
              </p>
              <p className="info-text">
                The market is classified as <strong>{marketStructure?.market_concentration}</strong>.
                {marketStructure?.hhi_index > 2500 && ' High concentration suggests limited competition and potential market power.'}
                {marketStructure?.hhi_index <= 2500 && marketStructure?.hhi_index > 1500 && ' Moderate concentration indicates a balanced competitive environment.'}
                {marketStructure?.hhi_index <= 1500 && ' Low concentration indicates a highly competitive market.'}
              </p>
              <p className="info-text">
                Top 4 firms control <strong>{marketStructure?.cr4_ratio?.toFixed(1)}%</strong> of the market.
              </p>
            </div>
          </div>

          <div className="analysis-card">
            <h3>Key Correlations</h3>
            <div className="analysis-content">
              <div className="analysis-item">
                <label>Size vs. Growth:</label>
                <span className={analysis?.correlations?.size_growth > 0 ? 'positive' : 'negative'}>
                  {analysis?.correlations?.size_growth?.toFixed(3)}
                </span>
              </div>
              <div className="analysis-item">
                <label>Digital vs. Satisfaction:</label>
                <span className={analysis?.correlations?.digital_satisfaction > 0 ? 'positive' : 'negative'}>
                  {analysis?.correlations?.digital_satisfaction?.toFixed(3)}
                </span>
              </div>
              <div className="analysis-item">
                <label>Size vs. Efficiency:</label>
                <span className={analysis?.correlations?.size_efficiency > 0 ? 'positive' : 'negative'}>
                  {analysis?.correlations?.size_efficiency?.toFixed(3)}
                </span>
              </div>
            </div>
            <p className="info-text small">
              Correlation values range from -1 to 1. Positive values indicate direct relationships.
            </p>
          </div>

          <div className="analysis-card">
            <h3>Efficiency Leader</h3>
            <div className="leader-card">
              <h4>{analysis?.efficiency_metrics?.top_performer?.name}</h4>
              <p className="leader-metric">
                ${(analysis?.efficiency_metrics?.top_performer?.revenue_per_employee / 1000).toFixed(0)}K
              </p>
              <p className="leader-label">Revenue per Employee</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompetitorAnalysis;

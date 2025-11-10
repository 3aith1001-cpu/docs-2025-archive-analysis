import React, { useState, useEffect } from 'react';
import { BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { regionalAPI } from '../services/api';
import '../styles/Page.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

function RegionalAnalysis() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await regionalAPI.getRegional();
      setData(response.data);
    } catch (error) {
      console.error('Error fetching regional data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;

  const regionalData = data?.regional_data || [];
  const analysis = data?.analysis || {};

  // Prepare radar chart data
  const radarData = regionalData.map(region => ({
    region: region.region,
    'Growth Rate': region.growth_rate,
    'Digital Maturity': region.digital_maturity,
    'Market Size': (region.market_size_billions / 20), // Normalized
  }));

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Regional Market Analysis</h1>
      </header>

      <div className="stats-row">
        <div className="stat-box">
          <h3>Total Market</h3>
          <p className="stat-value">${analysis?.total_market_size?.toFixed(2)}B</p>
          <span className="stat-label">Global Market Size</span>
        </div>
        <div className="stat-box">
          <h3>Weighted Growth</h3>
          <p className="stat-value">{analysis?.weighted_avg_growth?.toFixed(2)}%</p>
          <span className="stat-label">Market-Cap Weighted</span>
        </div>
        <div className="stat-box">
          <h3>Largest Market</h3>
          <p className="stat-value">{analysis?.insights?.largest_market}</p>
          <span className="stat-label">By Market Size</span>
        </div>
        <div className="stat-box">
          <h3>Highest Growth</h3>
          <p className="stat-value">{analysis?.insights?.highest_growth_region}</p>
          <span className="stat-label">By Growth Rate</span>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-container">
          <h2>Market Size by Region</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={regionalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="region" stroke="#ccc" angle={-15} textAnchor="end" height={100} />
              <YAxis stroke="#ccc" label={{ value: 'Market Size (Billions $)', angle: -90, position: 'insideLeft', fill: '#ccc' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                formatter={(value) => `$${value.toFixed(2)}B`}
              />
              <Legend />
              <Bar dataKey="market_size_billions" fill="#8884d8" name="Market Size">
                {regionalData.map((entry, index) => (
                  <Bar key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h2>Growth Rate by Region</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={regionalData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="region" stroke="#ccc" angle={-15} textAnchor="end" height={100} />
              <YAxis stroke="#ccc" label={{ value: 'Growth Rate (%)', angle: -90, position: 'insideLeft', fill: '#ccc' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                formatter={(value) => `${value.toFixed(1)}%`}
              />
              <Legend />
              <Bar dataKey="growth_rate" fill="#82ca9d" name="Growth Rate %">
                {regionalData.map((entry, index) => (
                  <Bar key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h2>Regional Comparison Radar</h2>
          <ResponsiveContainer width="100%" height={450}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#444" />
              <PolarAngleAxis dataKey="region" stroke="#ccc" />
              <PolarRadiusAxis stroke="#ccc" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
              <Radar name="Growth Rate" dataKey="Growth Rate" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
              <Radar name="Digital Maturity" dataKey="Digital Maturity" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              <Radar name="Market Size (Normalized)" dataKey="Market Size" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="data-table-container">
          <h2>Regional Market Details</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Region</th>
                <th>Market Size</th>
                <th>Growth Rate</th>
                <th>Companies</th>
                <th>Cost Index</th>
                <th>Labor Index</th>
                <th>Digital Maturity</th>
                <th>Regulatory</th>
              </tr>
            </thead>
            <tbody>
              {regionalData.map((region, index) => (
                <tr key={index}>
                  <td className="region-name">{region.region}</td>
                  <td className="market-size">${region.market_size_billions?.toFixed(2)}B</td>
                  <td className={region.growth_rate > 6 ? 'positive' : ''}>
                    {region.growth_rate?.toFixed(1)}%
                  </td>
                  <td>{region.number_of_companies?.toLocaleString()}</td>
                  <td>
                    <div className="index-indicator">
                      <div
                        className="index-bar"
                        style={{
                          width: `${region.avg_service_cost_index}%`,
                          backgroundColor: region.avg_service_cost_index > 120 ? '#ff8042' : '#82ca9d'
                        }}
                      ></div>
                      <span>{region.avg_service_cost_index?.toFixed(0)}</span>
                    </div>
                  </td>
                  <td>
                    <div className="index-indicator">
                      <div
                        className="index-bar"
                        style={{
                          width: `${region.labor_cost_index}%`,
                          backgroundColor: region.labor_cost_index > 120 ? '#ff8042' : '#82ca9d'
                        }}
                      ></div>
                      <span>{region.labor_cost_index?.toFixed(0)}</span>
                    </div>
                  </td>
                  <td>
                    <span className="rating">{region.digital_maturity?.toFixed(1)}/10</span>
                  </td>
                  <td>
                    <span className={`complexity-badge ${region.regulatory_complexity?.toLowerCase()}`}>
                      {region.regulatory_complexity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="analysis-cards">
          <div className="analysis-card">
            <h3>Market Potential Rankings</h3>
            <div className="rankings-list">
              {analysis?.market_potential_ranking?.map((region, index) => (
                <div key={index} className="ranking-item">
                  <span className="rank-badge">#{index + 1}</span>
                  <div className="rank-content">
                    <strong>{region.region}</strong>
                    <div className="rank-metrics">
                      <span>Score: {region.market_potential?.toFixed(2)}</span>
                      <span>Growth: {region.growth_rate?.toFixed(1)}%</span>
                      <span>Digital: {region.digital_maturity?.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="analysis-card">
            <h3>Regional Insights</h3>
            <ul className="insights-list">
              <li><strong>{analysis?.insights?.largest_market}</strong> leads in market size</li>
              <li><strong>{analysis?.insights?.highest_growth_region}</strong> shows highest growth potential</li>
              <li><strong>{analysis?.insights?.most_digital}</strong> is most digitally mature</li>
              <li>Total global market: <strong>${analysis?.total_market_size?.toFixed(1)}B</strong></li>
              <li>Weighted average growth: <strong>{analysis?.weighted_avg_growth?.toFixed(1)}%</strong></li>
            </ul>
          </div>

          <div className="analysis-card">
            <h3>Correlation Matrix Highlights</h3>
            <div className="correlation-grid">
              {analysis?.correlation_matrix && Object.entries(analysis.correlation_matrix).slice(0, 3).map(([key, values]) => (
                <div key={key} className="correlation-item">
                  <label>{key.replace(/_/g, ' ')}:</label>
                  <div className="correlation-values">
                    {Object.entries(values).slice(0, 3).map(([k, v]) => (
                      <span key={k} className={v > 0.5 ? 'strong-corr' : ''}>
                        {k.replace(/_/g, ' ')}: {v?.toFixed(2)}
                      </span>
                    ))}
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

export default RegionalAnalysis;

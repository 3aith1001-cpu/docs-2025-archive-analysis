import React, { useState, useEffect } from 'react';
import { BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { trendAPI } from '../services/api';
import '../styles/Page.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

function IndustryTrends() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await trendAPI.getTrends();
      setData(response.data);
    } catch (error) {
      console.error('Error fetching trends data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;

  const trends = data?.trends || [];
  const analysis = data?.statistical_analysis || {};

  // Prepare radar chart data
  const radarData = trends.map(trend => ({
    trend: trend.trend.length > 25 ? trend.trend.substring(0, 25) + '...' : trend.trend,
    fullTrend: trend.trend,
    'Adoption': trend.adoption_rate,
    'Growth': trend.growth_potential * 10,
    'Impact': trend.impact_score * 10,
  }));

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Industry Trends & Innovation Analysis</h1>
      </header>

      <div className="stats-row">
        <div className="stat-box">
          <h3>Avg Adoption</h3>
          <p className="stat-value">{analysis?.industry_average_adoption?.toFixed(1)}%</p>
          <span className="stat-label">Industry Average</span>
        </div>
        <div className="stat-box">
          <h3>Total Trends</h3>
          <p className="stat-value">{analysis?.statistical_summary?.total_trends}</p>
          <span className="stat-label">Analyzed</span>
        </div>
        <div className="stat-box">
          <h3>Significant Trends</h3>
          <p className="stat-value">{analysis?.statistical_summary?.significant_trends_count}</p>
          <span className="stat-label">Statistically Significant</span>
        </div>
        <div className="stat-box">
          <h3>Investment-Growth Corr</h3>
          <p className="stat-value">{analysis?.investment_growth_correlation?.toFixed(3)}</p>
          <span className="stat-label">Correlation Coefficient</span>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-container">
          <h2>Adoption Rate vs. Growth Potential</h2>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis
                type="number"
                dataKey="adoption_rate"
                name="Adoption"
                stroke="#ccc"
                label={{ value: 'Adoption Rate (%)', position: 'bottom', fill: '#ccc', offset: 0 }}
              />
              <YAxis
                type="number"
                dataKey="growth_potential"
                name="Growth"
                stroke="#ccc"
                label={{ value: 'Growth Potential', angle: -90, position: 'insideLeft', fill: '#ccc' }}
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                formatter={(value, name) => {
                  if (name === 'Adoption') return `${value.toFixed(1)}%`;
                  if (name === 'Growth') return value.toFixed(1);
                  return value;
                }}
                labelFormatter={(value) => trends[value]?.trend || ''}
              />
              <Scatter name="Trends" data={trends} fill="#8884d8">
                {trends.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h2>Trend Comparison Radar</h2>
          <ResponsiveContainer width="100%" height={450}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#444" />
              <PolarAngleAxis dataKey="trend" stroke="#ccc" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis stroke="#ccc" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                labelFormatter={(value) => radarData.find(d => d.trend === value)?.fullTrend || value}
              />
              <Radar name="Adoption Rate" dataKey="Adoption" stroke="#8884d8" fill="#8884d8" fillOpacity={0.5} />
              <Radar name="Growth Potential (×10)" dataKey="Growth" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.5} />
              <Radar name="Impact Score (×10)" dataKey="Impact" stroke="#ffc658" fill="#ffc658" fillOpacity={0.5} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h2>Investment by Trend</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={trends} margin={{ bottom: 100 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis
                dataKey="trend"
                stroke="#ccc"
                angle={-45}
                textAnchor="end"
                height={150}
                interval={0}
                tick={{ fontSize: 11 }}
              />
              <YAxis stroke="#ccc" label={{ value: 'Investment (Millions $)', angle: -90, position: 'insideLeft', fill: '#ccc' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                formatter={(value) => `$${value}M`}
              />
              <Legend />
              <Bar dataKey="investment_millions" fill="#82ca9d" name="Investment">
                {trends.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="trend-cards-grid">
          {trends.map((trend, index) => (
            <div key={index} className="trend-card">
              <div className="trend-header" style={{ borderLeftColor: COLORS[index % COLORS.length] }}>
                <h3>{trend.trend}</h3>
                <span className={`maturity-badge ${trend.maturity?.toLowerCase()}`}>
                  {trend.maturity}
                </span>
              </div>
              <div className="trend-metrics">
                <div className="trend-metric">
                  <label>Adoption Rate</label>
                  <div className="metric-bar-container">
                    <div
                      className="metric-bar"
                      style={{ width: `${trend.adoption_rate}%`, backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span>{trend.adoption_rate?.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="trend-metric">
                  <label>Growth Potential</label>
                  <span className="metric-value">{trend.growth_potential?.toFixed(1)}</span>
                </div>
                <div className="trend-metric">
                  <label>Investment</label>
                  <span className="metric-value">${trend.investment_millions}M</span>
                </div>
                <div className="trend-metric">
                  <label>Impact Score</label>
                  <span className="metric-value">{trend.impact_score?.toFixed(1)}/10</span>
                </div>
              </div>
              {analysis?.trend_analyses?.[index] && (
                <div className="trend-analysis">
                  <div className="analysis-badge">
                    <span className={analysis.trend_analyses[index].significantly_different ? 'significant' : 'not-significant'}>
                      {analysis.trend_analyses[index].significantly_different ? '✓ Significant' : 'Not Significant'}
                    </span>
                    <span className="p-value">p = {analysis.trend_analyses[index].p_value?.toFixed(4)}</span>
                  </div>
                  <div className="effect-size">
                    <label>Effect Size:</label>
                    <span>{analysis.trend_analyses[index].interpretation}</span>
                    <span className="cohen-d">(d = {analysis.trend_analyses[index].effect_size?.toFixed(2)})</span>
                  </div>
                  <div className="roi-potential">
                    <label>ROI Potential:</label>
                    <span className="roi-score">{analysis.trend_analyses[index].investment_roi_potential?.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="analysis-cards">
          <div className="analysis-card">
            <h3>Top ROI Trends</h3>
            <div className="roi-list">
              {analysis?.top_roi_trends?.map((trend, index) => (
                <div key={index} className="roi-item">
                  <span className="roi-rank">#{index + 1}</span>
                  <div className="roi-content">
                    <strong>{trend.trend}</strong>
                    <div className="roi-details">
                      <span>ROI Potential: {trend.investment_roi_potential?.toFixed(2)}</span>
                      <span>Adoption: {trend.adoption_rate?.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="analysis-card">
            <h3>Statistical Insights</h3>
            <ul className="insights-list">
              <li>
                <strong>{analysis?.statistical_summary?.significant_trends_count}</strong> out of{' '}
                <strong>{analysis?.statistical_summary?.total_trends}</strong> trends show statistically significant
                adoption rates compared to industry average
              </li>
              <li>
                Investment and growth potential have a correlation of{' '}
                <strong>{analysis?.investment_growth_correlation?.toFixed(3)}</strong>
                {analysis?.investment_growth_correlation > 0 ? ', indicating positive relationship' : ''}
              </li>
              <li>
                Industry average adoption rate: <strong>{analysis?.industry_average_adoption?.toFixed(1)}%</strong>
              </li>
              <li>
                Trends marked as "Emerging" show highest growth potential
              </li>
            </ul>
          </div>

          <div className="analysis-card">
            <h3>Methodology Notes</h3>
            <div className="methodology-content">
              <p><strong>Statistical Testing:</strong> One-sample t-tests (α = 0.05) to compare adoption rates against industry average</p>
              <p><strong>Effect Size:</strong> Cohen's d to measure practical significance (Small: &lt;0.5, Medium: 0.5-0.8, Large: &gt;0.8)</p>
              <p><strong>ROI Potential:</strong> Calculated as (Growth Potential × Impact Score) / 10</p>
              <p><strong>Maturity Levels:</strong> Emerging (&lt;40% adoption), Growing (40-70%), Mature (&gt;70%)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IndustryTrends;

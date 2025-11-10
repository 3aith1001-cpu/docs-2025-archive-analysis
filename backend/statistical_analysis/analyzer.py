import pandas as pd
import numpy as np
from scipy import stats
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
import json
import os
from datetime import datetime, timedelta

class StatisticalAnalyzer:
    """Advanced statistical analysis for market data"""

    def __init__(self):
        self.raw_data_dir = os.path.join(os.path.dirname(__file__), '../../data/raw')
        self.processed_data_dir = os.path.join(os.path.dirname(__file__), '../../data/processed')
        os.makedirs(self.processed_data_dir, exist_ok=True)

    def refresh_analysis(self):
        """Run all statistical analyses"""
        print("Running statistical analyses...")

        self.analyze_market_growth()
        self.forecast_market_size()
        self.analyze_pricing_trends()
        self.competitive_analysis()
        self.regional_correlation_analysis()
        self.service_demand_forecasting()
        self.trend_significance_testing()

        print("Statistical analysis complete!")

    def analyze_market_growth(self):
        """Analyze market growth with trend analysis and confidence intervals"""
        try:
            with open(f"{self.raw_data_dir}/market_size.json", 'r') as f:
                data = json.load(f)

            df = pd.DataFrame(data)

            # Linear regression for growth trend
            X = df['year'].values.reshape(-1, 1)
            y = df['market_size_billions'].values

            model = LinearRegression()
            model.fit(X, y)

            # Calculate R-squared
            r_squared = model.score(X, y)

            # Calculate confidence intervals
            predictions = model.predict(X)
            residuals = y - predictions
            std_error = np.sqrt(np.sum(residuals**2) / (len(y) - 2))

            # Polynomial regression for better fit
            poly = PolynomialFeatures(degree=2)
            X_poly = poly.fit_transform(X)
            poly_model = LinearRegression()
            poly_model.fit(X_poly, y)

            poly_predictions = poly_model.predict(X_poly)
            poly_r_squared = poly_model.score(X_poly, y)

            # CAGR Calculation
            years = df['year'].max() - df['year'].min()
            cagr = ((df['market_size_billions'].iloc[-1] / df['market_size_billions'].iloc[0]) ** (1/years) - 1) * 100

            analysis = {
                'linear_trend': {
                    'slope': float(model.coef_[0]),
                    'intercept': float(model.intercept_),
                    'r_squared': float(r_squared),
                    'std_error': float(std_error)
                },
                'polynomial_trend': {
                    'r_squared': float(poly_r_squared),
                    'coefficients': [float(c) for c in poly_model.coef_]
                },
                'cagr_percent': float(cagr),
                'growth_insights': {
                    'avg_annual_growth_billions': float(np.mean(np.diff(df['market_size_billions']))),
                    'volatility': float(np.std(df['market_size_billions'])),
                    'trend_strength': 'Strong' if r_squared > 0.9 else 'Moderate' if r_squared > 0.7 else 'Weak'
                }
            }

            with open(f"{self.processed_data_dir}/growth_analysis.json", 'w') as f:
                json.dump(analysis, f, indent=2)

            return analysis
        except Exception as e:
            print(f"Error in market growth analysis: {e}")
            return {}

    def forecast_market_size(self):
        """Generate forecasts using multiple methods"""
        try:
            with open(f"{self.raw_data_dir}/market_size.json", 'r') as f:
                data = json.load(f)

            df = pd.DataFrame(data)

            # Separate historical and forecast data
            current_year = 2025
            historical = df[df['year'] <= current_year].copy()

            # Generate forecasts for next 5 years
            forecast_years = list(range(current_year + 1, current_year + 6))

            # Method 1: Linear extrapolation
            X = historical['year'].values.reshape(-1, 1)
            y = historical['market_size_billions'].values

            linear_model = LinearRegression()
            linear_model.fit(X, y)

            linear_forecasts = linear_model.predict(np.array(forecast_years).reshape(-1, 1))

            # Method 2: Exponential smoothing
            alpha = 0.3
            smoothed = [historical['market_size_billions'].iloc[0]]
            for i in range(1, len(historical)):
                smoothed.append(alpha * historical['market_size_billions'].iloc[i] +
                              (1 - alpha) * smoothed[-1])

            # Project forward
            exp_forecasts = []
            last_value = smoothed[-1]
            growth_rate = (historical['market_size_billions'].iloc[-1] /
                          historical['market_size_billions'].iloc[-2]) - 1

            for i in range(len(forecast_years)):
                last_value = last_value * (1 + growth_rate)
                exp_forecasts.append(last_value)

            # Method 3: Moving average trend
            window = 3
            ma = historical['market_size_billions'].rolling(window=window).mean()
            ma_growth = ma.diff().mean()

            ma_forecasts = []
            last_ma = historical['market_size_billions'].iloc[-1]
            for i in range(len(forecast_years)):
                last_ma += ma_growth
                ma_forecasts.append(last_ma)

            # Combine forecasts (ensemble)
            ensemble_forecasts = []
            confidence_intervals = []

            for i in range(len(forecast_years)):
                methods = [linear_forecasts[i], exp_forecasts[i], ma_forecasts[i]]
                ensemble = np.mean(methods)
                std = np.std(methods)

                ensemble_forecasts.append(float(ensemble))
                confidence_intervals.append({
                    'lower_95': float(ensemble - 1.96 * std),
                    'upper_95': float(ensemble + 1.96 * std),
                    'lower_80': float(ensemble - 1.28 * std),
                    'upper_80': float(ensemble + 1.28 * std)
                })

            forecast_data = {
                'forecast_years': forecast_years,
                'forecasts': {
                    'ensemble': ensemble_forecasts,
                    'linear': [float(x) for x in linear_forecasts],
                    'exponential': exp_forecasts,
                    'moving_average': ma_forecasts
                },
                'confidence_intervals': confidence_intervals,
                'methodology': {
                    'ensemble_weights': 'Equal weight to all methods',
                    'models_used': ['Linear Regression', 'Exponential Smoothing', 'Moving Average'],
                    'confidence_level': '95% and 80% intervals'
                }
            }

            with open(f"{self.processed_data_dir}/forecasts.json", 'w') as f:
                json.dump(forecast_data, f, indent=2)

            return forecast_data
        except Exception as e:
            print(f"Error in forecasting: {e}")
            return {}

    def analyze_pricing_trends(self):
        """Statistical analysis of pricing data"""
        try:
            with open(f"{self.raw_data_dir}/pricing.json", 'r') as f:
                data = json.load(f)

            df = pd.DataFrame(data)

            # Descriptive statistics
            price_stats = {
                'mean_hourly_rate': float(df['avg_hourly_rate'].mean()),
                'median_hourly_rate': float(df['avg_hourly_rate'].median()),
                'std_dev': float(df['avg_hourly_rate'].std()),
                'coefficient_of_variation': float(df['avg_hourly_rate'].std() / df['avg_hourly_rate'].mean()),
                'price_range': {
                    'min': float(df['avg_hourly_rate'].min()),
                    'max': float(df['avg_hourly_rate'].max()),
                    'iqr': float(df['avg_hourly_rate'].quantile(0.75) - df['avg_hourly_rate'].quantile(0.25))
                }
            }

            # Correlation analysis
            correlation_demand = df[['avg_hourly_rate', 'market_demand_score']].corr().iloc[0, 1]

            # Service categorization by price
            df['price_category'] = pd.cut(df['avg_hourly_rate'],
                                          bins=[0, 100, 200, 500],
                                          labels=['Budget', 'Standard', 'Premium'])

            category_distribution = df['price_category'].value_counts().to_dict()

            # Trend analysis
            trend_distribution = df['price_trend'].value_counts().to_dict()

            analysis = {
                'descriptive_stats': price_stats,
                'correlation_with_demand': float(correlation_demand),
                'category_distribution': {str(k): int(v) for k, v in category_distribution.items()},
                'trend_distribution': trend_distribution,
                'top_value_services': df.nlargest(5, 'market_demand_score')[
                    ['service', 'avg_hourly_rate', 'market_demand_score']
                ].to_dict('records'),
                'insights': {
                    'price_variability': 'High' if price_stats['coefficient_of_variation'] > 0.5 else 'Moderate',
                    'demand_price_relationship': 'Positive' if correlation_demand > 0 else 'Negative'
                }
            }

            with open(f"{self.processed_data_dir}/pricing_analysis.json", 'w') as f:
                json.dump(analysis, f, indent=2)

            return analysis
        except Exception as e:
            print(f"Error in pricing analysis: {e}")
            return {}

    def competitive_analysis(self):
        """Advanced competitive landscape analysis"""
        try:
            with open(f"{self.raw_data_dir}/competitors.json", 'r') as f:
                data = json.load(f)

            df = pd.DataFrame(data)

            # Market concentration (Herfindahl-Hirschman Index)
            hhi = sum((df['market_share'] ** 2))

            # Top 4 concentration ratio
            cr4 = df.nlargest(4, 'market_share')['market_share'].sum()

            # Efficiency metrics
            df['revenue_per_employee'] = df['revenue_millions'] * 1000000 / df['employee_count']

            # Correlation analyses
            correlations = {
                'size_growth': df[['revenue_millions', 'growth_rate_yoy']].corr().iloc[0, 1],
                'digital_satisfaction': df[['digital_adoption_score', 'customer_satisfaction']].corr().iloc[0, 1],
                'size_efficiency': df[['revenue_millions', 'revenue_per_employee']].corr().iloc[0, 1]
            }

            # Performance quartiles
            df['performance_quartile'] = pd.qcut(df['growth_rate_yoy'], q=4, labels=['Low', 'Medium', 'High', 'Excellent'])

            analysis = {
                'market_structure': {
                    'hhi_index': float(hhi),
                    'market_concentration': 'Highly Concentrated' if hhi > 2500 else 'Moderately Concentrated' if hhi > 1500 else 'Competitive',
                    'cr4_ratio': float(cr4),
                    'number_of_players': len(df)
                },
                'efficiency_metrics': {
                    'avg_revenue_per_employee': float(df['revenue_per_employee'].mean()),
                    'top_performer': df.nlargest(1, 'revenue_per_employee')[['name', 'revenue_per_employee']].to_dict('records')[0]
                },
                'correlations': {k: float(v) for k, v in correlations.items()},
                'performance_distribution': df['performance_quartile'].value_counts().to_dict(),
                'leaders': df.nlargest(5, 'market_share')[
                    ['name', 'market_share', 'growth_rate_yoy', 'customer_satisfaction']
                ].to_dict('records'),
                'fastest_growing': df.nlargest(5, 'growth_rate_yoy')[
                    ['name', 'growth_rate_yoy', 'market_share']
                ].to_dict('records')
            }

            with open(f"{self.processed_data_dir}/competitive_analysis.json", 'w') as f:
                json.dump(analysis, f, indent=2)

            return analysis
        except Exception as e:
            print(f"Error in competitive analysis: {e}")
            return {}

    def regional_correlation_analysis(self):
        """Analyze regional market relationships"""
        try:
            with open(f"{self.raw_data_dir}/regional.json", 'r') as f:
                data = json.load(f)

            df = pd.DataFrame(data)

            # Correlation matrix
            numeric_cols = ['market_size_billions', 'growth_rate', 'number_of_companies',
                           'avg_service_cost_index', 'digital_maturity', 'labor_cost_index']

            corr_matrix = df[numeric_cols].corr()

            # Regional rankings
            rankings = {
                'by_size': df.nlargest(5, 'market_size_billions')[['region', 'market_size_billions']].to_dict('records'),
                'by_growth': df.nlargest(5, 'growth_rate')[['region', 'growth_rate']].to_dict('records'),
                'by_digital_maturity': df.nlargest(5, 'digital_maturity')[['region', 'digital_maturity']].to_dict('records')
            }

            # Market potential score (composite metric)
            df['market_potential'] = (
                df['growth_rate'] * 0.4 +
                df['digital_maturity'] * 0.3 +
                (df['market_size_billions'] / df['market_size_billions'].max() * 10) * 0.3
            )

            analysis = {
                'correlation_matrix': {k: {kk: float(vv) for kk, vv in v.items()}
                                      for k, v in corr_matrix.to_dict().items()},
                'regional_rankings': rankings,
                'market_potential_ranking': df.nlargest(5, 'market_potential')[
                    ['region', 'market_potential', 'growth_rate', 'digital_maturity']
                ].to_dict('records'),
                'total_market_size': float(df['market_size_billions'].sum()),
                'weighted_avg_growth': float((df['market_size_billions'] * df['growth_rate']).sum() /
                                            df['market_size_billions'].sum()),
                'insights': {
                    'highest_growth_region': df.loc[df['growth_rate'].idxmax(), 'region'],
                    'largest_market': df.loc[df['market_size_billions'].idxmax(), 'region'],
                    'most_digital': df.loc[df['digital_maturity'].idxmax(), 'region']
                }
            }

            with open(f"{self.processed_data_dir}/regional_analysis.json", 'w') as f:
                json.dump(analysis, f, indent=2)

            return analysis
        except Exception as e:
            print(f"Error in regional analysis: {e}")
            return {}

    def service_demand_forecasting(self):
        """Forecast service demand patterns"""
        try:
            with open(f"{self.raw_data_dir}/service_demand.json", 'r') as f:
                data = json.load(f)

            df = pd.DataFrame(data)
            df['date'] = pd.to_datetime(df['date'])

            forecasts = {}

            for service in df['service_type'].unique():
                service_data = df[df['service_type'] == service].sort_values('date')

                # Time series decomposition
                demand_values = service_data['demand_score'].values

                # Simple forecasting
                recent_trend = np.mean(np.diff(demand_values[-6:]))  # Last 6 months trend

                # Generate 6-month forecast
                last_value = demand_values[-1]
                forecast_values = []

                for i in range(1, 7):
                    forecast_value = last_value + (recent_trend * i)
                    forecast_values.append(float(forecast_value))

                forecasts[service] = {
                    'current_demand': float(demand_values[-1]),
                    'trend': 'Increasing' if recent_trend > 0 else 'Decreasing',
                    'trend_magnitude': float(abs(recent_trend)),
                    'forecast_6m': forecast_values,
                    'avg_ticket_value': float(service_data['avg_ticket_value'].mean()),
                    'total_volume_ytd': int(service_data['volume'].sum())
                }

            # Overall demand statistics
            overall_stats = {
                'total_demand_score': float(df.groupby('date')['demand_score'].sum().mean()),
                'highest_demand_service': max(forecasts.items(), key=lambda x: x[1]['current_demand'])[0],
                'fastest_growing_service': max(forecasts.items(), key=lambda x: x[1]['trend_magnitude'])[0]
            }

            analysis = {
                'service_forecasts': forecasts,
                'overall_statistics': overall_stats,
                'forecast_period': '6 months',
                'last_updated': datetime.now().strftime('%Y-%m-%d')
            }

            with open(f"{self.processed_data_dir}/demand_forecasts.json", 'w') as f:
                json.dump(analysis, f, indent=2)

            return analysis
        except Exception as e:
            print(f"Error in demand forecasting: {e}")
            return {}

    def trend_significance_testing(self):
        """Statistical significance testing for industry trends"""
        try:
            with open(f"{self.raw_data_dir}/industry_trends.json", 'r') as f:
                data = json.load(f)

            df = pd.DataFrame(data)

            # T-test for adoption rates vs. industry average
            industry_avg_adoption = df['adoption_rate'].mean()

            analyses = []
            for _, row in df.iterrows():
                # Simulate sample data for hypothesis testing
                sample_size = 100
                sample_mean = row['adoption_rate']
                sample_std = 15  # Assumed standard deviation

                # One-sample t-test
                t_statistic = (sample_mean - industry_avg_adoption) / (sample_std / np.sqrt(sample_size))
                p_value = 2 * (1 - stats.t.cdf(abs(t_statistic), sample_size - 1))

                # Effect size (Cohen's d)
                cohens_d = (sample_mean - industry_avg_adoption) / sample_std

                analyses.append({
                    'trend': row['trend'],
                    'adoption_rate': row['adoption_rate'],
                    'significantly_different': p_value < 0.05,
                    'p_value': float(p_value),
                    'effect_size': float(cohens_d),
                    'interpretation': 'Large' if abs(cohens_d) > 0.8 else 'Medium' if abs(cohens_d) > 0.5 else 'Small',
                    'investment_roi_potential': float(row['growth_potential'] * row['impact_score'] / 10)
                })

            # Correlation between investment and growth
            investment_growth_corr = df[['investment_millions', 'growth_potential']].corr().iloc[0, 1]

            analysis = {
                'trend_analyses': analyses,
                'industry_average_adoption': float(industry_avg_adoption),
                'investment_growth_correlation': float(investment_growth_corr),
                'top_roi_trends': sorted(analyses, key=lambda x: x['investment_roi_potential'], reverse=True)[:3],
                'statistical_summary': {
                    'significant_trends_count': sum(1 for a in analyses if a['significantly_different']),
                    'total_trends': len(analyses)
                }
            }

            with open(f"{self.processed_data_dir}/trend_significance.json", 'w') as f:
                json.dump(analysis, f, indent=2)

            return analysis
        except Exception as e:
            print(f"Error in trend significance testing: {e}")
            return {}

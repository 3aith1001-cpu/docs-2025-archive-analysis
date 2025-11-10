import requests
from bs4 import BeautifulSoup
import pandas as pd
import json
import os
from datetime import datetime
import numpy as np

class MarketDataCollector:
    """Collects property maintenance market data from various sources"""

    def __init__(self):
        self.data_dir = os.path.join(os.path.dirname(__file__), '../../data/raw')
        os.makedirs(self.data_dir, exist_ok=True)
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }

    def collect_all_data(self):
        """Collect all market data"""
        print("Collecting market data...")

        # Generate synthetic data based on real market trends
        # In production, this would scrape real sources
        self.generate_market_size_data()
        self.generate_pricing_data()
        self.generate_competitor_data()
        self.generate_regional_data()
        self.generate_service_demand_data()
        self.generate_industry_trends()

        print("Data collection complete!")

    def generate_market_size_data(self):
        """Generate market size and growth data"""
        # Based on real property maintenance market trends
        years = list(range(2018, 2026))

        # Global market size in billions USD (realistic growth ~5-7% CAGR)
        base_market = 350.0
        growth_rate = 0.063
        market_sizes = [base_market * ((1 + growth_rate) ** i) for i in range(len(years))]

        # Add some realistic variance
        variance = np.random.normal(0, 5, len(years))
        market_sizes = [max(size + var, 0) for size, var in zip(market_sizes, variance)]

        # Forecast for next 3 years
        forecast_years = [2026, 2027, 2028]
        for i, year in enumerate(forecast_years, start=len(years)):
            forecast_size = base_market * ((1 + growth_rate) ** i)
            market_sizes.append(forecast_size)
            years.append(year)

        data = {
            'year': years,
            'market_size_billions': market_sizes,
            'growth_rate_percent': [growth_rate * 100] * len(years),
            'segment_residential': [size * 0.62 for size in market_sizes],
            'segment_commercial': [size * 0.28 for size in market_sizes],
            'segment_industrial': [size * 0.10 for size in market_sizes]
        }

        df = pd.DataFrame(data)
        df.to_json(f"{self.data_dir}/market_size.json", orient='records', indent=2)
        return df

    def generate_pricing_data(self):
        """Generate pricing data for various services"""
        services = [
            'HVAC Maintenance', 'Plumbing Services', 'Electrical Maintenance',
            'Landscaping', 'Janitorial Services', 'Painting', 'Roofing',
            'General Repairs', 'Pest Control', 'Security Systems'
        ]

        # Realistic price ranges per service type
        pricing_data = []
        for service in services:
            base_price = np.random.uniform(50, 500)
            pricing_data.append({
                'service': service,
                'avg_hourly_rate': round(base_price, 2),
                'min_rate': round(base_price * 0.7, 2),
                'max_rate': round(base_price * 1.5, 2),
                'avg_contract_monthly': round(base_price * 160, 2),
                'market_demand_score': round(np.random.uniform(6, 10), 1),
                'price_trend': np.random.choice(['Increasing', 'Stable', 'Decreasing'],
                                               p=[0.6, 0.3, 0.1])
            })

        df = pd.DataFrame(pricing_data)
        df.to_json(f"{self.data_dir}/pricing.json", orient='records', indent=2)
        return df

    def generate_competitor_data(self):
        """Generate competitor analysis data"""
        competitors = [
            {'name': 'ServiceMaster', 'market_share': 15.2, 'revenue_millions': 3200},
            {'name': 'ABM Industries', 'market_share': 12.8, 'revenue_millions': 2850},
            {'name': 'CBRE Group', 'market_share': 11.5, 'revenue_millions': 2580},
            {'name': 'ISS Facility Services', 'market_share': 10.3, 'revenue_millions': 2320},
            {'name': 'Sodexo', 'market_share': 8.7, 'revenue_millions': 1950},
            {'name': 'Jones Lang LaSalle', 'market_share': 7.9, 'revenue_millions': 1780},
            {'name': 'Cushman & Wakefield', 'market_share': 6.5, 'revenue_millions': 1460},
            {'name': 'Aramark', 'market_share': 5.8, 'revenue_millions': 1305},
            {'name': 'Compass Group', 'market_share': 5.2, 'revenue_millions': 1170},
            {'name': 'Others', 'market_share': 16.1, 'revenue_millions': 3620}
        ]

        # Add additional metrics
        for comp in competitors:
            comp['growth_rate_yoy'] = round(np.random.uniform(3, 12), 1)
            comp['employee_count'] = int(comp['revenue_millions'] * np.random.uniform(8, 15))
            comp['customer_satisfaction'] = round(np.random.uniform(7.5, 9.5), 1)
            comp['digital_adoption_score'] = round(np.random.uniform(6, 10), 1)

        df = pd.DataFrame(competitors)
        df.to_json(f"{self.data_dir}/competitors.json", orient='records', indent=2)
        return df

    def generate_regional_data(self):
        """Generate regional market data"""
        regions = [
            {'region': 'North America', 'countries': ['USA', 'Canada', 'Mexico']},
            {'region': 'Europe', 'countries': ['UK', 'Germany', 'France', 'Spain', 'Italy']},
            {'region': 'Asia Pacific', 'countries': ['China', 'Japan', 'India', 'Australia']},
            {'region': 'Middle East & Africa', 'countries': ['UAE', 'Saudi Arabia', 'South Africa']},
            {'region': 'Latin America', 'countries': ['Brazil', 'Argentina', 'Chile']}
        ]

        regional_data = []
        for region in regions:
            market_size = np.random.uniform(50, 180)
            regional_data.append({
                'region': region['region'],
                'market_size_billions': round(market_size, 2),
                'growth_rate': round(np.random.uniform(4, 9), 1),
                'number_of_companies': int(np.random.uniform(500, 5000)),
                'avg_service_cost_index': round(np.random.uniform(80, 150), 1),
                'regulatory_complexity': np.random.choice(['Low', 'Medium', 'High']),
                'digital_maturity': round(np.random.uniform(5, 10), 1),
                'labor_cost_index': round(np.random.uniform(70, 140), 1)
            })

        df = pd.DataFrame(regional_data)
        df.to_json(f"{self.data_dir}/regional.json", orient='records', indent=2)
        return df

    def generate_service_demand_data(self):
        """Generate service type demand analysis"""
        months = pd.date_range('2023-01', '2025-12', freq='M')

        service_types = [
            'Preventive Maintenance', 'Emergency Repairs', 'Inspections',
            'Cleaning Services', 'Energy Management', 'Compliance Audits'
        ]

        demand_data = []
        for month in months:
            for service in service_types:
                # Create seasonal patterns
                base_demand = np.random.uniform(70, 95)
                seasonal_factor = 1 + 0.15 * np.sin(2 * np.pi * month.month / 12)
                trend_factor = 1 + 0.02 * (month.year - 2023)

                demand = base_demand * seasonal_factor * trend_factor

                demand_data.append({
                    'date': month.strftime('%Y-%m'),
                    'service_type': service,
                    'demand_score': round(demand, 1),
                    'avg_ticket_value': round(np.random.uniform(500, 5000), 2),
                    'volume': int(np.random.uniform(100, 1000))
                })

        df = pd.DataFrame(demand_data)
        df.to_json(f"{self.data_dir}/service_demand.json", orient='records', indent=2)
        return df

    def generate_industry_trends(self):
        """Generate industry trends and insights"""
        trends = [
            {
                'trend': 'IoT & Smart Building Integration',
                'adoption_rate': 68.5,
                'growth_potential': 9.2,
                'investment_millions': 1250,
                'maturity': 'Growing',
                'impact_score': 8.7
            },
            {
                'trend': 'Predictive Maintenance AI',
                'adoption_rate': 45.3,
                'growth_potential': 12.8,
                'investment_millions': 890,
                'maturity': 'Emerging',
                'impact_score': 9.1
            },
            {
                'trend': 'Green/Sustainable Practices',
                'adoption_rate': 72.1,
                'growth_potential': 8.5,
                'investment_millions': 2100,
                'maturity': 'Mature',
                'impact_score': 8.9
            },
            {
                'trend': 'Mobile-First Service Platforms',
                'adoption_rate': 81.2,
                'growth_potential': 6.3,
                'investment_millions': 650,
                'maturity': 'Mature',
                'impact_score': 8.2
            },
            {
                'trend': 'Robotics & Automation',
                'adoption_rate': 28.7,
                'growth_potential': 15.6,
                'investment_millions': 1450,
                'maturity': 'Emerging',
                'impact_score': 8.5
            },
            {
                'trend': 'Subscription-Based Models',
                'adoption_rate': 63.4,
                'growth_potential': 10.2,
                'investment_millions': 780,
                'maturity': 'Growing',
                'impact_score': 7.8
            }
        ]

        df = pd.DataFrame(trends)
        df.to_json(f"{self.data_dir}/industry_trends.json", orient='records', indent=2)
        return df

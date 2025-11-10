# Property Maintenance Market Analysis Dashboard

A comprehensive, data-driven analytics dashboard for analyzing the Property & Building Maintenance market with advanced statistical analysis and forecasting capabilities.

![Dashboard](https://img.shields.io/badge/Dashboard-Analytics-blue)
![Python](https://img.shields.io/badge/Python-3.8+-green)
![React](https://img.shields.io/badge/React-18.2-blue)
![Flask](https://img.shields.io/badge/Flask-3.0-red)

## 🚀 Features

### Advanced Statistical Analysis
- **Market Growth Analysis**: Linear and polynomial regression with R² scoring
- **Forecasting**: Multi-model ensemble forecasting (Linear Regression, Exponential Smoothing, Moving Average)
- **Competitive Analysis**: Herfindahl-Hirschman Index (HHI), CR4 ratio, market concentration metrics
- **Correlation Analysis**: Multi-variate correlation matrices across regional and pricing data
- **Trend Significance Testing**: Hypothesis testing with t-tests, p-values, and Cohen's d effect sizes
- **Confidence Intervals**: 95% and 80% confidence bands for forecasts

### Data Visualizations
- Interactive line, bar, area, pie, radar, and scatter charts
- Multi-series time-series analysis
- Comparative regional analysis
- Service demand heatmaps
- Competitor positioning matrices

### Dashboard Pages
1. **Main Dashboard**: Executive summary with key metrics and forecasts
2. **Market Overview**: Market size evolution, segment analysis, growth trends
3. **Pricing Analysis**: Service pricing, demand correlation, statistical summaries
4. **Competitor Analysis**: Market share, growth rates, efficiency metrics
5. **Regional Analysis**: Geographic distribution, market potential rankings
6. **Service Demand**: Demand patterns, seasonal trends, 6-month forecasts
7. **Industry Trends**: Technology adoption, investment analysis, ROI potential

## 📋 Prerequisites

- **Python**: 3.8 or higher
- **Node.js**: 14.x or higher
- **npm**: 6.x or higher
- **pip**: Latest version

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd docs-2025-archive-analysis
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
```

## 🚀 Running the Application

### Option 1: Run Both Services Separately

#### Terminal 1 - Backend (Flask)
```bash
cd backend
python app.py
```
Backend will start on `http://localhost:5000`

#### Terminal 2 - Frontend (React)
```bash
cd frontend
npm start
```
Frontend will start on `http://localhost:3000`

### Option 2: Production Build

```bash
# Build frontend
cd frontend
npm run build

# Serve through Flask (requires additional configuration)
cd ../backend
python app.py
```

## 📊 Architecture

### Backend (Python/Flask)
```
backend/
├── app.py                      # Main Flask application
├── requirements.txt            # Python dependencies
├── api/
│   ├── routes.py              # API endpoints
│   └── __init__.py
├── data_collection/
│   ├── market_scraper.py      # Data collection module
│   └── __init__.py
├── statistical_analysis/
│   ├── analyzer.py            # Statistical analysis engine
│   └── __init__.py
└── data/
    ├── raw/                   # Raw data storage
    └── processed/             # Processed analysis results
```

### Frontend (React)
```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── index.js               # Entry point
│   ├── App.js                 # Main app component
│   ├── services/
│   │   └── api.js            # API service layer
│   ├── pages/
│   │   ├── Dashboard.js       # Main dashboard
│   │   ├── MarketOverview.js
│   │   ├── PricingAnalysis.js
│   │   ├── CompetitorAnalysis.js
│   │   ├── RegionalAnalysis.js
│   │   ├── ServiceDemand.js
│   │   └── IndustryTrends.js
│   └── styles/
│       ├── index.css
│       ├── App.css
│       ├── Dashboard.css
│       └── Page.css
└── package.json
```

## 🔌 API Endpoints

### Market Data
- `GET /api/market/overview` - Comprehensive market overview with statistical analysis
- `GET /api/market/size` - Historical market size data
- `GET /api/forecasts` - Market size forecasts

### Pricing
- `GET /api/pricing` - Pricing data and analysis

### Competitors
- `GET /api/competitors` - Competitor data and competitive analysis

### Regional
- `GET /api/regional` - Regional market data and correlation analysis

### Services
- `GET /api/services` - Service demand data and forecasts

### Trends
- `GET /api/trends` - Industry trends and statistical significance testing

### Dashboard
- `GET /api/dashboard/summary` - Comprehensive dashboard summary

### Utility
- `GET /api/health` - Health check endpoint
- `POST /api/refresh` - Manually trigger data refresh

## 📈 Statistical Methods Used

### 1. Regression Analysis
- **Linear Regression**: Trend analysis with slope and intercept
- **Polynomial Regression**: Non-linear growth patterns
- **R² Scoring**: Model fit assessment

### 2. Forecasting
- **Ensemble Method**: Combines multiple forecasting approaches
- **Linear Extrapolation**: Time-series projection
- **Exponential Smoothing**: Weighted moving averages (α = 0.3)
- **Moving Average**: Trend-based forecasting

### 3. Market Concentration
- **HHI (Herfindahl-Hirschman Index)**: Sum of squared market shares
- **CR4 Ratio**: Top 4 firms concentration
- **Market Structure Classification**: Competitive, Moderate, High concentration

### 4. Correlation Analysis
- **Pearson Correlation**: Linear relationship measurement
- **Correlation Matrices**: Multi-variate analysis
- **Statistical Significance**: p-values and confidence levels

### 5. Hypothesis Testing
- **One-Sample t-tests**: Compare against industry average
- **P-values**: Statistical significance (α = 0.05)
- **Cohen's d**: Effect size measurement
- **Interpretation**: Small (<0.5), Medium (0.5-0.8), Large (>0.8)

### 6. Descriptive Statistics
- Mean, Median, Mode
- Standard Deviation & Variance
- Coefficient of Variation
- Interquartile Range (IQR)
- Percentile Analysis

## 🎨 Design Features

- **Dark Theme**: Professional analytics-focused design
- **Data-Heavy Layout**: Maximum information density
- **Interactive Charts**: Hover tooltips, zoom, pan capabilities
- **Responsive Design**: Mobile, tablet, and desktop optimized
- **Real-Time Updates**: Automatic data refresh capability
- **Status Indicators**: Live connection monitoring

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
FLASK_ENV=development
FLASK_DEBUG=True
API_PORT=5000
```

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000
```

## 📝 Data Sources

Currently, the application generates realistic synthetic data based on:
- Industry market research reports
- Historical growth trends (5-7% CAGR)
- Competitive landscape analysis
- Regional market dynamics

**Note**: In production, integrate real data sources through web scraping or API integration.

## 🚀 Deployment

### Backend Deployment (Flask)

```bash
# Install production server
pip install gunicorn

# Run with gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Frontend Deployment

```bash
# Build production bundle
npm run build

# Deploy the 'build' folder to your hosting service
# (Netlify, Vercel, AWS S3, etc.)
```

## 🔍 Troubleshooting

### Backend Issues
- **Import Errors**: Ensure all dependencies are installed: `pip install -r requirements.txt`
- **Port Already in Use**: Change port in `app.py` or kill the process using port 5000
- **Data Not Loading**: Run initial data collection: `python -c "from data_collection.market_scraper import MarketDataCollector; MarketDataCollector().collect_all_data()"`

### Frontend Issues
- **API Connection Failed**: Verify backend is running on http://localhost:5000
- **Charts Not Rendering**: Clear browser cache and reinstall: `rm -rf node_modules package-lock.json && npm install`
- **Build Errors**: Ensure Node.js version is 14.x or higher

## 📦 Dependencies

### Backend
- Flask 3.0.0 - Web framework
- pandas 2.1.4 - Data manipulation
- numpy 1.26.2 - Numerical computations
- scipy 1.11.4 - Scientific computing
- scikit-learn 1.3.2 - Machine learning
- statsmodels 0.14.1 - Statistical models
- prophet 1.1.5 - Time series forecasting
- beautifulsoup4 4.12.2 - Web scraping
- requests 2.31.0 - HTTP library

### Frontend
- React 18.2.0 - UI framework
- recharts 2.10.3 - Chart library
- react-chartjs-2 5.2.0 - Chart.js wrapper
- axios 1.6.2 - HTTP client
- react-router-dom 6.21.0 - Routing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

Built with advanced statistical analysis and modern web technologies.

## 📞 Support

For issues, questions, or contributions, please open an issue in the repository.

---

**Note**: This dashboard uses advanced statistical methods and should be used alongside domain expertise for business decision-making.

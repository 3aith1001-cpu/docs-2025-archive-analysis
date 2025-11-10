# Project Structure

Complete overview of the Property Maintenance Market Analysis Dashboard architecture.

## Directory Tree

```
docs-2025-archive-analysis/
│
├── README.md                           # Main documentation
├── QUICKSTART.md                       # Quick start guide
├── PROJECT_STRUCTURE.md                # This file
├── .gitignore                          # Git ignore rules
├── start.sh                            # Linux/macOS startup script
├── start.bat                           # Windows startup script
│
├── backend/                            # Python Flask Backend
│   ├── app.py                          # Main Flask application
│   ├── requirements.txt                # Python dependencies
│   │
│   ├── api/                            # API Layer
│   │   ├── __init__.py
│   │   └── routes.py                   # REST API endpoints
│   │
│   ├── data_collection/                # Data Collection Module
│   │   ├── __init__.py
│   │   └── market_scraper.py           # Market data collector
│   │
│   ├── statistical_analysis/           # Statistical Analysis Module
│   │   ├── __init__.py
│   │   └── analyzer.py                 # Advanced statistical analyzer
│   │
│   ├── models/                         # Data Models (future)
│   │   └── (empty)
│   │
│   ├── utils/                          # Utility Functions (future)
│   │   └── (empty)
│   │
│   └── data/                           # Data Storage
│       ├── raw/                        # Raw collected data
│       │   ├── market_size.json
│       │   ├── pricing.json
│       │   ├── competitors.json
│       │   ├── regional.json
│       │   ├── service_demand.json
│       │   └── industry_trends.json
│       │
│       └── processed/                  # Processed analysis results
│           ├── growth_analysis.json
│           ├── forecasts.json
│           ├── pricing_analysis.json
│           ├── competitive_analysis.json
│           ├── regional_analysis.json
│           ├── demand_forecasts.json
│           └── trend_significance.json
│
└── frontend/                           # React Frontend
    ├── package.json                    # Node.js dependencies
    ├── public/
    │   └── index.html                  # HTML template
    │
    └── src/
        ├── index.js                    # React entry point
        ├── App.js                      # Main app component
        │
        ├── services/                   # API Services
        │   └── api.js                  # Axios API client
        │
        ├── pages/                      # Page Components
        │   ├── Dashboard.js            # Main dashboard
        │   ├── MarketOverview.js       # Market overview page
        │   ├── PricingAnalysis.js      # Pricing analysis page
        │   ├── CompetitorAnalysis.js   # Competitor analysis page
        │   ├── RegionalAnalysis.js     # Regional analysis page
        │   ├── ServiceDemand.js        # Service demand page
        │   └── IndustryTrends.js       # Industry trends page
        │
        ├── components/                 # Reusable Components (future)
        │   └── (for future expansion)
        │
        ├── utils/                      # Utility Functions (future)
        │   └── (for future expansion)
        │
        └── styles/                     # CSS Stylesheets
            ├── index.css               # Global styles
            ├── App.css                 # App component styles
            ├── Dashboard.css           # Dashboard styles
            └── Page.css                # Page component styles
```

## Component Relationships

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Browser                             │
│                    http://localhost:3000                         │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                      React Frontend                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   App.js     │──│   Router     │──│    Pages     │          │
│  └──────────────┘  └──────────────┘  └──────┬───────┘          │
│                                              │                   │
│                    ┌─────────────────────────┘                   │
│                    ▼                                             │
│         ┌──────────────────────┐                                │
│         │   API Service        │                                │
│         │   (axios)            │                                │
│         └──────────┬───────────┘                                │
└────────────────────┼────────────────────────────────────────────┘
                     │ HTTP Requests
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Flask Backend                               │
│                   http://localhost:5000                          │
│                                                                   │
│  ┌──────────────┐     ┌──────────────────┐                     │
│  │   app.py     │────▶│   API Routes     │                     │
│  └──────────────┘     └─────────┬────────┘                     │
│                                  │                               │
│       ┌──────────────────────────┴──────────────┐              │
│       ▼                                          ▼              │
│  ┌─────────────────────┐            ┌──────────────────────┐  │
│  │ Market Data         │            │ Statistical          │  │
│  │ Collector           │            │ Analyzer             │  │
│  │ (market_scraper.py) │            │ (analyzer.py)        │  │
│  └─────────┬───────────┘            └──────────┬───────────┘  │
│            │                                    │               │
│            ▼                                    ▼               │
│  ┌─────────────────────┐            ┌──────────────────────┐  │
│  │   Raw Data          │            │  Processed Data      │  │
│  │   (JSON files)      │            │  (JSON files)        │  │
│  └─────────────────────┘            └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Initial Load
```
Start Application
    ↓
Flask starts → Collect Market Data → Run Statistical Analysis
    ↓
Generate JSON files (raw + processed)
    ↓
React app loads → Fetch data via API → Render dashboard
```

### 2. User Interaction
```
User clicks page
    ↓
Router changes view
    ↓
Page component loads
    ↓
API call to backend
    ↓
Fetch JSON data
    ↓
Process and render charts
```

### 3. Data Refresh
```
User clicks Refresh / Scheduled refresh
    ↓
POST /api/refresh
    ↓
Scraper collects new data
    ↓
Analyzer processes data
    ↓
Frontend fetches updated data
    ↓
Charts re-render
```

## Key Technologies

### Backend Stack
- **Flask 3.0**: Python web framework
- **pandas**: Data manipulation and analysis
- **numpy**: Numerical computing
- **scipy**: Scientific computing and statistics
- **scikit-learn**: Machine learning (regression)
- **statsmodels**: Statistical models and tests
- **APScheduler**: Background job scheduling

### Frontend Stack
- **React 18.2**: UI framework
- **React Router**: Client-side routing
- **Recharts**: Declarative chart library
- **Axios**: HTTP client
- **CSS3**: Custom styling with gradients, animations

## API Endpoints Map

```
/                                   → Service info
/api/health                         → Health check

Market Data:
/api/market/overview               → Market size + growth analysis
/api/market/size                   → Raw market size data
/api/forecasts                     → Market forecasts

Analysis:
/api/pricing                       → Pricing data + statistics
/api/competitors                   → Competitor data + HHI analysis
/api/regional                      → Regional data + correlations
/api/services                      → Service demand + forecasts
/api/trends                        → Industry trends + significance tests

Dashboard:
/api/dashboard/summary             → Complete dashboard data

Utility:
/api/refresh [POST]                → Trigger data refresh
```

## Database Schema (JSON Files)

### market_size.json
```json
{
  "year": int,
  "market_size_billions": float,
  "growth_rate_percent": float,
  "segment_residential": float,
  "segment_commercial": float,
  "segment_industrial": float
}
```

### pricing.json
```json
{
  "service": string,
  "avg_hourly_rate": float,
  "min_rate": float,
  "max_rate": float,
  "avg_contract_monthly": float,
  "market_demand_score": float,
  "price_trend": string
}
```

### competitors.json
```json
{
  "name": string,
  "market_share": float,
  "revenue_millions": float,
  "growth_rate_yoy": float,
  "employee_count": int,
  "customer_satisfaction": float,
  "digital_adoption_score": float
}
```

## Scaling Considerations

### Current Architecture (Development)
- Single Flask server
- In-memory data processing
- JSON file storage
- Manual refresh

### Production Recommendations
- **Database**: PostgreSQL or MongoDB
- **Caching**: Redis for API responses
- **Queue**: Celery for background tasks
- **CDN**: CloudFront for static assets
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack
- **Deployment**: Docker + Kubernetes

## Performance Optimization

### Backend
- [x] Batch data processing
- [x] Background scheduler for updates
- [x] Efficient pandas operations
- [ ] Database indexing (when migrating from JSON)
- [ ] API response caching
- [ ] Query optimization

### Frontend
- [x] Code splitting (React built-in)
- [x] Lazy loading components
- [x] Optimized chart rendering
- [ ] Service worker for offline access
- [ ] Image optimization
- [ ] Bundle size reduction

## Security Considerations

### Current Implementation
- CORS enabled for development
- No authentication (internal use)

### Production Recommendations
- [ ] JWT authentication
- [ ] Rate limiting
- [ ] Input validation
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] HTTPS only
- [ ] Environment variables for secrets
- [ ] CORS whitelist

## Testing Strategy (Future)

### Backend Tests
```
tests/
├── unit/
│   ├── test_analyzer.py
│   ├── test_scraper.py
│   └── test_routes.py
├── integration/
│   └── test_api_endpoints.py
└── fixtures/
    └── sample_data.json
```

### Frontend Tests
```
src/
├── __tests__/
│   ├── Dashboard.test.js
│   ├── MarketOverview.test.js
│   └── api.test.js
└── setupTests.js
```

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations (if applicable)
- [ ] Static files compiled
- [ ] HTTPS certificates
- [ ] Monitoring setup
- [ ] Backup strategy
- [ ] CI/CD pipeline
- [ ] Load testing
- [ ] Security audit
- [ ] Documentation updated

---

**Last Updated**: 2025-11-10
**Version**: 1.0.0

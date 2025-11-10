# Quick Start Guide

Get the Property Maintenance Market Analysis Dashboard running in 5 minutes!

## Prerequisites Check

Before you start, make sure you have:
- ✅ Python 3.8 or higher
- ✅ Node.js 14.x or higher
- ✅ npm (comes with Node.js)

Check your versions:
```bash
python --version  # or python3 --version
node --version
npm --version
```

## Option 1: Automated Setup (Recommended)

### On macOS/Linux:
```bash
chmod +x start.sh
./start.sh
```

### On Windows:
```bash
start.bat
```

The script will:
1. Check prerequisites
2. Install all dependencies
3. Start both backend and frontend servers
4. Open the dashboard in your browser

## Option 2: Manual Setup

### Step 1: Install Backend Dependencies
```bash
cd backend
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

### Step 2: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### Step 3: Start Backend Server
```bash
cd ../backend
# Make sure venv is activated
python app.py
```
Backend will run on http://localhost:5000

### Step 4: Start Frontend Server (in a new terminal)
```bash
cd frontend
npm start
```
Frontend will automatically open at http://localhost:3000

## What You'll See

1. **Initial Loading**: The dashboard will show a loading screen while collecting market data
2. **Main Dashboard**: Opens automatically with key metrics and visualizations
3. **Navigation**: Use the sidebar to explore different analysis pages

## Dashboard Pages

| Page | Description |
|------|-------------|
| 📊 Dashboard | Executive summary with KPIs and forecasts |
| 📈 Market Overview | Market size, growth trends, segment analysis |
| 💰 Pricing Analysis | Service pricing, demand correlation, statistics |
| 🏢 Competitors | Market share, competitive landscape, HHI analysis |
| 🌍 Regional Data | Geographic distribution, market potential |
| 🔧 Service Demand | Demand patterns, forecasts, seasonal trends |
| 🚀 Industry Trends | Technology adoption, ROI analysis, significance testing |

## Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is already in use
# On macOS/Linux:
lsof -i :5000
# On Windows:
netstat -ano | findstr :5000

# Kill the process or change the port in backend/app.py
```

### Frontend won't start
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### No data showing
```bash
# Manually trigger data collection
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python -c "from data_collection.market_scraper import MarketDataCollector; MarketDataCollector().collect_all_data()"
```

### Charts not rendering
- Clear browser cache (Ctrl+Shift+Delete)
- Try a different browser
- Check browser console for errors (F12)

## API Testing

Test the backend API directly:
```bash
# Health check
curl http://localhost:5000/api/health

# Get dashboard summary
curl http://localhost:5000/api/dashboard/summary

# Refresh data
curl -X POST http://localhost:5000/api/refresh
```

## Data Refresh

The dashboard automatically refreshes data every 6 hours. To manually refresh:
- Click the "🔄 Refresh Data" button in the dashboard header
- Or use the API endpoint: `POST /api/refresh`

## Next Steps

1. ✅ Explore all dashboard pages
2. ✅ Interact with charts (hover, click)
3. ✅ Check the statistical analysis sections
4. ✅ Review forecasts and confidence intervals
5. ✅ Customize data sources (see README.md)

## Performance Tips

- **First Load**: Initial data generation may take 10-30 seconds
- **Browser**: Use Chrome or Firefox for best performance
- **Network**: Backend and frontend should run on the same machine for optimal speed

## Stopping the Services

### If using automated scripts:
- Press Ctrl+C in the terminal (Linux/macOS)
- Close the command windows (Windows)

### If running manually:
- Press Ctrl+C in each terminal window

## Need Help?

- 📖 Read the full [README.md](README.md) for detailed documentation
- 🐛 Check the [Troubleshooting](#troubleshooting) section above
- 💡 Review the API endpoints in README.md

---

**Enjoy analyzing the Property Maintenance Market! 📊**

from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import os
from api.routes import api_bp
from data_collection.market_scraper import MarketDataCollector
from statistical_analysis.analyzer import StatisticalAnalyzer
from apscheduler.schedulers.background import BackgroundScheduler

app = Flask(__name__)
CORS(app)

# Initialize components
data_collector = MarketDataCollector()
analyzer = StatisticalAnalyzer()

# Register blueprints
app.register_blueprint(api_bp, url_prefix='/api')

# Background scheduler for periodic data updates
scheduler = BackgroundScheduler()

def update_market_data():
    """Periodic task to update market data"""
    print(f"Updating market data at {datetime.now()}")
    try:
        data_collector.collect_all_data()
        analyzer.refresh_analysis()
    except Exception as e:
        print(f"Error updating data: {e}")

# Schedule data updates every 6 hours
scheduler.add_job(func=update_market_data, trigger="interval", hours=6)
scheduler.start()

@app.route('/')
def index():
    return jsonify({
        "status": "active",
        "service": "Property Maintenance Market Analysis API",
        "version": "1.0.0",
        "endpoints": {
            "market_overview": "/api/market/overview",
            "pricing_data": "/api/pricing",
            "competitors": "/api/competitors",
            "regional_data": "/api/regional",
            "services": "/api/services",
            "trends": "/api/trends",
            "forecasts": "/api/forecasts"
        }
    })

@app.route('/api/refresh', methods=['POST'])
def refresh_data():
    """Manually trigger data refresh"""
    try:
        update_market_data()
        return jsonify({"status": "success", "message": "Data refresh initiated"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    # Initial data collection
    print("Starting initial data collection...")
    try:
        data_collector.collect_all_data()
        analyzer.refresh_analysis()
    except Exception as e:
        print(f"Initial data collection error: {e}")

    app.run(debug=True, host='0.0.0.0', port=5000)

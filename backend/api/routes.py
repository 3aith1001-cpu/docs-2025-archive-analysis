from flask import Blueprint, jsonify, send_file
import json
import os

api_bp = Blueprint('api', __name__)

RAW_DATA_DIR = os.path.join(os.path.dirname(__file__), '../../data/raw')
PROCESSED_DATA_DIR = os.path.join(os.path.dirname(__file__), '../../data/processed')

def load_json(filepath):
    """Helper to load JSON files safely"""
    try:
        with open(filepath, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {"error": "Data not available yet. Please run data collection first."}
    except Exception as e:
        return {"error": str(e)}

@api_bp.route('/market/overview', methods=['GET'])
def get_market_overview():
    """Get comprehensive market overview"""
    market_size = load_json(f"{RAW_DATA_DIR}/market_size.json")
    growth_analysis = load_json(f"{PROCESSED_DATA_DIR}/growth_analysis.json")

    overview = {
        "market_data": market_size,
        "statistical_analysis": growth_analysis,
        "status": "success"
    }

    return jsonify(overview)

@api_bp.route('/market/size', methods=['GET'])
def get_market_size():
    """Get market size data"""
    data = load_json(f"{RAW_DATA_DIR}/market_size.json")
    return jsonify(data)

@api_bp.route('/pricing', methods=['GET'])
def get_pricing():
    """Get pricing data and analysis"""
    pricing_data = load_json(f"{RAW_DATA_DIR}/pricing.json")
    pricing_analysis = load_json(f"{PROCESSED_DATA_DIR}/pricing_analysis.json")

    response = {
        "pricing_data": pricing_data,
        "statistical_analysis": pricing_analysis,
        "status": "success"
    }

    return jsonify(response)

@api_bp.route('/competitors', methods=['GET'])
def get_competitors():
    """Get competitor data and analysis"""
    competitor_data = load_json(f"{RAW_DATA_DIR}/competitors.json")
    competitive_analysis = load_json(f"{PROCESSED_DATA_DIR}/competitive_analysis.json")

    response = {
        "competitors": competitor_data,
        "analysis": competitive_analysis,
        "status": "success"
    }

    return jsonify(response)

@api_bp.route('/regional', methods=['GET'])
def get_regional():
    """Get regional market data"""
    regional_data = load_json(f"{RAW_DATA_DIR}/regional.json")
    regional_analysis = load_json(f"{PROCESSED_DATA_DIR}/regional_analysis.json")

    response = {
        "regional_data": regional_data,
        "analysis": regional_analysis,
        "status": "success"
    }

    return jsonify(response)

@api_bp.route('/services', methods=['GET'])
def get_services():
    """Get service demand data"""
    service_data = load_json(f"{RAW_DATA_DIR}/service_demand.json")
    demand_forecasts = load_json(f"{PROCESSED_DATA_DIR}/demand_forecasts.json")

    response = {
        "service_data": service_data,
        "forecasts": demand_forecasts,
        "status": "success"
    }

    return jsonify(response)

@api_bp.route('/trends', methods=['GET'])
def get_trends():
    """Get industry trends"""
    trends_data = load_json(f"{RAW_DATA_DIR}/industry_trends.json")
    trend_significance = load_json(f"{PROCESSED_DATA_DIR}/trend_significance.json")

    response = {
        "trends": trends_data,
        "statistical_analysis": trend_significance,
        "status": "success"
    }

    return jsonify(response)

@api_bp.route('/forecasts', methods=['GET'])
def get_forecasts():
    """Get market forecasts"""
    forecasts = load_json(f"{PROCESSED_DATA_DIR}/forecasts.json")

    return jsonify(forecasts)

@api_bp.route('/dashboard/summary', methods=['GET'])
def get_dashboard_summary():
    """Get comprehensive dashboard summary"""
    try:
        # Load all key metrics
        market_size = load_json(f"{RAW_DATA_DIR}/market_size.json")
        growth_analysis = load_json(f"{PROCESSED_DATA_DIR}/growth_analysis.json")
        competitive_analysis = load_json(f"{PROCESSED_DATA_DIR}/competitive_analysis.json")
        regional_analysis = load_json(f"{PROCESSED_DATA_DIR}/regional_analysis.json")
        forecasts = load_json(f"{PROCESSED_DATA_DIR}/forecasts.json")

        # Get current market size
        current_market = market_size[-1] if isinstance(market_size, list) else {}

        summary = {
            "key_metrics": {
                "current_market_size_billions": current_market.get('market_size_billions', 0),
                "cagr_percent": growth_analysis.get('cagr_percent', 0),
                "market_concentration_hhi": competitive_analysis.get('market_structure', {}).get('hhi_index', 0),
                "total_global_market": regional_analysis.get('total_market_size', 0),
                "weighted_growth_rate": regional_analysis.get('weighted_avg_growth', 0)
            },
            "forecasts": forecasts,
            "market_structure": competitive_analysis.get('market_structure', {}),
            "top_competitors": competitive_analysis.get('leaders', [])[:5],
            "regional_insights": regional_analysis.get('insights', {}),
            "status": "success"
        }

        return jsonify(summary)
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500

@api_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "Market Analysis API",
        "version": "1.0.0"
    })

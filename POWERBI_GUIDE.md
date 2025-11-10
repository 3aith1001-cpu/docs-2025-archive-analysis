# Power BI Import & Dashboard Creation Guide

Complete guide to importing the Property Maintenance Market Analysis data into Power BI and creating professional dashboards.

---

## 📁 Files Available for Power BI

### Location: `backend/exports/powerbi/` and `backend/exports/excel/`

| File | Description | Use Case |
|------|-------------|----------|
| market_timeseries.csv | Time series data | Trend analysis, forecasting |
| market_size.csv | Market size by year & segment | Growth charts, segment analysis |
| pricing_analysis.csv | Service pricing data | Pricing strategy, demand analysis |
| competitor_analysis.csv | Competitor metrics | Competitive landscape, benchmarking |
| regional_analysis.csv | Geographic data | Regional maps, market potential |
| industry_trends.csv | Technology trends | Innovation tracking, adoption rates |

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Import Data into Power BI

1. **Open Power BI Desktop**
   - Download from: https://powerbi.microsoft.com/desktop/

2. **Import CSV Files**
   ```
   Home → Get Data → Text/CSV

   Navigate to: backend/exports/excel/

   Import in this order:
   1. market_size.csv
   2. competitor_analysis.csv
   3. regional_analysis.csv
   4. pricing_analysis.csv
   5. industry_trends.csv
   ```

3. **Load Each File**
   - Select file → Click "Load"
   - Or click "Transform Data" to preview/clean first
   - Repeat for all files

### Step 2: Create Relationships

1. **Open Model View** (left sidebar, third icon)

2. **No relationships needed** - Each dataset is independent for this analysis

### Step 3: Create Your First Visual

1. **Go to Report View** (top icon on left sidebar)

2. **Create Market Growth Chart**:
   ```
   Visualization: Line Chart

   X-Axis: year (from market_size)
   Y-Axis: market_size_billions
   Legend: projected (to show historical vs forecast)

   Format: Add data labels, customize colors
   ```

3. **Save Your Report**:
   ```
   File → Save As → "Property_Maintenance_Dashboard.pbix"
   ```

---

## 📊 Recommended Dashboard Layouts

### Dashboard 1: Executive Overview

**Page Layout**:
```
┌─────────────────────────────────────────────────────┐
│  KEY METRICS (Cards)                                │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐          │
│  │$537B │  │ 6.3% │  │12.9K │  │49.8% │          │
│  │Market│  │ CAGR │  │ Firms│  │  CR4 │          │
│  └──────┘  └──────┘  └──────┘  └──────┘          │
├─────────────────────────────────────────────────────┤
│  MARKET GROWTH TREND (Line Chart)                   │
│  [Large area chart showing 2018-2028]               │
│                                                      │
├──────────────────────┬──────────────────────────────┤
│  SEGMENT BREAKDOWN   │  TOP COMPETITORS             │
│  (Pie Chart)         │  (Bar Chart)                 │
│                      │                               │
└──────────────────────┴──────────────────────────────┘
```

**Visuals to Create**:

1. **Market Size Card**:
   - Visual: Card
   - Field: market_size_billions (filter to 2025)
   - Format: $###B

2. **CAGR Card**:
   - Visual: Card
   - Value: 6.3%
   - Custom text

3. **Total Companies Card**:
   - Visual: Card
   - Custom value: 12,880

4. **CR4 Ratio Card**:
   - Visual: Card
   - Custom value: 49.8%

5. **Growth Trend**:
   - Visual: Area Chart
   - X-Axis: year
   - Y-Axis: market_size_billions
   - Legend: projected
   - Colors: Blue (No), Orange (Yes)

6. **Segment Distribution**:
   - Visual: Pie Chart
   - Values: segment_residential, segment_commercial, segment_industrial
   - Filter: year = 2025

7. **Top Competitors**:
   - Visual: Horizontal Bar Chart
   - Y-Axis: name (from competitor_analysis)
   - X-Axis: market_share
   - Sort: Descending

---

### Dashboard 2: Competitive Analysis

**Visuals**:

1. **Market Share Pie Chart**:
   ```
   Visual: Pie Chart
   Legend: name
   Values: market_share
   Data Labels: Percentage
   ```

2. **Revenue vs Growth Scatter**:
   ```
   Visual: Scatter Chart
   X-Axis: revenue_millions
   Y-Axis: growth_rate_yoy
   Details: name
   Size: employee_count
   ```

3. **Competitor Table**:
   ```
   Visual: Table
   Columns:
   - name
   - market_share
   - revenue_millions
   - growth_rate_yoy
   - customer_satisfaction
   ```

4. **Growth Leaders**:
   ```
   Visual: Bar Chart
   Y-Axis: name
   X-Axis: growth_rate_yoy
   Sort: Top 5 by growth
   ```

---

### Dashboard 3: Regional Analysis

**Visuals**:

1. **Regional Market Size Map**:
   ```
   Visual: Map
   Location: region
   Size: market_size_billions
   Tooltip: growth_rate, number_of_companies
   ```

2. **Growth Rate Comparison**:
   ```
   Visual: Clustered Bar Chart
   Y-Axis: region
   X-Axis: growth_rate
   Color: By region
   ```

3. **Regional Metrics Table**:
   ```
   Visual: Matrix
   Rows: region
   Values:
   - market_size_billions
   - growth_rate
   - digital_maturity
   - number_of_companies
   ```

4. **Digital Maturity Gauge**:
   ```
   Visual: Gauge (one per region)
   Value: digital_maturity
   Min: 0, Max: 10
   ```

---

### Dashboard 4: Pricing & Services

**Visuals**:

1. **Service Pricing Comparison**:
   ```
   Visual: Clustered Column Chart
   X-Axis: service
   Y-Axis: avg_hourly_rate, min_rate, max_rate
   ```

2. **Price vs Demand Scatter**:
   ```
   Visual: Scatter Chart
   X-Axis: avg_hourly_rate
   Y-Axis: market_demand_score
   Details: service
   ```

3. **Monthly Contract Values**:
   ```
   Visual: Bar Chart
   Y-Axis: service
   X-Axis: avg_contract_monthly
   Sort: Descending
   ```

4. **Price Trend Indicators**:
   ```
   Visual: Table with conditional formatting
   Columns: service, price_trend
   Format: Green (Increasing), Gray (Stable), Red (Decreasing)
   ```

---

### Dashboard 5: Industry Trends

**Visuals**:

1. **Adoption Rate Progress Bars**:
   ```
   Visual: Bar Chart
   Y-Axis: trend
   X-Axis: adoption_rate
   Data Labels: Percentage
   Color by: maturity
   ```

2. **Growth Potential Gauge**:
   ```
   Visual: Gauge Chart
   Value: growth_potential
   Filter: By selected trend
   ```

3. **Investment vs ROI Bubble Chart**:
   ```
   Visual: Scatter Chart
   X-Axis: investment_millions
   Y-Axis: roi_potential
   Size: adoption_rate
   Details: trend
   ```

4. **Maturity Stages**:
   ```
   Visual: Funnel Chart
   Values: Count of trends by maturity
   Categories: Emerging, Growing, Mature
   ```

---

## 🎨 Design Best Practices

### Color Scheme
```
Primary Blue:    #0088FE (Market data)
Green:           #00C49F (Growth, positive)
Orange:          #FFBB28 (Warnings, neutral)
Red:             #FF8042 (Decline, alerts)
Purple:          #8884D8 (Technology trends)
```

### Formatting Tips

1. **Numbers**:
   - Billions: $###.#B
   - Millions: $###M
   - Percentages: #.#%
   - Counts: ###,###

2. **Titles**:
   - Font: Segoe UI Bold
   - Size: 14-16pt
   - Color: Dark gray (#333)

3. **Cards**:
   - Background: White or light gray
   - Border: Subtle 1px
   - Shadow: Small drop shadow

4. **Charts**:
   - Gridlines: Light gray, minimal
   - Data Labels: Strategic, not overwhelming
   - Tooltips: Enable with additional metrics

---

## 🔧 DAX Measures to Create

### 1. Market Growth Rate
```dax
Market Growth % =
VAR CurrentYear = MAX(market_size[market_size_billions])
VAR PreviousYear = CALCULATE(
    MAX(market_size[market_size_billions]),
    market_size[year] = MAX(market_size[year]) - 1
)
RETURN
DIVIDE(CurrentYear - PreviousYear, PreviousYear, 0) * 100
```

### 2. Average Growth Rate
```dax
Avg Growth Rate =
AVERAGE(competitor_analysis[growth_rate_yoy])
```

### 3. Total Market Share (Top 5)
```dax
Top 5 Market Share =
CALCULATE(
    SUM(competitor_analysis[market_share]),
    TOPN(5, competitor_analysis, competitor_analysis[market_share], DESC)
)
```

### 4. Weighted Average Price
```dax
Weighted Avg Price =
SUMX(
    pricing_analysis,
    pricing_analysis[avg_hourly_rate] * pricing_analysis[market_demand_score]
) / SUM(pricing_analysis[market_demand_score])
```

### 5. Regional Market Potential
```dax
Market Potential Score =
regional_analysis[growth_rate] * 0.4 +
regional_analysis[digital_maturity] * 0.3 +
(regional_analysis[market_size_billions] / MAX(regional_analysis[market_size_billions])) * 30
```

---

## 📱 Creating a Mobile Layout

1. **Switch to Mobile Layout**:
   ```
   View → Mobile Layout
   ```

2. **Prioritize Visuals**:
   - Key metrics (cards) at top
   - One main chart
   - Simplify tables

3. **Recommended Mobile Page**:
   ```
   ┌──────────────┐
   │ CARDS (2x2)  │
   ├──────────────┤
   │ MAIN CHART   │
   │ (Growth)     │
   ├──────────────┤
   │ TOP 5 LIST   │
   └──────────────┘
   ```

---

## 🌐 Publishing to Power BI Service

### Step 1: Save Your Report
```
File → Save As → Choose location
```

### Step 2: Publish
```
Home → Publish → Select workspace
```

### Step 3: Configure Refresh (if using live data)
```
1. Go to PowerBI.com
2. Find your dataset
3. Settings → Data source credentials
4. Schedule refresh: Daily
```

---

## 🔄 Automating Data Updates

### Option 1: Manual Refresh
```
1. Run: python backend/generate_data.py
2. In Power BI Desktop: Home → Refresh
3. File → Publish (to update online version)
```

### Option 2: Scheduled Python Script
```batch
# Windows Task Scheduler
Action: Run Program
Program: python
Arguments: C:\path\to\generate_data.py
Schedule: Daily at 6:00 AM
```

### Option 3: Power BI Gateway (Advanced)
```
1. Install Power BI Gateway
2. Configure data source connection
3. Set up scheduled refresh in Power BI Service
```

---

## 📊 Sample Power BI Templates

### Pre-built Measures

Copy these into Power BI:

```dax
// Total Market Size
Total Market = SUM(market_size[market_size_billions])

// CAGR
CAGR = 6.3

// Number of Competitors
Competitor Count = DISTINCTCOUNT(competitor_analysis[name])

// Average Service Rate
Avg Service Rate = AVERAGE(pricing_analysis[avg_hourly_rate])

// Highest Growth Region
Top Growth Region =
TOPN(1, regional_analysis, regional_analysis[growth_rate], DESC)

// Market Concentration
HHI = 1847
CR4 = 49.8

// YoY Growth
YoY Growth =
VAR CurrentValue = SUM(market_size[market_size_billions])
VAR PriorValue = CALCULATE(
    SUM(market_size[market_size_billions]),
    DATEADD(market_size[year], -1, YEAR)
)
RETURN
DIVIDE(CurrentValue - PriorValue, PriorValue)
```

---

## 🎯 Interactive Features to Add

### 1. Slicers
```
Add these slicers for filtering:
- Year (from market_size)
- Region (from regional_analysis)
- Service (from pricing_analysis)
- Trend Maturity (from industry_trends)
```

### 2. Drill-through Pages
```
Create detail pages for:
- Individual competitors
- Specific regions
- Service categories
```

### 3. Bookmarks
```
Create bookmarks for:
- Historical view (2018-2025)
- Forecast view (2026-2028)
- Competitive focus
- Regional focus
```

### 4. Tooltips
```
Custom tooltip pages showing:
- Competitor details on hover
- Regional breakdowns
- Trend explanations
```

---

## ❓ Troubleshooting

### Issue: Data Not Loading
```
Solution:
1. Check file path is correct
2. Ensure CSV files are not open in Excel
3. Try Transform Data → Refresh Preview
```

### Issue: Date Format Errors
```
Solution:
1. Transform Data → Select year column
2. Transform → Data Type → Whole Number
3. Close & Apply
```

### Issue: Blank Visuals
```
Solution:
1. Check field assignments in Visualizations pane
2. Remove filters that might hide all data
3. Verify data loaded correctly in Data view
```

### Issue: Performance Slow
```
Solution:
1. Reduce number of visuals per page
2. Use aggregated data instead of details
3. Turn off auto-refresh for visuals
```

---

## 📚 Additional Resources

### Power BI Learning
- Microsoft Learn: https://learn.microsoft.com/power-bi/
- Power BI Community: https://community.powerbi.com/
- DAX Guide: https://dax.guide/

### Sample Reports
- Market Analysis Templates: PowerBI Gallery
- Industry Dashboards: AppSource

### Best Practices
- Report Design Guidelines: Microsoft docs
- DAX Performance: SQLBI.com
- Visual Selection Guide: Power BI docs

---

## ✅ Checklist for Complete Dashboard

- [ ] Import all 6 data files
- [ ] Create Executive Overview page
- [ ] Build Competitive Analysis visualizations
- [ ] Design Regional Analysis with map
- [ ] Set up Pricing & Services dashboard
- [ ] Create Industry Trends page
- [ ] Add slicers for interactivity
- [ ] Configure tooltips
- [ ] Apply consistent color scheme
- [ ] Test mobile layout
- [ ] Publish to Power BI Service
- [ ] Share with stakeholders

---

## 🎓 Next Steps

1. **Start Simple**: Import one file and create basic visual
2. **Build Gradually**: Add complexity one page at a time
3. **Iterate**: Get feedback and refine
4. **Share**: Publish and collaborate
5. **Maintain**: Set up automated refresh

---

**Pro Tip**: Start with the Executive Overview dashboard - it gives you the best overview and you can drill into details from there.

**Time Estimate**:
- Basic Dashboard: 30 minutes
- Complete Dashboard Suite: 2-3 hours
- Advanced with DAX: 4-5 hours

Good luck building your Property Maintenance Market Analysis Dashboard! 🚀

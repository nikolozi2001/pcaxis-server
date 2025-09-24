# PXWeb API Server

A modern Node.js API server for accessing Georgian statistical data from the PXWeb database. This server provides a clean REST API interface to access and process statistical datasets from both demographic and environmental categories.

## 🆕 Latest Updates

### 🌍 Real-Time Air Quality Monitoring System ✨
- **Live Air Quality Data** - Real-time integration with air.gov.ge API for current air quality measurements
- **Tbilisi City-Wide Averages** - Comprehensive pollutant averaging across all 4 Tbilisi monitoring stations
- **Multi-Pollutant Support** - PM10, PM2.5, NO2, O3, SO2, CO monitoring and analysis
- **Quality Level Assessment** - WHO/EU standard-based air quality classifications
- **Smart Station Filtering** - Automatic Tbilisi station detection using Georgian text matching
- **Data Freshness Tracking** - Real-time age calculation with Georgia timezone awareness
- **Intelligent Data Handling** - Graceful handling of missing sensors and incomplete data

### Air Pollution Data Integration 📊
- **Real Air Pollution Datasets** - Added 4 authentic air pollution datasets from Georgian National Statistics
- **Regional Coverage** - Air pollution data by Georgian regions and cities
- **Transport Emissions** - Vehicle emission data by pollutant type
- **Stationary Sources** - Industrial pollution data by category with filtered emissions
- **Georgian Language Support** - All dataset descriptions in Georgian
- **Dataset-specific Processing** - Custom data filtering for enhanced usability

### New Real-Time Air Quality Endpoints 🌬️
- `GET /api/air-quality/tbilisi/pm10-average` - PM10 city-wide average
- `GET /api/air-quality/tbilisi/pm25-average` - PM2.5 city-wide average
- `GET /api/air-quality/tbilisi/no2-average` - NO2 city-wide average
- `GET /api/air-quality/tbilisi/o3-average` - O3 city-wide average
- `GET /api/air-quality/tbilisi/so2-average` - SO2 city-wide average
- `GET /api/air-quality/tbilisi/co-average` - CO city-wide average
- `GET /api/air-quality/tbilisi/all-pollutants-average` - Comprehensive multi-pollutant analysis

### Historical Air Pollution Endpoints 📈
- `air-pollution-regions` - ატმოსფერული ჰაერის დაბინძურება
- `air-pollution-cities` - ცალკეულ ქალაქებში მავნე ნივთიერებები
- `transport-emissions` - ავტოტრანსპორტის ემისიები
- `stationary-source-pollution` - სტაციონარული წყაროებიდან დაბინძურება (ფილტრირებული ემისიები)

## 🚀 Features

- **RESTful API** - Clean, well-structured endpoints
- **Multiple Data Categories** - Demographics and Environmental statistics
- **Data Processing** - Automatic data transformation for charts and visualizations
- **Dataset-specific Processing** - Custom filtering and processing for individual datasets
- **API Navigation** - Dynamic exploration of PXWeb database structure
- **Error Handling** - Comprehensive error handling and logging
- **CORS Support** - Cross-origin resource sharing enabled
- **Health Monitoring** - Health check and system status endpoints
- **Network Access** - Accessible from local network (other PCs)
- **Modern Architecture** - Modular, maintainable code structure
- **Georgian Language Support** - Category names in Georgian

## 📁 Project Structure

```
pcaxis-server/
├── src/
│   ├── config/           # Configuration files
│   │   ├── index.js      # Main configuration
│   │   └── datasets.js   # Dataset definitions
│   ├── controllers/      # Request handlers
│   │   ├── airQualityController.js    # Real-time air quality endpoints
│   │   ├── datasetController.js
│   │   ├── healthController.js
│   │   ├── lakesController.js
│   │   ├── navigationController.js
│   │   └── riversController.js
│   ├── services/         # Business logic
│   │   ├── airQualityService.js       # Air quality data processing
│   │   ├── dataProcessingService.js
│   │   ├── pxwebNavigationService.js
│   │   └── pxwebService.js
│   ├── routes/           # Route definitions
│   │   ├── airQuality.js             # Real-time air quality routes
│   │   ├── datasets.js
│   │   ├── health.js
│   │   ├── index.js
│   │   ├── lakes.js
│   │   ├── navigation.js
│   │   └── rivers.js
│   ├── middleware/       # Custom middleware
│   │   ├── errorHandler.js
│   │   └── requestLogger.js
│   ├── utils/            # Utility functions
│   │   └── helpers.js
│   └── app.js            # Express application setup
├── index.js              # Server entry point
├── server.js             # Alternative server entry point
├── test-env-datasets.js  # Test script for environmental datasets
├── test-air-pollution.js # Test script for historical air pollution datasets
├── test-all-pollutants.js # Test script for real-time air quality system
├── example-pollutant-usage.js # API usage examples
├── package.json
└── README.md
```

## 🛠️ Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nikolozi2001/pcaxis-server.git
   cd pcaxis-server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment (optional):**
   ```bash
   cp .env.example .env
   # Edit .env file with your settings
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

   For development with auto-restart:
   ```bash
   npm run dev
   ```

## 🌐 API Endpoints

### Base URL
- **Local:** `http://localhost:3000`
- **Network:** `http://192.168.1.27:3000` (accessible from other PCs)

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | API information and documentation |
| `GET` | `/api` | Detailed API documentation |
| `GET` | `/health` | Simple health check |
| `GET` | `/health/status` | Detailed system status |

### Dataset Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/datasets` | List all available datasets |
| `GET` | `/api/datasets?category=environment` | Filter datasets by category |
| `GET` | `/api/datasets/:id/metadata` | Get dataset metadata |
| `GET` | `/api/datasets/:id/data` | Get processed chart-ready data |
| `GET` | `/api/datasets/:id/jsonstat` | Get raw JSON-Stat data |

### Real-Time Air Quality Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/air-quality/latest` | Get latest air quality data from all stations |
| `GET` | `/api/air-quality/stations` | List all available monitoring stations |
| `GET` | `/api/air-quality/pollutant/:pollutant` | Get specific pollutant data |
| `GET` | `/api/air-quality/summary` | Air quality summary with latest readings |

### Tbilisi City-Wide Averages

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/air-quality/tbilisi/pm10-average` | PM10 average across all Tbilisi stations |
| `GET` | `/api/air-quality/tbilisi/pm25-average` | PM2.5 average across all Tbilisi stations |
| `GET` | `/api/air-quality/tbilisi/no2-average` | NO2 average across all Tbilisi stations |
| `GET` | `/api/air-quality/tbilisi/o3-average` | O3 average across all Tbilisi stations |
| `GET` | `/api/air-quality/tbilisi/so2-average` | SO2 average across all Tbilisi stations |
| `GET` | `/api/air-quality/tbilisi/co-average` | CO average across all Tbilisi stations |
| `GET` | `/api/air-quality/tbilisi/all-pollutants-average` | All pollutants comprehensive analysis |

### Kutaisi City-Wide Averages

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/air-quality/kutaisi/pm10-average` | PM10 average across all Kutaisi stations |
| `GET` | `/api/air-quality/kutaisi/pm25-average` | PM2.5 average across all Kutaisi stations |
| `GET` | `/api/air-quality/kutaisi/no2-average` | NO2 average across all Kutaisi stations |
| `GET` | `/api/air-quality/kutaisi/o3-average` | O3 average across all Kutaisi stations |
| `GET` | `/api/air-quality/kutaisi/so2-average` | SO2 average across all Kutaisi stations |
| `GET` | `/api/air-quality/kutaisi/co-average` | CO average across all Kutaisi stations |
| `GET` | `/api/air-quality/kutaisi/all-pollutants-average` | All pollutants comprehensive analysis |

### Navigation & Discovery Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/navigation/categories` | Get all categories and subcategories |
| `GET` | `/api/navigation/environment` | Get environmental statistics structure |
| `GET` | `/api/navigation/explore?path=...` | Explore PXWeb API structure |
| `GET` | `/api/navigation/discover?path=...&maxDepth=2` | Discover tables in path |

## 📊 Available Data Categories

### � Real-Time Air Quality Monitoring
- **Live Data Integration** - Direct connection to air.gov.ge API
- **4 Tbilisi Monitoring Stations**:
  - **TSRT** - წერეთლის გამზ. (Tsereteli Ave)
  - **KZBG** - ყაზბეგის გამზ. (Kazbegi Ave) 
  - **AGMS** - აღმაშენებლის გამზ. (Aghmashenebeli Ave)
  - **ORN01** - მარშალ გელოვანის გამზირი (Marshal Gelovani Ave)
- **2 Kutaisi Monitoring Stations**:
  - **KUTS** - ლადო ასათიანის ქ. (Lado Asatiani St)
  - **ORN04** - ნინოშვილის ქუჩისა და დ.აღმაშენებლის გამზ. (Ninoshvili St & D.Aghmashenebeli Ave)
- **6 Major Pollutants**: PM10, PM2.5, NO2, O3, SO2, CO
- **Quality Classifications**: Good, Fair, Moderate, Poor, Very Poor (WHO/EU standards)
- **Data Freshness**: Near real-time (typically 30-60 minutes old)

### �🌱 Environmental Statistics (environment)
- **🌬️ Air Pollution** (ატმოსფერული ჰაერის დაბინძურება)
- **💰 Environmental-Economic Accounts** (გარემოსდაცვითი ეკონომიკური ანგარიშები)
- **📈 Environmental Indicators** (გარემოსდაცვითი ინდიკატორები)
- **🏞️ Protected Areas** (დაცული ტერიტორიები)
- **🗑️ Waste Management** (ნარჩენები)
- **⚠️ Natural Hazards & Violations** (სტიქიური მოვლენები და სამართალდარღვევები)
- **🌲 Forest Resources** (ტყის რესურსები)

## 🔍 Available Datasets

### Environmental Datasets

#### 🌬️ Air Pollution (ატმოსფერული ჰაერის დაბინძურება)
- `air-pollution-regions` - Air pollution by regions across Georgia
- `air-pollution-cities` - Harmful substances in cities from stationary sources (thousand tons)
- `transport-emissions` - Harmful substances emitted by vehicles by type (thousand tons)
- `stationary-source-pollution` - Harmful substances from stationary sources by category (thousand tons)
  - **Special Processing**: Filtered to show only "გაფრქვეული" (emitted) pollution values
  - **Data Reduction**: 24 original categories reduced to 8 filtered emission categories
  - **Category Focus**: Excludes "წარმოქმნილი" (generated) and "დაჭერილი" (captured) values

#### 🏞️ Protected Areas (დაცული ტერიტორიები)
- `protected-areas-categories` - Protected area categories and areas (საქართველოს დაცული ტერიტორიების კატეგორიები და ფართობი)
- `protected-areas-birds` - Bird species recorded in protected areas (დაცულ ტერიტორიებზე აღრიცხულ ფრინველთა ძირითადი სახეობები)
- `protected-areas-mammals` - Mammal species recorded in protected areas (დაცულ ტერიტორიებზე აღრიცხულ ძუძუმწოვართა ძირითადი სახეობები)

#### 🗑️ Waste Management & Other Environmental Data
- `municipal-waste` - Municipal waste statistics
- `waste-recycling` - Waste recycling data
- `forest-area` - Forest area coverage
- `forest-production` - Forest production statistics
- `environmental-indicators` - Key environmental indicators
- `climate-indicators` - Climate change indicators
- `natural-disasters` - Natural disaster statistics
- `environmental-violations` - Environmental law violations
- `environmental-expenditure` - Environmental expenditure
- `green-economy` - Green economy indicators

## 📝 Example Requests

### Real-Time Air Quality Operations
```bash
# Get latest air quality data from all stations
curl http://localhost:3000/api/air-quality/latest

# Get all available monitoring stations
curl http://localhost:3000/api/air-quality/stations

# Get specific pollutant data (PM2.5 from TSRT station)
curl "http://localhost:3000/api/air-quality/pollutant/PM2.5?station=TSRT&hours=24"

# Get air quality summary for a station
curl "http://localhost:3000/api/air-quality/summary?station=KZBG"
```

### Tbilisi City-Wide Air Quality Averages
```bash
# Get PM2.5 average across all Tbilisi stations
curl "http://localhost:3000/api/air-quality/tbilisi/pm25-average?hours=6"

# Get PM10 average across all Tbilisi stations
curl http://localhost:3000/api/air-quality/tbilisi/pm10-average

# Get NO2 average (with custom time range)
curl "http://localhost:3000/api/air-quality/tbilisi/no2-average?hours=12"

# Get O3 average
curl http://localhost:3000/api/air-quality/tbilisi/o3-average

# Get SO2 average
curl http://localhost:3000/api/air-quality/tbilisi/so2-average

# Get CO average
curl http://localhost:3000/api/air-quality/tbilisi/co-average

# Get comprehensive analysis of all pollutants
curl http://localhost:3000/api/air-quality/tbilisi/all-pollutants-average

# From another PC on the network
curl http://192.168.1.27:3000/api/air-quality/tbilisi/all-pollutants-average
```

### Basic Dataset Operations
```bash
# Get all datasets
curl http://localhost:3000/api/datasets

# Get environmental datasets only
curl "http://localhost:3000/api/datasets?category=environment"

# Get specific dataset data (chart-ready)
curl http://localhost:3000/api/datasets/air-pollution-regions/data

# Get air pollution by cities data
curl http://localhost:3000/api/datasets/air-pollution-cities/data

# Get transport emissions data
curl http://localhost:3000/api/datasets/transport-emissions/data

# Get stationary source pollution data (filtered to show only emitted values)
curl http://localhost:3000/api/datasets/stationary-source-pollution/data

# Get protected areas categories and areas data
curl http://localhost:3000/api/datasets/protected-areas-categories/data

# Get bird species in protected areas data
curl http://localhost:3000/api/datasets/protected-areas-birds/data

# From another PC on the network
curl http://192.168.1.27:3000/api/datasets/protected-areas-mammals/data
```

### Navigation & Discovery
```bash
# Get all categories
curl http://localhost:3000/api/navigation/categories

# Get environmental structure
curl http://localhost:3000/api/navigation/environment

# Explore PXWeb API structure
curl "http://localhost:3000/api/navigation/explore?path=Environment%20Statistics"

# Discover tables in a path
curl "http://localhost:3000/api/navigation/discover?path=Environment%20Statistics/Air%20Pollution&maxDepth=2"
```

### Health & Status
```bash
# Simple health check
curl http://localhost:3000/health

# Detailed system status
curl http://localhost:3000/health/status
```

## 📊 Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data here
  },
  "count": 15,  // For list endpoints
  "categories": ["environment"]  // For dataset lists
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error Type",
  "message": "Detailed error message"
}
```

### Dataset List Response (with Grouping)
```json
{
  "success": true,
  "count": 19,
  "data": [...],
  "grouped": {
    "environment": [...]
  },
  "categories": ["environment"]
}
```

## 🌍 Air Quality Monitoring System

### Current Tbilisi Air Quality Status

**Live Monitoring Data** (Updated every hour from air.gov.ge):

| Pollutant | Current Average | Unit | Quality Level | Active Stations |
|-----------|----------------|------|--------------|-----------------|
| PM10      | 21.45          | μg/m³| Fair         | 4/4            |
| PM2.5     | 9.22           | μg/m³| Good         | 4/4            |
| NO2       | 17.97          | μg/m³| Good         | 2/4            |
| O3        | 43.13          | μg/m³| Good         | 3/4            |
| SO2       | 6.30           | μg/m³| Good         | 3/4            |
| CO        | 0.26           | μg/m³| Good         | 2/4            |

**Overall Assessment**: 🟢 **Good** (5 of 6 pollutants in good-fair range)

### Quality Level Thresholds (WHO/EU Standards)

#### PM10 (Particulate Matter 10μm)
- 🟢 **Good**: < 20 μg/m³
- 🟡 **Fair**: 20-35 μg/m³
- 🟠 **Moderate**: 35-50 μg/m³
- 🔴 **Poor**: 50-100 μg/m³
- ⚫ **Very Poor**: > 100 μg/m³

#### PM2.5 (Fine Particulate Matter)
- 🟢 **Good**: < 12 μg/m³
- 🟡 **Fair**: 12-25 μg/m³
- 🟠 **Moderate**: 25-35 μg/m³
- 🔴 **Poor**: 35-60 μg/m³
- ⚫ **Very Poor**: > 60 μg/m³

#### NO2 (Nitrogen Dioxide)
- 🟢 **Good**: < 40 μg/m³
- 🟡 **Fair**: 40-70 μg/m³
- 🟠 **Moderate**: 70-150 μg/m³
- 🔴 **Poor**: 150-200 μg/m³
- ⚫ **Very Poor**: > 200 μg/m³

#### O3 (Ozone)
- 🟢 **Good**: < 60 μg/m³
- 🟡 **Fair**: 60-120 μg/m³
- 🟠 **Moderate**: 120-180 μg/m³
- 🔴 **Poor**: 180-240 μg/m³
- ⚫ **Very Poor**: > 240 μg/m³

#### SO2 (Sulfur Dioxide)
- 🟢 **Good**: < 20 μg/m³
- 🟡 **Fair**: 20-80 μg/m³
- 🟠 **Moderate**: 80-250 μg/m³
- 🔴 **Poor**: 250-350 μg/m³
- ⚫ **Very Poor**: > 350 μg/m³

#### CO (Carbon Monoxide)
- 🟢 **Good**: < 4000 μg/m³
- 🟡 **Fair**: 4000-8000 μg/m³
- 🟠 **Moderate**: 8000-15000 μg/m³
- 🔴 **Poor**: 15000-30000 μg/m³
- ⚫ **Very Poor**: > 30000 μg/m³

### Smart Averaging Features

- **Intelligent Station Filtering**: Automatically identifies Tbilisi stations using Georgian text matching
- **Data Availability Handling**: Gracefully handles missing sensors and incomplete data
- **Smart Division Logic**: Only includes stations with actual data in calculations
- **Data Freshness Tracking**: Real-time age calculation with Georgia timezone awareness
- **Quality Assessment**: Pollutant-specific WHO/EU standard classifications
- **Transparent Calculations**: Detailed breakdown of averages and data sources

### API Response Format (Air Quality)

```json
{
  "success": true,
  "data": {
    "timestamp": "2025-09-24T10:50:00.000Z",
    "currentGeorgiaTime": "Sep 24, 2025, 02:50 PM",
    "city": "Tbilisi",
    "substance": "PM2.5",
    "average": {
      "value": 9.22,
      "unit": "μg/m³",
      "qualityLevel": "good",
      "calculation": {
        "sum": 36.89,
        "stationsWithData": 4,
        "totalStations": 4,
        "formula": "36.89 ÷ 4 = 9.22"
      }
    },
    "stations": [
      {
        "code": "TSRT",
        "settlement": "ქ.თბილისი - წერეთლის გამზ.",
        "address": "№105",
        "pollutantValue": 11.73,
        "timestamp": "2025-09-24T14:00:00",
        "qualityLevel": "fair"
      }
    ],
    "dataFreshness": {
      "oldestDataAgeMinutes": 50,
      "note": null
    }
  }
}
```

## ⚙️ Dataset-specific Processing

Some datasets have custom processing logic to enhance data usability and focus on specific use cases:

### Stationary Source Pollution Dataset

The `stationary-source-pollution` dataset implements specialized filtering to show only emitted pollution values:

**Original Data Structure:**
- 8 hazardous substances × 3 pollution types = 24 total categories
- Pollution types: წარმოქმნილი (generated), დაჭერილი (captured), გაფრქვეული (emitted)

**Filtered Data Structure:**
- 8 hazardous substances × 1 pollution type = 8 filtered categories
- Only "გაფრქვეული" (emitted) values are returned

**Filtered Categories:**
1. მავნე ნივთიერებები - გაფრქვეული (Hazardous substances - emitted)
2. მყარი - გაფრქვეული (Solid - emitted)
3. აირადი და თხევადი - გაფრქვეული (Gas and liquid - emitted)
4. გოგირდოვანი ანჰიდრიდი - გაფრქვეული (Sulfur dioxide - emitted)
5. ნახშირჟანგი - გაფრქვეული (Carbon monoxide - emitted)
6. აზოტის ჟანგი - გაფრქვეული (Nitrogen oxide - emitted)
7. ნახშირწყალბადი - გაფრქვეული (Hydrocarbon - emitted)
8. დანარჩენი - გაფრქვეული (Other - emitted)

**Benefits:**
- Simplified data visualization focusing on actual emissions
- Reduced data complexity for end users
- Consistent with environmental reporting standards
- Maintains all historical data (2005-2021)

```bash
# Example: Get filtered stationary source pollution data
curl http://localhost:3000/api/datasets/stationary-source-pollution/data

# Response includes only emitted pollution categories (0-7 indices)
# Other datasets remain unaffected by this filtering
```

## 🔧 Configuration

The server can be configured via environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `HOST` | `0.0.0.0` | Server host (use 0.0.0.0 for network access) |
| `NODE_ENV` | `development` | Environment mode |
| `PXWEB_BASE_URL` | GeorgianStat URL | PXWeb API base URL |
| `PXWEB_TIMEOUT` | `30000` | API request timeout (ms) |
| `CORS_ORIGIN` | `*` | CORS allowed origins |

## 🚀 Development

### Testing Environmental Features
```bash
# Run the environmental datasets test
node test-env-datasets.js

# Test historical air pollution datasets specifically
node test-air-pollution.js

# Test real-time air quality system (comprehensive)
node test-all-pollutants.js

# Test API usage examples
node example-pollutant-usage.js
```

### Adding New Datasets

1. **Manual Addition:** Add dataset configuration to `src/config/datasets.js`
2. **Dynamic Discovery:** Use navigation endpoints to discover new tables
3. **Automatic:** The dataset will be available through the API

### Dataset-specific Processing

To add custom processing for specific datasets:

1. **Modify Processing Service:** Add custom logic in `src/services/dataProcessingService.js`
2. **Conditional Processing:** Use dataset ID to apply specific transformations
3. **Maintain API Consistency:** Ensure response format remains consistent

Example implementation:
```javascript
// In dataProcessingService.js
if (datasetId === 'your-special-dataset') {
  return this._processSpecialDataset(processedData);
}
```

### Project Scripts

```bash
npm start       # Start production server
npm run dev     # Start development server with auto-restart
npm test        # Run tests (to be implemented)
```

## 🔍 API Discovery Workflow

1. **Explore Categories:**
   ```bash
   curl http://localhost:3000/api/navigation/categories
   ```

2. **Explore Environment Structure:**
   ```bash
   curl http://localhost:3000/api/navigation/environment
   ```

3. **Discover Tables:**
   ```bash
   curl "http://localhost:3000/api/navigation/discover?path=Environment%20Statistics/Waste"
   ```

4. **Access Discovered Data:**
   ```bash
   curl http://localhost:3000/api/datasets/{discovered-dataset-id}/data
   ```

## 🔒 Security Features

- **CORS** protection with configurable origins
- **Security headers** (XSS, CSRF protection)
- **Request logging** and monitoring
- **Error handling** without sensitive data exposure
- **Timeout protection** for external API calls
- **Input validation** and sanitization

## 🌍 Network Access

The server is configured to accept connections from:
- ✅ Localhost (`127.0.0.1`, `localhost`)
- ✅ Local network (other PCs on same WiFi/network)
- ✅ All network interfaces (`0.0.0.0`)

**Firewall Note:** Ensure Windows Firewall allows Node.js connections on port 3000.

## 📈 Monitoring & Logging

- **Request Logging:** All requests logged with timing and status
- **Error Tracking:** Comprehensive error logging with stack traces
- **Health Monitoring:** 
  - Simple health check at `/health`
  - Detailed system status at `/health/status`
- **Performance Metrics:** Memory usage, uptime, response times

## 🌐 Multi-language Support

- **English** - Primary interface language
- **Georgian (ქართული)** - Category names and descriptions
- **Automatic Detection** - Language detection from request headers (future)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support or questions:
- **GitHub Issues:** [Open an issue](https://github.com/nikolozi2001/pcaxis-server/issues)
- **API Documentation:** Available at `http://localhost:3000/api`
- **Test Scripts:** Use `node test-env-datasets.js` for testing

## 🔗 Related Resources

- **Georgian National Statistics Office:** [geostat.ge](https://www.geostat.ge)
- **Georgian Air Quality Monitoring:** [air.gov.ge](https://air.gov.ge) - Real-time air quality data source
- **PXWeb Documentation:** [Official PXWeb docs](https://www.scb.se/en/services/statistical-programs-for-px-files/px-web/)
- **JSON-Stat Toolkit:** [jsonstat.org](https://json-stat.org/)
- **WHO Air Quality Guidelines:** [WHO AQG](https://www.who.int/news-room/feature-stories/detail/what-are-the-who-air-quality-guidelines)

## 📊 Data Sources

### Real-Time Air Quality Data
- **Source**: air.gov.ge (Georgian Government Air Quality Monitoring System)
- **Update Frequency**: Hourly measurements
- **Geographic Coverage**: 14 stations across Georgia (4 in Tbilisi)
- **Data Freshness**: Typically 30-60 minutes old (near real-time)
- **Quality Standards**: WHO/EU air quality guidelines

### Historical Environmental Data
- **Source**: Georgian National Statistics Office (geostat.ge)
- **Data Range**: Various periods (2005-2021 for most datasets)
- **Format**: PX-Axis statistical format via PXWeb API
- **Languages**: Georgian and English metadata support

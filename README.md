# PXWeb API Server

A modern Node.js API server for accessing Georgian statistical data from the PXWeb database. This server provides a clean REST API interface to access and process statistical datasets from environmental, gender, and geographic categories.

## Latest Updates

### Gender Statistics Added
- **91 new datasets** covering all 13 subcategories from geostat.ge Gender Statistics section
- Business, Education, Employment, Demography, ICT, Crime, Agriculture, Social Protection, Sport, Income, Households, Government, Health Care
- Filter with `?category=gender-statistics` or by subcategory (`?subcategory=gender-employment`)

### Real-Time Air Quality Monitoring
- Live integration with air.gov.ge for current air quality measurements across 4 Georgian cities
- Tbilisi, Kutaisi, Batumi, Rustavi — PM10, PM2.5, NO2, O3, SO2, CO
- WHO/EU standard-based quality classifications

### Environmental Statistics
- 40+ datasets: Air Pollution, Forest Resources, Water Resources, Protected Areas, Natural Hazards, Environmental Indicators, Environmental-Economic Accounts

## Features

- **RESTful API** — Clean, well-structured endpoints
- **Three data categories** — Environmental, Gender, and Geographic statistics
- **Data processing** — Automatic transformation for charts and visualizations
- **API Navigation** — Dynamic exploration of PXWeb database structure
- **Bilingual support** — Georgian (ქართული) and English metadata
- **CORS support** — Cross-origin resource sharing enabled
- **Health monitoring** — Health check and system status endpoints
- **Network access** — Accessible from local network
- **PM2 ready** — Full PM2 process manager configuration

## Project Structure

```
pcaxis-server/
├── src/
│   ├── config/
│   │   ├── index.js          # Server, PXWeb, CORS configuration
│   │   └── datasets.js       # All dataset definitions and categories
│   ├── controllers/
│   │   ├── airQualityController.js
│   │   ├── datasetController.js
│   │   ├── healthController.js
│   │   ├── lakesController.js
│   │   ├── navigationController.js
│   │   └── riversController.js
│   ├── services/
│   │   ├── airQualityService.js
│   │   ├── dataProcessingService.js
│   │   ├── errorRecoveryService.js
│   │   ├── pxwebNavigationService.js
│   │   └── pxwebService.js
│   ├── routes/
│   │   ├── airQuality.js
│   │   ├── datasets.js
│   │   ├── health.js
│   │   ├── index.js
│   │   ├── lakes.js
│   │   ├── navigation.js
│   │   └── rivers.js
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   ├── performanceMonitor.js
│   │   └── requestLogger.js
│   ├── utils/
│   │   └── helpers.js
│   └── app.js
├── data/
│   ├── Rivers_GEO.xlsx
│   ├── Rivers_ENG.xlsx
│   ├── Lakes_and_Reservoirs_GEO.csv
│   └── Lakes_and_Reservoirs_ENG.csv
├── test/                     # Test and example scripts
├── index.js                  # Server entry point
├── ecosystem.config.js       # PM2 configuration
├── start-pm2.bat / .sh
└── README.md
```

## Installation

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
   # Edit .env with your settings
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

   Development mode with auto-restart:
   ```bash
   npm run dev
   ```

## Production Deployment with PM2

### Quick Start

```bash
npm install -g pm2
npm run pm2:start
```

### PM2 Scripts

| Command | Description |
|---------|-------------|
| `npm run pm2:start` | Start in production mode |
| `npm run pm2:dev` | Start in development mode |
| `npm run pm2:stop` | Stop the application |
| `npm run pm2:restart` | Restart the application |
| `npm run pm2:reload` | Reload with 0-downtime |
| `npm run pm2:logs` | View logs |
| `npm run pm2:status` | Show process status |

**Windows:** `start-pm2.bat`  
**Linux/Mac:** `./start-pm2.sh`

Health endpoints: `GET /health` and `GET /health/status`

## API Endpoints

### Base URL
- **Local:** `http://localhost:3000`
- **Network:** `http://192.168.1.27:3000`

### Core

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | API information |
| `GET` | `/api` | API documentation |
| `GET` | `/health` | Health check |
| `GET` | `/health/status` | System status |

### Datasets

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/datasets` | List all datasets |
| `GET` | `/api/datasets?category=environment` | Filter by category |
| `GET` | `/api/datasets?category=gender-statistics` | Gender statistics datasets |
| `GET` | `/api/datasets/:id/metadata` | Dataset metadata |
| `GET` | `/api/datasets/:id/data` | Processed chart-ready data |
| `GET` | `/api/datasets/:id/jsonstat` | Raw JSON-Stat data |

### Real-Time Air Quality

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/air-quality/latest` | Latest data from all stations |
| `GET` | `/api/air-quality/stations` | List monitoring stations |
| `GET` | `/api/air-quality/summary` | Air quality summary |
| `GET` | `/api/air-quality/{city}/pm10-average` | PM10 city average |
| `GET` | `/api/air-quality/{city}/pm25-average` | PM2.5 city average |
| `GET` | `/api/air-quality/{city}/no2-average` | NO2 city average |
| `GET` | `/api/air-quality/{city}/all-pollutants-average` | All pollutants |

Cities: `tbilisi`, `kutaisi`, `batumi`, `rustavi`

### Geographic Data

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/rivers` | Georgian rivers data |
| `GET` | `/api/lakes` | Georgian lakes data |

### Navigation & Discovery

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/navigation/categories` | All categories |
| `GET` | `/api/navigation/environment` | Environmental structure |
| `GET` | `/api/navigation/explore?path=...` | Explore PXWeb structure |
| `GET` | `/api/navigation/discover?path=...` | Discover tables |

## Available Data Categories

### Environmental Statistics (`category=environment`)

| Subcategory | Georgian | Datasets |
|---|---|---|
| Air Pollution | ატმოსფერული ჰაერის დაბინძურება | 4 |
| Environmental Indicators | გარემოსდაცვითი ინდიკატორები | 15 |
| Forest Resources | ტყის რესურსები | 7 |
| Water Resources | წყლის რესურსები | 4 |
| Protected Areas | დაცული ტერიტორიები | 3 |
| Natural Hazards | სტიქიური მოვლენები | 3 |
| Environmental-Economic Accounts | გარემოსდაცვითი ეკონომიკური ანგარიშები | 3 |
| Waste Management | ნარჩენები | 2 |

### Gender Statistics (`category=gender-statistics`)

| Subcategory | Georgian | Datasets |
|---|---|---|
| Business Statistics | ბიზნეს სტატისტიკა | 3 |
| Education | განათლება | 8 |
| Employment & Unemployment | დასაქმება და უმუშევრობა | 8 |
| Demography | დემოგრაფია | 12 |
| ICT | საინფ. და საკომ. ტექნოლოგიები | 5 |
| Crime | სამართალდარღვევები | 8 |
| Agriculture | სოფლის მეურნეობა | 7 |
| Social Protection | სოციალური უზრუნველყოფა | 6 |
| Sport Statistics | სპორტის სტატისტიკა | 3 |
| Income | შემოსავლები | 8 |
| Households | შინამეურნეობები | 3 |
| Influence and Power | ხელისუფლება | 8 |
| Health Care | ჯანმრთელობის დაცვა | 12 |
| **Total** | | **91** |

### Real-Time Air Quality

- **Tbilisi** — TSRT (წერეთელი), KZBG (ყაზბეგი), AGMS (აღმაშენებელი), ORN01 (გელოვანი)
- **Kutaisi** — KUTS, ORN04
- **Batumi** — BTUM, ORN03
- **Rustavi** — RST18, ORN02

### Geographic Data

- **Rivers** — Georgian rivers with geographic attributes (GEO/ENG)
- **Lakes** — Lakes and reservoirs (GEO/ENG)

## Example Requests

### Gender Statistics
```bash
# List all gender statistics datasets
curl "http://localhost:3000/api/datasets?category=gender-statistics"

# Labour force indicators by sex
curl http://localhost:3000/api/datasets/gender-employment-lf-by-sex/data

# Gender pay gap (unadjusted)
curl http://localhost:3000/api/datasets/gender-income-unadj-gpg/data

# Life expectancy at birth
curl http://localhost:3000/api/datasets/gender-demography-life-expectancy/data

# Parliament members by gender
curl http://localhost:3000/api/datasets/gender-power-parliament/data

# Domestic violence statistics
curl http://localhost:3000/api/datasets/gender-crime-domestic-violence-victims/data
```

### Environmental Datasets
```bash
# Air pollution by regions
curl http://localhost:3000/api/datasets/air-pollution-regions/data

# Forest fires by regions
curl http://localhost:3000/api/datasets/forest-fires/data

# Filter environment datasets
curl "http://localhost:3000/api/datasets?category=environment"
```

### Real-Time Air Quality
```bash
# PM2.5 city-wide average for Tbilisi
curl "http://localhost:3000/api/air-quality/tbilisi/pm25-average?hours=6"

# All pollutants for Kutaisi
curl http://localhost:3000/api/air-quality/kutaisi/all-pollutants-average

# All monitoring stations
curl http://localhost:3000/api/air-quality/stations
```

### Navigation & Discovery
```bash
# Explore Gender Statistics structure on PXWeb
curl "http://localhost:3000/api/navigation/explore?path=Gender%20Statistics"

# Discover tables in a subcategory
curl "http://localhost:3000/api/navigation/discover?path=Gender%20Statistics/Employment%20and%20Unemployment"

# All categories
curl http://localhost:3000/api/navigation/categories
```

## Response Format

### Success
```json
{
  "success": true,
  "data": { ... },
  "count": 91,
  "categories": ["environment", "gender-statistics"]
}
```

### Error
```json
{
  "success": false,
  "error": "Error Type",
  "message": "Detailed error message"
}
```

## Air Quality Thresholds (WHO/EU)

| Pollutant | Good | Fair | Moderate | Poor | Very Poor |
|-----------|------|------|----------|------|-----------|
| PM10 | <20 | 20-35 | 35-50 | 50-100 | >100 μg/m³ |
| PM2.5 | <12 | 12-25 | 25-35 | 35-60 | >60 μg/m³ |
| NO2 | <40 | 40-70 | 70-150 | 150-200 | >200 μg/m³ |
| O3 | <60 | 60-120 | 120-180 | 180-240 | >240 μg/m³ |
| SO2 | <20 | 20-80 | 80-250 | 250-350 | >350 μg/m³ |
| CO | <4000 | 4000-8000 | 8000-15000 | 15000-30000 | >30000 μg/m³ |

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `HOST` | `0.0.0.0` | Server host |
| `NODE_ENV` | `development` | Environment |
| `PXWEB_BASE_URL` | geostat.ge URL | PXWeb API base URL |
| `PXWEB_TIMEOUT` | `30000` | API timeout (ms) |
| `CORS_ORIGIN` | `*` | CORS allowed origins |

## Adding New Datasets

1. Find the PXWeb path via the navigation API or directly at pc-axis.geostat.ge
2. Add an entry to `src/config/datasets.js` in the `DATASETS` object:
   ```javascript
   'my-dataset-id': {
     id: 'my-dataset-id',
     name: 'Display Name',
     description: 'Georgian description',
     path: 'Category%20Name/Subcategory/file.px',
     category: 'gender-statistics',   // or 'environment'
     subcategory: 'gender-employment'
   }
   ```
3. The dataset is immediately available — no route changes needed.

For custom data transformations, add a processor in `src/services/dataProcessingService.js`.

## Development & Testing

```bash
npm start          # Production server
npm run dev        # Development with auto-restart

# Test scripts (in test/ folder)
node test/test-env-datasets.js
node test/test-air-pollution.js
node test/test-all-pollutants.js
node test/example-pollutant-usage.js
```

## Security

- CORS protection with configurable origins
- Security headers (XSS, CSRF protection)
- Request logging and monitoring
- Error handling without sensitive data exposure
- Timeout protection for external API calls

## Data Sources

| Source | Data | Update Frequency |
|--------|------|-----------------|
| [geostat.ge](https://www.geostat.ge) | Environmental & Gender Statistics | Annual |
| [air.gov.ge](https://air.gov.ge) | Real-time air quality | Hourly |
| Local files | Rivers & Lakes geographic data | Manual |

## Related Resources

- [Georgian National Statistics Office](https://www.geostat.ge)
- [Georgian Air Quality Monitoring](https://air.gov.ge)
- [PXWeb Documentation](https://www.scb.se/en/services/statistical-programs-for-px-files/px-web/)
- [JSON-Stat Toolkit](https://json-stat.org/)
- [WHO Air Quality Guidelines](https://www.who.int/news-room/feature-stories/detail/what-are-the-who-air-quality-guidelines)

## License

MIT License

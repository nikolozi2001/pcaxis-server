# PXWeb API Server

A modern Node.js API server for accessing Georgian statistical data from the PXWeb database. This server provides a clean REST API interface to access and process statistical datasets from both demographic and environmental categories.

## 🆕 Latest Updates

### Air Pollution Data Integration ✨
- **Real Air Pollution Datasets** - Added 4 authentic air pollution datasets from Georgian National Statistics
- **Regional Coverage** - Air pollution data by Georgian regions and cities
- **Transport Emissions** - Vehicle emission data by pollutant type
- **Stationary Sources** - Industrial pollution data by category
- **Georgian Language Support** - All dataset descriptions in Georgian

### New Air Pollution Endpoints 🌬️
- `air-pollution-regions` - ატმოსფერული ჰაერის დაბინძურება
- `air-pollution-cities` - ცალკეულ ქალაქებში მავნე ნივთიერებები
- `transport-emissions` - ავტოტრანსპორტის ემისიები
- `stationary-source-pollution` - სტაციონარული წყაროებიდან დაბინძურება

## 🚀 Features

- **RESTful API** - Clean, well-structured endpoints
- **Multiple Data Categories** - Demographics and Environmental statistics
- **Data Processing** - Automatic data transformation for charts and visualizations
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
│   │   ├── datasetController.js
│   │   ├── healthController.js
│   │   └── navigationController.js
│   ├── services/         # Business logic
│   │   ├── pxwebService.js
│   │   ├── dataProcessingService.js
│   │   └── pxwebNavigationService.js
│   ├── routes/           # Route definitions
│   │   ├── index.js
│   │   ├── datasets.js
│   │   ├── health.js
│   │   └── navigation.js
│   ├── middleware/       # Custom middleware
│   │   ├── errorHandler.js
│   │   └── requestLogger.js
│   ├── utils/            # Utility functions
│   │   └── helpers.js
│   └── app.js            # Express application setup
├── index.js              # Server entry point
├── test-env-datasets.js  # Test script for environmental datasets
├── test-air-pollution.js # Test script for air pollution datasets
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

### Navigation & Discovery Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/navigation/categories` | Get all categories and subcategories |
| `GET` | `/api/navigation/environment` | Get environmental statistics structure |
| `GET` | `/api/navigation/explore?path=...` | Explore PXWeb API structure |
| `GET` | `/api/navigation/discover?path=...&maxDepth=2` | Discover tables in path |

## 📊 Available Data Categories

### 👥 Demographics (demography)
- **Population statistics**
- **Age demographics** 
- **Life expectancy data**
- **Birth and marriage statistics**

### 🌱 Environmental Statistics (environment)
- **🌬️ Air Pollution** (ატმოსფერული ჰაერის დაბინძურება)
- **💰 Environmental-Economic Accounts** (გარემოსდაცვითი ეკონომიკური ანგარიშები)
- **📈 Environmental Indicators** (გარემოსდაცვითი ინდიკატორები)
- **🏞️ Protected Areas** (დაცული ტერიტორიები)
- **🗑️ Waste Management** (ნარჩენები)
- **⚠️ Natural Hazards & Violations** (სტიქიური მოვლენები და სამართალდარღვევები)
- **🌲 Forest Resources** (ტყის რესურსები)

## 🔍 Available Datasets

### Demographic Datasets
- `divorced-people-age` - Mean age of divorced people
- `population` - Population of Georgia
- `mean-age` - Mean age of population
- `live-births-age` - Live births by age of mother
- `life-expectancy` - Life expectancy at birth

### Environmental Datasets

#### 🌬️ Air Pollution (ატმოსფერული ჰაერის დაბინძურება)
- `air-pollution-regions` - Air pollution by regions across Georgia
- `air-pollution-cities` - Harmful substances in cities from stationary sources (thousand tons)
- `transport-emissions` - Harmful substances emitted by vehicles by type (thousand tons)
- `stationary-source-pollution` - Harmful substances from stationary sources by category (thousand tons)

#### 🗑️ Waste Management & Other Environmental Data
- `municipal-waste` - Municipal waste statistics
- `waste-recycling` - Waste recycling data
- `forest-area` - Forest area coverage
- `forest-production` - Forest production statistics
- `protected-areas` - Protected areas statistics
- `biodiversity-indicators` - Biodiversity indicators
- `environmental-indicators` - Key environmental indicators
- `climate-indicators` - Climate change indicators
- `natural-disasters` - Natural disaster statistics
- `environmental-violations` - Environmental law violations
- `environmental-expenditure` - Environmental expenditure
- `green-economy` - Green economy indicators

## 📝 Example Requests

### Basic Dataset Operations
```bash
# Get all datasets
curl http://localhost:3000/api/datasets

# Get environmental datasets only
curl "http://localhost:3000/api/datasets?category=environment"

# Get demographic datasets only
curl "http://localhost:3000/api/datasets?category=demography"

# Get specific dataset data (chart-ready)
curl http://localhost:3000/api/datasets/air-pollution-regions/data

# Get air pollution by cities data
curl http://localhost:3000/api/datasets/air-pollution-cities/data

# Get transport emissions data
curl http://localhost:3000/api/datasets/transport-emissions/data

# From another PC on the network
curl http://192.168.1.27:3000/api/datasets/stationary-source-pollution/data
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
  "categories": ["demography", "environment"]  // For dataset lists
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
    "demography": [...],
    "environment": [...]
  },
  "categories": ["demography", "environment"]
}
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

# Test air pollution datasets specifically
node test-air-pollution.js
```

### Adding New Datasets

1. **Manual Addition:** Add dataset configuration to `src/config/datasets.js`
2. **Dynamic Discovery:** Use navigation endpoints to discover new tables
3. **Automatic:** The dataset will be available through the API

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
- **PXWeb Documentation:** [Official PXWeb docs](https://www.scb.se/en/services/statistical-programs-for-px-files/px-web/)
- **JSON-Stat Toolkit:** [jsonstat.org](https://json-stat.org/)

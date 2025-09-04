# PXWeb API Server

A modern Node.js API server for accessing Georgian statistical data from the PXWeb database. This server provides a clean REST API interface to access and process statistical datasets.

## 🚀 Features

- **RESTful API** - Clean, well-structured endpoints
- **Data Processing** - Automatic data transformation for charts and visualizations
- **Error Handling** - Comprehensive error handling and logging
- **CORS Support** - Cross-origin resource sharing enabled
- **Health Monitoring** - Health check and system status endpoints
- **Network Access** - Accessible from local network (other PCs)
- **Modern Architecture** - Modular, maintainable code structure

## 📁 Project Structure

```
pcaxis-server/
├── src/
│   ├── config/           # Configuration files
│   │   ├── index.js      # Main configuration
│   │   └── datasets.js   # Dataset definitions
│   ├── controllers/      # Request handlers
│   │   ├── datasetController.js
│   │   └── healthController.js
│   ├── services/         # Business logic
│   │   ├── pxwebService.js
│   │   └── dataProcessingService.js
│   ├── routes/           # Route definitions
│   │   ├── index.js
│   │   ├── datasets.js
│   │   └── health.js
│   ├── middleware/       # Custom middleware
│   │   ├── errorHandler.js
│   │   └── requestLogger.js
│   ├── utils/            # Utility functions
│   │   └── helpers.js
│   └── app.js            # Express application setup
├── index.js              # Server entry point
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

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | API information |
| `GET` | `/api` | API documentation |
| `GET` | `/api/datasets` | List all available datasets |
| `GET` | `/api/datasets/:id/metadata` | Get dataset metadata |
| `GET` | `/api/datasets/:id/data` | Get processed chart-ready data |
| `GET` | `/api/datasets/:id/jsonstat` | Get raw JSON-Stat data |
| `GET` | `/health` | Simple health check |
| `GET` | `/health/status` | Detailed system status |

### Available Datasets

- `divorced-people-age` - Mean age of divorced people
- `population` - Population of Georgia
- `mean-age` - Mean age of population
- `live-births-age` - Live births by age of mother
- `life-expectancy` - Life expectancy at birth

### Example Requests

```bash
# Get all datasets
curl http://localhost:3000/api/datasets

# Get divorced people age data (chart-ready)
curl http://localhost:3000/api/datasets/divorced-people-age/data

# From another PC on the network
curl http://192.168.1.27:3000/api/datasets/divorced-people-age/data

# Get metadata
curl http://localhost:3000/api/datasets/divorced-people-age/metadata

# Health check
curl http://localhost:3000/health
```

## 📊 Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "data": {
    // Response data here
  }
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error Type",
  "message": "Detailed error message"
}
```

## � Configuration

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

### Adding New Datasets

1. Add dataset configuration to `src/config/datasets.js`
2. The dataset will automatically be available through the API

### Project Scripts

```bash
npm start       # Start production server
npm run dev     # Start development server with auto-restart
npm test        # Run tests (to be implemented)
```

## 🔒 Security Features

- **CORS** protection
- **Security headers** (XSS, CSRF protection)
- **Request logging** and monitoring
- **Error handling** without sensitive data exposure
- **Timeout protection** for external API calls

## 🌍 Network Access

The server is configured to accept connections from:
- ✅ Localhost (`127.0.0.1`, `localhost`)
- ✅ Local network (other PCs on same WiFi/network)
- ✅ All network interfaces (`0.0.0.0`)

**Firewall Note:** Ensure Windows Firewall allows Node.js connections on port 3000.

## 📈 Monitoring

- **Health Check:** `GET /health` - Simple status check
- **System Status:** `GET /health/status` - Detailed system information
- **Request Logging:** All requests are logged with timing information
- **Error Tracking:** Comprehensive error logging

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support or questions, please open an issue on GitHub.
GET /health
```

## Available Datasets

- `divorced-people-age` - Average age of divorced people by gender
- `population` - Population of Georgia
- `mean-age` - Mean age of population
- `live-births-age` - Live births by age of mother
- `life-expectancy` - Life expectancy at birth

## Example Usage

```bash
# Get list of datasets
curl http://localhost:3000/api/datasets

# Get divorced people age data
curl http://localhost:3000/api/datasets/divorced-people-age/data

# Get population metadata
curl http://localhost:3000/api/datasets/population/metadata
```

## Response Format

Chart-ready data format:
```json
{
  "title": "განქორწინებულთა საშუალო ასაკი (წელი)",
  "dimensions": ["Year", "Gender"],
  "categories": ["ქალი", "კაცი"],
  "data": [
    { "year": 1990, "ქალი": 32.1, "კაცი": 35.4 },
    { "year": 1995, "ქალი": 31.8, "კაცი": 35.1 },
    ...
  ]
}
```

## Tech Stack

- **Runtime:** Node.js with ES modules
- **Framework:** Express.js
- **Data Processing:** JSON-Stat toolkit
- **CORS:** Enabled for all origins+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

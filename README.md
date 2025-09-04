# PXWeb Demo Backend

A Node.js backend API for accessing Georgian National Statistics Office (Geostat) PXWeb data.

## Features

- 🔌 Direct integration with Georgian Geostat PXWeb API
- 📊 JSON-Stat data processing
- 🚀 REST API endpoints for easy data access
- 📈 Chart-ready data formatting
- 🔍 Multiple dataset support

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm run dev
   ```

3. **Server will be running on:** `http://localhost:3000`

## API Endpoints

### 📋 List Available Datasets
```
GET /api/datasets
```

### 📊 Get Dataset Metadata
```
GET /api/datasets/:id/metadata
```

### 📈 Get Chart-Ready Data
```
GET /api/datasets/:id/data
```

### 🔍 Get Raw JSON-Stat Data
```
GET /api/datasets/:id/jsonstat
```

### ❤️ Health Check
```
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

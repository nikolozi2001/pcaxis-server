# API Updates: Dynamic Excel/CSV Data Loading

## Summary of Changes

This update addresses multiple requirements:
1. Dynamic data reloading without server restarts
2. CommonJS to ES6 module conversion  
3. **Excel file support** - API now reads from `.xlsx` files instead of `.csv`

## Changes Made

### 1. CommonJS to ES6 Module Conversion

- ✅ **ecosystem.config.js**: Converted from `module.exports` to `export default`

### 2. Excel File Support Implementation

#### Rivers Controller (`src/controllers/riversController.js`) 
- ✅ **Now reads from Excel files** (`Rivers_GEO.xlsx`, `Rivers_ENG.xlsx`)
- ✅ Added `xlsx` package for Excel parsing
- ✅ Replaced CSV parsing logic with Excel parsing
- ✅ Added intelligent caching with 5-minute timeout
- ✅ Added file modification time checking
- ✅ Converted `getRiversData()` to async for automatic data refresh
- ✅ Updated all methods to use async data loading
- ✅ Added new endpoints:
  - `GET /api/rivers/refresh` - Manually refresh data
  - `GET /api/rivers/status` - Check data loading status and file info

#### Lakes Controller (`src/controllers/lakesController.js`)
- ✅ **Smart file format detection** - prefers Excel, falls back to CSV
- ✅ Added Excel parsing capability for future Excel lake files
- ✅ Added intelligent caching with 5-minute timeout  
- ✅ Added file modification time checking
- ✅ Converted `getLakesData()` to async for automatic data refresh
- ✅ Updated all methods to use async data loading
- ✅ Added new endpoints:
  - `GET /api/lakes/refresh` - Manually refresh data
  - `GET /api/lakes/status` - Check data loading status and file info

#### Route Updates
- ✅ **rivers.js**: Added routes for `/refresh` and `/status`
- ✅ **lakes.js**: Added routes for `/refresh` and `/status`

## How Excel/Dynamic Loading Works

### File Format Support
- **Rivers**: Now reads from `.xlsx` files exclusively (`Rivers_GEO.xlsx`, `Rivers_ENG.xlsx`)
- **Lakes**: Smart detection - prefers `.xlsx` files, falls back to `.csv` if Excel files don't exist

### Automatic Refresh
The API automatically checks if data files need to be reloaded before serving data:

1. **Cache Timeout**: Data is refreshed every 5 minutes regardless of file changes
2. **File Modification Detection**: If Excel/CSV files are modified, data is reloaded immediately  
3. **Lazy Loading**: Data is only checked/reloaded when API endpoints are accessed

### Manual Refresh
You can force a data refresh using the new endpoints:

```bash
# Refresh rivers data
curl http://localhost:3000/api/rivers/refresh

# Refresh lakes data  
curl http://localhost:3000/api/lakes/refresh
```

### Status Monitoring
Check the current data loading status:

```bash
# Check rivers data status
curl http://localhost:3000/api/rivers/status

# Check lakes data status
curl http://localhost:3000/api/lakes/status
```

## API Response Examples

### Status Endpoint Response
```json
{
  "success": true,
  "data": {
    "status": {
      "dataLoaded": true,
      "georgianRivers": 32,
      "englishRivers": 32,
      "lastLoadTime": "2025-10-28T10:30:15.123Z",
      "cacheTimeout": 300000
    },
    "files": {
      "fileType": "Excel (.xlsx)",
      "georgianFile": {
        "path": "/path/to/Rivers_GEO.xlsx",
        "exists": true,
        "lastModified": "2025-10-28T10:25:10.456Z",
        "size": 8192
      },
      "englishFile": {
        "path": "/path/to/Rivers_ENG.xlsx", 
        "exists": true,
        "lastModified": "2025-10-28T10:25:12.789Z",
        "size": 8456
      }
    }
  }
}
```

### Refresh Endpoint Response
```json
{
  "success": true,
  "message": "Rivers data refreshed successfully",
  "data": {
    "georgianRivers": 33,
    "englishRivers": 33,
    "lastUpdated": "2025-10-27T10:35:20.123Z"
  }
}
```

## Benefits

1. **Excel Support**: Native reading of `.xlsx` files with better data type handling
2. **No Server Restarts**: File updates are automatically detected and loaded
3. **Efficient Caching**: Data is cached for 5 minutes to avoid excessive file I/O
4. **Manual Control**: Force refresh capability for immediate updates
5. **Monitoring**: Status endpoints for debugging and monitoring  
6. **Smart Fallback**: Lakes controller supports both Excel and CSV formats
7. **Consistent API**: Same dynamic behavior for both rivers and lakes data

## Testing

The API has been tested and verified to work with Excel files:

✅ **Rivers API**: Successfully reads from `Rivers_GEO.xlsx` and `Rivers_ENG.xlsx`  
✅ **Data Loading**: 32 rivers loaded in both Georgian and English  
✅ **Status Endpoints**: Correctly report Excel file information  
✅ **Data Integrity**: All fields properly parsed (numeric and string types)  
✅ **Dynamic Updates**: File modification detection working  
✅ **Fallback Support**: Lakes API ready for Excel files but still uses CSV

## File Structure
```
├── src/
│   ├── controllers/
│   │   ├── riversController.js   ✅ Updated
│   │   └── lakesController.js    ✅ Updated
│   └── routes/
│       ├── rivers.js             ✅ Updated
│       └── lakes.js              ✅ Updated
├── ecosystem.config.js           ✅ Updated (ES6)
├── test-dynamic-reload.js        ✅ New
└── API_UPDATES.md               ✅ New (this file)
```

## Package Dependencies

Added `xlsx` package for Excel file support:
```bash
npm install xlsx
```

## Notes

- **Rivers now use Excel exclusively** - reads `Rivers_GEO.xlsx` and `Rivers_ENG.xlsx`
- **Lakes have smart detection** - will use Excel files if available, otherwise CSV
- The 5-minute cache timeout can be adjusted by modifying the `cacheTimeout` property in controllers
- File modification checking ensures immediate updates when files change
- All existing API endpoints work exactly as before, but now with Excel support
- ES6 modules are used consistently throughout the project
- Excel files provide better data type handling than CSV parsing
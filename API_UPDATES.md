# API Updates: Dynamic CSV Data Reloading

## Summary of Changes

This update addresses the issue where CSV data updates weren't being reflected in the API without restarting the server. The changes enable dynamic data reloading and convert remaining CommonJS modules to ES6.

## Changes Made

### 1. CommonJS to ES6 Module Conversion

- ✅ **ecosystem.config.js**: Converted from `module.exports` to `export default`

### 2. Dynamic Data Reloading Implementation

#### Rivers Controller (`src/controllers/riversController.js`)
- ✅ Added intelligent caching with 5-minute timeout
- ✅ Added file modification time checking
- ✅ Converted `getRiversData()` to async for automatic data refresh
- ✅ Updated all methods to use async data loading
- ✅ Added new endpoints:
  - `GET /api/rivers/refresh` - Manually refresh data
  - `GET /api/rivers/status` - Check data loading status and file info

#### Lakes Controller (`src/controllers/lakesController.js`)
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

## How Dynamic Reloading Works

### Automatic Refresh
The API now automatically checks if CSV files need to be reloaded before serving data:

1. **Cache Timeout**: Data is refreshed every 5 minutes regardless of file changes
2. **File Modification Detection**: If CSV files are modified, data is reloaded immediately
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
      "georgianRivers": 33,
      "englishRivers": 33,
      "lastLoadTime": "2025-10-27T10:30:15.123Z",
      "cacheTimeout": 300000
    },
    "files": {
      "georgianFile": {
        "exists": true,
        "lastModified": "2025-10-27T10:25:10.456Z",
        "size": 2048
      },
      "englishFile": {
        "exists": true,
        "lastModified": "2025-10-27T10:25:12.789Z",
        "size": 2156
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

1. **No Server Restarts**: CSV file updates are automatically detected and loaded
2. **Efficient Caching**: Data is cached for 5 minutes to avoid excessive file I/O
3. **Manual Control**: Force refresh capability for immediate updates
4. **Monitoring**: Status endpoints for debugging and monitoring
5. **Consistent API**: Same dynamic behavior for both rivers and lakes data

## Testing

Run the included test file to verify the functionality:

```bash
node test-dynamic-reload.js
```

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

## Notes

- The 5-minute cache timeout can be adjusted by modifying the `cacheTimeout` property in the controllers
- File modification checking ensures immediate updates when CSV files change
- All existing API endpoints continue to work exactly as before, but now with dynamic data loading
- ES6 modules are now used consistently throughout the project
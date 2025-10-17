@echo off
echo 🚀 Starting PXWeb API Server with PM2...

REM Ensure logs directory exists
if not exist "logs" mkdir logs

REM Install PM2 globally if not already installed
pm2 --version >nul 2>&1
if errorlevel 1 (
    echo Installing PM2 globally...
    npm install -g pm2
)

REM Delete any existing processes
pm2 delete ecosystem.config.js >nul 2>&1

REM Start the application
pm2 start ecosystem.config.js --env production

REM Save PM2 process list
pm2 save

echo ✅ PXWeb API Server started successfully!
echo.
echo 📊 Useful PM2 commands:
echo   pm2 status          - Show process status
echo   pm2 logs            - Show logs
echo   pm2 monit           - Monitor processes
echo   pm2 restart all     - Restart all processes
echo   pm2 reload all      - Reload all processes (0-downtime)
echo   pm2 stop all        - Stop all processes
echo.
echo 🌐 Server should be running at:
echo   http://localhost:3000
echo   http://192.168.1.27:3000

pause
@echo off
echo ==========================================
echo Property Maintenance Market Analysis Dashboard
echo ==========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo X Python is not installed. Please install Python 3.8 or higher.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo X Node.js is not installed. Please install Node.js 14.x or higher.
    pause
    exit /b 1
)

echo [OK] Python and Node.js are installed
echo.

REM Setup backend
echo Setting up backend...
cd backend

if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing backend dependencies...
pip install -q -r requirements.txt

echo [OK] Backend setup complete
echo.

REM Setup frontend
echo Setting up frontend...
cd ..\frontend

if not exist "node_modules" (
    echo Installing frontend dependencies (this may take a few minutes)...
    call npm install
)

echo [OK] Frontend setup complete
echo.

REM Start services
echo Starting services...
echo.

REM Start backend
cd ..\backend
call venv\Scripts\activate.bat
echo Starting Flask backend on http://localhost:5000
start "Backend Server" cmd /k python app.py

REM Wait for backend to start
timeout /t 5 /nobreak >nul

REM Start frontend
cd ..\frontend
echo Starting React frontend on http://localhost:3000
start "Frontend Server" cmd /k npm start

echo.
echo ==========================================
echo [OK] Dashboard is starting!
echo ==========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Two new command windows have opened.
echo Close them to stop the services.
echo.
pause

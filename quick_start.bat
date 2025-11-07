@echo off
echo ========================================
echo Customer Churn Prediction - Quick Start
echo ========================================
echo.

echo Step 1: Installing dependencies...
pip install -r requirements_5features.txt
echo.

echo Step 2: Training the 5-feature model...
python train_5_features_model.py
echo.

echo Step 3: Testing the model...
timeout /t 2 /nobreak >nul
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the API server:
echo   cd employee-insight-portal\backend
echo   uvicorn app:app --reload --port 8000
echo.
echo Then open: prediction_dashboard.html
echo.
pause

# Getting Started - 5-Feature Churn Prediction

## 🎯 What You'll Build

A complete churn prediction system that:
- Takes **5 simple inputs** from a web form
- Predicts if a customer will churn
- Shows risk level (Low/Medium/High)
- Provides actionable retention suggestions

## ⚡ Quick Start (5 Minutes)

### Step 1: Install Dependencies (1 min)

```bash
pip install -r requirements_5features.txt
```

This installs:
- pandas, numpy, scikit-learn (ML)
- fastapi, uvicorn (API server)
- imbalanced-learn (data balancing)

### Step 2: Train the Model (2 min)

```bash
python train_5_features_model.py
```

You'll see:
```
Loading data...
Original shape: (7043, 21)
After cleaning: (7032, 20)

Selected Features: ['tenure', 'MonthlyCharges', 'TotalCharges', 'Contract', 'InternetService']

Training Random Forest model...

=== Model Performance ===
Accuracy: 0.8012
ROC-AUC Score: 0.8456

✓ Model saved to models/churn_model_5features.pkl
✓ Scaler saved to models/scaler_5features.pkl
✓ Label encoders saved to models/label_encoders_5features.pkl

✓ Training complete!
```

### Step 3: Start the API Server (1 min)

```bash
cd employee-insight-portal/backend
uvicorn app:app --reload --port 8000
```

You'll see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

Keep this terminal open!

### Step 4: Open the Dashboard (1 min)

Open `prediction_dashboard.html` in your browser:
- **Windows**: Double-click the file or `start prediction_dashboard.html`
- **Mac**: `open prediction_dashboard.html`
- **Linux**: `xdg-open prediction_dashboard.html`

## 🎮 Try It Out!

### Test Case 1: High Risk Customer

Fill in the form:
- **Customer ID**: TEST-001
- **Tenure**: 2 months
- **Monthly Charges**: $85
- **Total Charges**: $170
- **Contract**: Month-to-month
- **Internet Service**: Fiber optic

Click "Predict Churn Risk"

**Expected Result**: 🔴 High Risk (~75% churn probability)

### Test Case 2: Low Risk Customer

Fill in the form:
- **Customer ID**: TEST-002
- **Tenure**: 48 months
- **Monthly Charges**: $45
- **Total Charges**: $2160
- **Contract**: Two year
- **Internet Service**: DSL

Click "Predict Churn Risk"

**Expected Result**: 🟢 Low Risk (~15% churn probability)

## 📋 Understanding the Inputs

### 1. Customer ID
- **What**: Unique identifier for the customer
- **Example**: CUST-12345, ABC-001, etc.
- **Note**: Can be any text, used for tracking only

### 2. Tenure (months)
- **What**: How long the customer has been with the company
- **Range**: 0-72 months
- **Examples**:
  - 2 = New customer (2 months)
  - 24 = 2 years
  - 48 = 4 years (loyal customer)

### 3. Monthly Charges ($)
- **What**: How much the customer pays per month
- **Range**: $18-$120
- **Examples**:
  - $25 = Basic plan
  - $70 = Standard plan
  - $100 = Premium plan

### 4. Total Charges ($)
- **What**: Total amount the customer has paid
- **Range**: $18-$9000
- **Calculation**: Approximately tenure × monthly_charges
- **Examples**:
  - $170 = 2 months × $85
  - $2160 = 48 months × $45

### 5. Contract Type
- **Options**:
  - **Month-to-month**: No commitment, highest churn risk
  - **One year**: 1-year contract, medium risk
  - **Two year**: 2-year contract, lowest risk

### 6. Internet Service
- **Options**:
  - **DSL**: Digital Subscriber Line, stable
  - **Fiber optic**: High-speed, but higher churn
  - **No**: No internet service

## 🎨 Understanding the Results

### Prediction
- **No Churn**: Customer likely to stay
- **Churn**: Customer likely to leave

### Probability
- **0-40%**: Low risk (green)
- **40-70%**: Medium risk (yellow)
- **70-100%**: High risk (red)

### Suggestions
Personalized recommendations based on:
- Contract type
- Pricing
- Tenure
- Service type
- Risk level

## 🔧 Troubleshooting

### Problem: "Model file not found"
**Solution**: Run `python train_5_features_model.py` first

### Problem: "Could not connect to API"
**Solution**: 
1. Check if API server is running
2. Look for "Uvicorn running on http://127.0.0.1:8000"
3. Restart with: `uvicorn app:app --reload --port 8000`

### Problem: "Invalid input"
**Solution**: Check that:
- Tenure is 0-72
- Monthly Charges is 18-120
- Total Charges is 18-9000
- Contract and Internet Service are selected

### Problem: CORS error
**Solution**: 
1. Make sure API is running on port 8000
2. Open dashboard from file system (not a web server)
3. Check browser console for specific error

### Problem: Wrong predictions
**Solution**:
1. Verify model was trained successfully
2. Check that all 3 pickle files exist in `models/` folder
3. Retrain model if needed

## 📊 API Testing

### Using Python
```python
import requests

response = requests.post('http://localhost:8000/predict', json={
    "customer_id": "TEST-001",
    "tenure": 12,
    "monthly_charges": 70.0,
    "total_charges": 840.0,
    "contract": "Month-to-month",
    "internet_service": "Fiber optic"
})

print(response.json())
```

### Using curl
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "TEST-001",
    "tenure": 12,
    "monthly_charges": 70.0,
    "total_charges": 840.0,
    "contract": "Month-to-month",
    "internet_service": "Fiber optic"
  }'
```

### Using test script
```bash
python test_prediction.py
```

## 🚀 Next Steps

### 1. Customize Suggestions
Edit `employee-insight-portal/backend/routes/predict.py`:
```python
def get_retention_suggestions(customer_data: dict, probability: float) -> list:
    suggestions = []
    # Add your custom logic here
    return suggestions
```

### 2. Change Risk Thresholds
Edit `employee-insight-portal/backend/routes/predict.py`:
```python
def get_risk_level(probability: float) -> str:
    if probability >= 0.7:  # Adjust this
        return "High Risk"
    # ...
```

### 3. Customize Dashboard
Edit `prediction_dashboard.html`:
- Change colors in `<style>` section
- Modify form fields
- Add company branding

### 4. Deploy to Production
- Host API on cloud server (AWS, Azure, Heroku)
- Deploy dashboard to web hosting
- Update API_URL in dashboard

## 📚 Additional Resources

- **Full Setup Guide**: [5_FEATURES_SETUP.md](5_FEATURES_SETUP.md)
- **System Architecture**: [WORKFLOW.md](WORKFLOW.md)
- **Project Summary**: [SUMMARY.md](SUMMARY.md)
- **Main README**: [README.md](README.md)

## ✅ Checklist

Before you start:
- [ ] Python 3.7+ installed
- [ ] pip installed
- [ ] data.csv file present

After setup:
- [ ] Dependencies installed
- [ ] Model trained (3 .pkl files in models/)
- [ ] API server running on port 8000
- [ ] Dashboard opens in browser
- [ ] Test prediction works

## 🎉 You're Ready!

You now have a complete churn prediction system. Try different inputs and see how the predictions change!

**Pro Tip**: Start with the test cases above to understand how different features affect churn probability.

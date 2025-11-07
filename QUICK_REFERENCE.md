# Quick Reference Card - 5-Feature Churn Prediction

## 🚀 Commands

```bash
# Install dependencies
pip install -r requirements_5features.txt

# Train model
python train_5_features_model.py

# Start API server
cd employee-insight-portal/backend
uvicorn app:app --reload --port 8000

# Test API
python test_prediction.py

# Open dashboard
start prediction_dashboard.html
```

## 📝 The 5 Features

| # | Feature | Type | Range | Example |
|---|---------|------|-------|---------|
| 1 | **tenure** | Number | 0-72 | 12 |
| 2 | **monthly_charges** | Number | 18-120 | 70.0 |
| 3 | **total_charges** | Number | 18-9000 | 840.0 |
| 4 | **contract** | Text | 3 options | "Month-to-month" |
| 5 | **internet_service** | Text | 3 options | "Fiber optic" |

### Contract Options
- `"Month-to-month"` - No commitment
- `"One year"` - 1-year contract
- `"Two year"` - 2-year contract

### Internet Service Options
- `"DSL"` - Digital Subscriber Line
- `"Fiber optic"` - High-speed fiber
- `"No"` - No internet service

## 🎯 API Endpoint

**URL**: `http://localhost:8000/predict`
**Method**: `POST`
**Content-Type**: `application/json`

### Request
```json
{
  "customer_id": "CUST-12345",
  "tenure": 12,
  "monthly_charges": 70.0,
  "total_charges": 840.0,
  "contract": "Month-to-month",
  "internet_service": "Fiber optic"
}
```

### Response
```json
{
  "customer_id": "CUST-12345",
  "prediction": 1,
  "prediction_label": "Churn",
  "probability": 0.756,
  "status": "High Risk",
  "suggestions": ["..."],
  "input_features": {...}
}
```

## 🎨 Risk Levels

| Probability | Status | Color | Action |
|-------------|--------|-------|--------|
| 0-40% | Low Risk | 🟢 Green | Regular engagement |
| 40-70% | Medium Risk | 🟡 Yellow | Proactive call |
| 70-100% | High Risk | 🔴 Red | Urgent contact |

## 📁 File Locations

```
project/
├── train_5_features_model.py          ← Train model
├── prediction_dashboard.html          ← Web UI
├── test_prediction.py                 ← Test script
├── data.csv                           ← Training data
├── models/
│   ├── churn_model_5features.pkl      ← Trained model
│   ├── scaler_5features.pkl           ← Feature scaler
│   └── label_encoders_5features.pkl   ← Encoders
└── employee-insight-portal/backend/
    └── routes/predict.py              ← API endpoint
```

## 🔧 Common Issues

| Problem | Solution |
|---------|----------|
| Model not found | Run `train_5_features_model.py` |
| API connection error | Start server on port 8000 |
| Invalid input | Check value ranges |
| CORS error | Open HTML from file system |

## 📊 Test Cases

### High Risk
```json
{
  "customer_id": "TEST-001",
  "tenure": 2,
  "monthly_charges": 85.0,
  "total_charges": 170.0,
  "contract": "Month-to-month",
  "internet_service": "Fiber optic"
}
```
**Expected**: ~75% churn probability

### Low Risk
```json
{
  "customer_id": "TEST-002",
  "tenure": 48,
  "monthly_charges": 45.0,
  "total_charges": 2160.0,
  "contract": "Two year",
  "internet_service": "DSL"
}
```
**Expected**: ~15% churn probability

## 💻 Code Snippets

### Python Request
```python
import requests

response = requests.post(
    'http://localhost:8000/predict',
    json={
        "customer_id": "CUST-001",
        "tenure": 12,
        "monthly_charges": 70.0,
        "total_charges": 840.0,
        "contract": "Month-to-month",
        "internet_service": "Fiber optic"
    }
)
print(response.json())
```

### JavaScript Request
```javascript
fetch('http://localhost:8000/predict', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        customer_id: "CUST-001",
        tenure: 12,
        monthly_charges: 70.0,
        total_charges: 840.0,
        contract: "Month-to-month",
        internet_service: "Fiber optic"
    })
})
.then(r => r.json())
.then(data => console.log(data));
```

### curl Request
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "CUST-001",
    "tenure": 12,
    "monthly_charges": 70.0,
    "total_charges": 840.0,
    "contract": "Month-to-month",
    "internet_service": "Fiber optic"
  }'
```

## 🎓 Model Details

- **Algorithm**: Random Forest
- **Trees**: 200
- **Max Depth**: 10
- **Features**: 5
- **Accuracy**: ~80%
- **ROC-AUC**: ~0.85

## 📚 Documentation

- **Setup Guide**: `5_FEATURES_SETUP.md`
- **Getting Started**: `GETTING_STARTED.md`
- **Architecture**: `WORKFLOW.md`
- **Comparison**: `COMPARISON.md`
- **Summary**: `SUMMARY.md`

## ⚙️ Customization

### Change Risk Thresholds
```python
# In predict.py
def get_risk_level(probability: float) -> str:
    if probability >= 0.7:  # Change this
        return "High Risk"
    elif probability >= 0.4:  # Change this
        return "Medium Risk"
    else:
        return "Low Risk"
```

### Add Custom Suggestion
```python
# In predict.py
def get_retention_suggestions(...):
    suggestions = []
    if customer_data['tenure'] < 6:
        suggestions.append("Your custom message")
    return suggestions
```

### Modify Dashboard Colors
```css
/* In prediction_dashboard.html */
.high-risk {
    background: #f8d7da;  /* Change this */
    border: 2px solid #dc3545;
}
```

## 🔍 Debugging

### Check API Status
```bash
curl http://localhost:8000/health
```

### View API Docs
Open: `http://localhost:8000/docs`

### Check Model Files
```bash
dir models\*.pkl
```

Should show:
- `churn_model_5features.pkl`
- `scaler_5features.pkl`
- `label_encoders_5features.pkl`

## 📞 Support Checklist

Before asking for help:
- [ ] Ran `train_5_features_model.py`
- [ ] 3 .pkl files exist in `models/`
- [ ] API server is running
- [ ] Port 8000 is not in use
- [ ] Input values are in valid ranges
- [ ] Checked browser console for errors

## 🎯 Success Indicators

✅ Model training completes without errors
✅ API returns 200 status code
✅ Dashboard displays prediction
✅ Risk level shows correct color
✅ Suggestions are relevant

---

**Print this page for quick reference!**

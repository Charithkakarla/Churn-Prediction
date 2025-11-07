# 5-Feature Churn Prediction Workflow

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    TRAINING PHASE                            │
└─────────────────────────────────────────────────────────────┘

data.csv (7,043 customers, 21 features)
    │
    ▼
┌─────────────────────────────────────┐
│  train_5_features_model.py          │
│  • Select 5 key features            │
│  • Encode categorical variables     │
│  • Apply SMOTE for balance          │
│  • Train Random Forest              │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│  Saved Models (models/)             │
│  • churn_model_5features.pkl        │
│  • scaler_5features.pkl             │
│  • label_encoders_5features.pkl     │
└─────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────┐
│                   PREDICTION PHASE                           │
└─────────────────────────────────────────────────────────────┘

prediction_dashboard.html
    │
    │ User enters 5 features:
    │ • Tenure
    │ • Monthly Charges
    │ • Total Charges
    │ • Contract Type
    │ • Internet Service
    │
    ▼
┌─────────────────────────────────────┐
│  HTTP POST Request                  │
│  → http://localhost:8000/predict    │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│  FastAPI Backend                    │
│  (employee-insight-portal/backend)  │
│                                     │
│  routes/predict.py:                 │
│  1. Load model & preprocessors      │
│  2. Encode categorical features     │
│  3. Scale numerical features        │
│  4. Make prediction                 │
│  5. Calculate probability           │
│  6. Generate suggestions            │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│  JSON Response                      │
│  {                                  │
│    "customer_id": "...",            │
│    "prediction": 0 or 1,            │
│    "probability": 0.756,            │
│    "status": "High Risk",           │
│    "suggestions": [...]             │
│  }                                  │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│  Dashboard Display                  │
│  • Risk level (color-coded)         │
│  • Churn probability                │
│  • Retention suggestions            │
└─────────────────────────────────────┘
```

## 🔄 Data Flow

### Input Features (5)
```
┌──────────────────┬──────────────┬─────────────────┐
│ Feature          │ Type         │ Range/Values    │
├──────────────────┼──────────────┼─────────────────┤
│ tenure           │ Numeric      │ 0-72 months     │
│ monthly_charges  │ Numeric      │ $18-$120        │
│ total_charges    │ Numeric      │ $18-$9000       │
│ contract         │ Categorical  │ 3 types         │
│ internet_service │ Categorical  │ 3 types         │
└──────────────────┴──────────────┴─────────────────┘
```

### Preprocessing Steps
```
1. Encode Categorical
   contract → [0, 1, 2]
   internet_service → [0, 1, 2]

2. Create Feature Vector
   [tenure, monthly_charges, total_charges, contract_encoded, internet_encoded]

3. Scale Features
   StandardScaler: (X - mean) / std

4. Predict
   Random Forest → probability
```

### Output
```
┌─────────────────┬──────────────────────────────────┐
│ Field           │ Description                      │
├─────────────────┼──────────────────────────────────┤
│ prediction      │ 0 (No Churn) or 1 (Churn)        │
│ probability     │ 0.0 to 1.0                       │
│ status          │ Low/Medium/High Risk             │
│ suggestions     │ List of retention actions        │
└─────────────────┴──────────────────────────────────┘
```

## 🎯 Risk Level Logic

```python
if probability >= 0.7:
    status = "High Risk"      # 🔴 Red
elif probability >= 0.4:
    status = "Medium Risk"    # 🟡 Yellow
else:
    status = "Low Risk"       # 🟢 Green
```

## 💡 Suggestion Generation

```python
Suggestions based on:
├─ Contract Type
│  └─ Month-to-month → Offer long-term contract
├─ Monthly Charges
│  └─ > $70 → Review pricing plan
├─ Tenure
│  └─ < 12 months → Provide onboarding support
├─ Internet Service
│  └─ Fiber optic → Ensure service quality
└─ Probability
   ├─ >= 0.7 → URGENT contact needed
   └─ >= 0.4 → Schedule satisfaction call
```

## 🚀 Deployment Options

### Option 1: Local Development
```bash
# Terminal 1: Start API
cd employee-insight-portal/backend
uvicorn app:app --reload --port 8000

# Terminal 2: Open dashboard
start prediction_dashboard.html
```

### Option 2: Production
```bash
# Use production ASGI server
uvicorn app:app --host 0.0.0.0 --port 8000 --workers 4

# Deploy dashboard to web server
# Update API_URL in prediction_dashboard.html
```

## 📊 Model Performance

```
Training Data: 5,634 samples (80%)
Testing Data:  1,409 samples (20%)

Features: 5 (reduced from 19)
Algorithm: Random Forest (200 trees)
Class Balance: SMOTE applied

Expected Performance:
├─ Accuracy: ~80%
├─ Precision: ~75%
├─ Recall: ~70%
└─ ROC-AUC: ~0.85
```

## 🔧 Customization Points

1. **Model Parameters** (`train_5_features_model.py`)
   - n_estimators
   - max_depth
   - random_state

2. **Risk Thresholds** (`predict.py`)
   - High risk: >= 0.7
   - Medium risk: >= 0.4

3. **Suggestions** (`predict.py`)
   - Add custom business rules
   - Integrate with CRM

4. **UI Styling** (`prediction_dashboard.html`)
   - Colors
   - Layout
   - Branding

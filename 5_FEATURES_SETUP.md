# Customer Churn Prediction - 5 Features Model

This simplified version uses only **5 key features** for churn prediction, making it easier to collect input data and make predictions.

## 📊 The 5 Key Features

1. **Tenure** (months) - How long the customer has been with the company (0-72)
2. **Monthly Charges** ($) - Monthly bill amount (18-120)
3. **Total Charges** ($) - Total amount charged over time (18-9000)
4. **Contract Type** - Type of contract:
   - Month-to-month
   - One year
   - Two year
5. **Internet Service** - Type of internet service:
   - DSL
   - Fiber optic
   - No

## 🚀 Quick Start

### Step 1: Train the Model

First, train the simplified model with 5 features:

```bash
python train_5_features_model.py
```

This will:
- Load and preprocess the data
- Train a Random Forest model using only 5 features
- Save the model to `models/churn_model_5features.pkl`
- Save the scaler to `models/scaler_5features.pkl`
- Save label encoders to `models/label_encoders_5features.pkl`

### Step 2: Start the API Server

Navigate to the backend directory and start the FastAPI server:

```bash
cd employee-insight-portal/backend
uvicorn app:app --reload --port 8000
```

### Step 3: Open the Prediction Dashboard

Open `prediction_dashboard.html` in your web browser. You can:
- Double-click the file, or
- Open it with: `start prediction_dashboard.html` (Windows)

## 📝 Using the Dashboard

1. **Enter Customer ID** - Any unique identifier
2. **Tenure** - Number of months (0-72)
3. **Monthly Charges** - Monthly bill ($18-$120)
4. **Total Charges** - Total amount charged ($18-$9000)
5. **Contract Type** - Select from dropdown
6. **Internet Service** - Select from dropdown
7. Click **"Predict Churn Risk"**

## 🎯 Example Inputs

### High Risk Customer
- Tenure: 2 months
- Monthly Charges: $85
- Total Charges: $170
- Contract: Month-to-month
- Internet Service: Fiber optic

### Low Risk Customer
- Tenure: 48 months
- Monthly Charges: $45
- Total Charges: $2160
- Contract: Two year
- Internet Service: DSL

## 🔌 API Endpoint

### POST `/predict`

**Request Body:**
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

**Response:**
```json
{
  "customer_id": "CUST-12345",
  "prediction": 1,
  "prediction_label": "Churn",
  "probability": 0.756,
  "status": "High Risk",
  "suggestions": [
    "Offer long-term contract with discount",
    "Review pricing plan - consider offering discount",
    "Fiber optic users have higher churn - ensure service quality",
    "URGENT: Contact customer immediately with retention offer"
  ],
  "input_features": {
    "tenure": 12,
    "monthly_charges": 70.0,
    "total_charges": 840.0,
    "contract": "Month-to-month",
    "internet_service": "Fiber optic"
  }
}
```

## 📦 Required Dependencies

Make sure you have these installed:

```bash
pip install pandas numpy scikit-learn imbalanced-learn fastapi uvicorn
```

## 🎨 Risk Levels

- **Low Risk** (< 40% probability) - Green
- **Medium Risk** (40-70% probability) - Yellow
- **High Risk** (> 70% probability) - Red

## 🔧 Troubleshooting

### Model not found error
- Make sure you ran `train_5_features_model.py` first
- Check that `models/` directory exists with the 3 pickle files

### API connection error
- Ensure the FastAPI server is running on port 8000
- Check the console for any error messages

### CORS error
- The API is configured to allow requests from localhost
- Make sure you're opening the HTML file in a browser

## 📈 Model Performance

The 5-feature model maintains good performance while being much simpler:
- Uses only 5 features instead of 19
- Faster predictions
- Easier data collection
- Still captures the most important churn indicators

## 💡 Why These 5 Features?

These features were selected because they:
1. **Tenure** - Strong indicator of customer loyalty
2. **Monthly Charges** - High bills correlate with churn
3. **Total Charges** - Reflects overall customer value
4. **Contract** - Month-to-month contracts have highest churn
5. **Internet Service** - Fiber optic users show different churn patterns

Together, these 5 features capture the most important aspects of customer behavior for churn prediction.

# Customer Churn Prediction

## 🎯 Two Versions Available

### 1. Full Model (19 Features)
Complete analysis using all available features from the dataset.

### 2. **Simplified Model (5 Features)** ⭐ RECOMMENDED
Streamlined version using only the 5 most important features for easier predictions.

## 🚀 Quick Start - 5 Feature Model

The simplified model uses only **5 key features** making it perfect for production use:

1. **Tenure** - Months with company
2. **Monthly Charges** - Monthly bill amount
3. **Total Charges** - Total amount charged
4. **Contract Type** - Month-to-month, One year, or Two year
5. **Internet Service** - DSL, Fiber optic, or No

### Setup in 3 Steps:

```bash
# 1. Install dependencies
pip install -r requirements_5features.txt

# 2. Train the model
python train_5_features_model.py

# 3. Start the API server
cd employee-insight-portal/backend
uvicorn app:app --reload --port 8000
```

Then open `prediction_dashboard.html` in your browser!

📖 **Full instructions:** See [5_FEATURES_SETUP.md](5_FEATURES_SETUP.md)

## 📊 What We Did

### Full Model (19 Features)
1. **Data Loading & Exploration**
   - Loaded telecom customer dataset (7,043 records, 21 features)
   - Performed exploratory data analysis and visualizations

2. **Data Preprocessing**
   - Encoded categorical variables using LabelEncoder
   - Split data into train/test sets (80/20 split)
   - Applied SMOTE to handle class imbalance
   - Scaled features using StandardScaler

3. **Machine Learning Models**
   - **Logistic Regression** (max_iter=1000)
   - **Random Forest Classifier** (n_estimators=200)

4. **Model Evaluation**
   - Accuracy scores
   - Classification reports
   - Confusion matrices
   - ROC curves and AUC scores

### Simplified Model (5 Features)
- Selected 5 most predictive features
- Trained Random Forest classifier
- Created REST API for predictions
- Built interactive web dashboard
- Provides retention suggestions

## 🛠️ Tools & Libraries Used

- **pandas** - Data manipulation
- **numpy** - Numerical operations
- **matplotlib & seaborn** - Data visualization
- **scikit-learn** - ML models and preprocessing
- **imbalanced-learn** - SMOTE for class balancing
- **FastAPI** - REST API server
- **uvicorn** - ASGI server

## 📁 Files

### Full Model
- `Customer_Churn_Prediction_Simple_Advanced.ipynb` - Complete analysis notebook
- `data.csv` - Original dataset

### Simplified Model (5 Features)
- `train_5_features_model.py` - Train the simplified model
- `prediction_dashboard.html` - Interactive web dashboard
- `test_prediction.py` - API testing script
- `5_FEATURES_SETUP.md` - Detailed setup guide
- `requirements_5features.txt` - Python dependencies
- `quick_start.bat` - Automated setup script (Windows)
- `employee-insight-portal/backend/routes/predict.py` - Prediction API

## 🎨 Prediction Dashboard Features

- ✅ Simple 5-field input form
- ✅ Real-time churn prediction
- ✅ Risk level visualization (Low/Medium/High)
- ✅ Personalized retention suggestions
- ✅ Clean, modern UI

## 📈 Example Prediction

**Input:**
- Tenure: 2 months
- Monthly Charges: $85
- Total Charges: $170
- Contract: Month-to-month
- Internet Service: Fiber optic

**Output:**
- Prediction: Churn
- Probability: 75.6%
- Risk Level: High Risk
- Suggestions: Offer long-term contract, review pricing, urgent contact needed
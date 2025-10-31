# Customer Churn Prediction

## What We Did

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

## Tools & Libraries Used

- **pandas** - Data manipulation
- **numpy** - Numerical operations
- **matplotlib & seaborn** - Data visualization
- **scikit-learn** - ML models and preprocessing
- **imbalanced-learn** - SMOTE for class balancing

## Files

- `Customer_Churn_Prediction_Simple_Advanced.ipynb` - Main notebook
- `data.csv` - Dataset
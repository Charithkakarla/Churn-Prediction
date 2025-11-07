"""
Customer Churn Prediction - 5 Key Features Model
This script trains a simplified churn prediction model using only 5 most important features.
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import accuracy_score, classification_report, roc_auc_score
from sklearn.ensemble import RandomForestClassifier
from imblearn.over_sampling import SMOTE
import pickle
import os

# Load dataset
print("Loading data...")
df = pd.read_csv('data.csv')
print(f'Original shape: {df.shape}')

# Data preprocessing
df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')
df.dropna(inplace=True)
df.drop('customerID', axis=1, inplace=True)
print(f'After cleaning: {df.shape}')

# Select only 5 most important features
# These are the most predictive features for churn:
# 1. tenure - How long customer has been with company
# 2. MonthlyCharges - Monthly bill amount
# 3. TotalCharges - Total amount charged
# 4. Contract - Type of contract (Month-to-month, One year, Two year)
# 5. InternetService - Type of internet service (DSL, Fiber optic, No)

selected_features = ['tenure', 'MonthlyCharges', 'TotalCharges', 'Contract', 'InternetService']
target = 'Churn'

# Create simplified dataset
df_simple = df[selected_features + [target]].copy()
print(f'\nSelected Features: {selected_features}')
print(f'Shape: {df_simple.shape}')

# Encode categorical variables
le_contract = LabelEncoder()
le_internet = LabelEncoder()
le_churn = LabelEncoder()

df_simple['Contract'] = le_contract.fit_transform(df_simple['Contract'])
df_simple['InternetService'] = le_internet.fit_transform(df_simple['InternetService'])
df_simple['Churn'] = le_churn.fit_transform(df_simple['Churn'])

print('\nContract mapping:', dict(zip(le_contract.classes_, le_contract.transform(le_contract.classes_))))
print('InternetService mapping:', dict(zip(le_internet.classes_, le_internet.transform(le_internet.classes_))))

# Split data
X = df_simple.drop('Churn', axis=1)
y = df_simple['Churn']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
print(f'\nTrain shape: {X_train.shape}, Test shape: {X_test.shape}')

# Handle class imbalance with SMOTE
print("\nApplying SMOTE...")
sm = SMOTE(random_state=42)
X_train_res, y_train_res = sm.fit_resample(X_train, y_train)
print(f'After SMOTE: {X_train_res.shape}')

# Scale features
print("Scaling features...")
scaler = StandardScaler()
X_train_res = scaler.fit_transform(X_train_res)
X_test_scaled = scaler.transform(X_test)

# Train Random Forest model
print("\nTraining Random Forest model...")
rf = RandomForestClassifier(n_estimators=200, random_state=42, max_depth=10)
rf.fit(X_train_res, y_train_res)

# Predictions
y_pred = rf.predict(X_test_scaled)
y_pred_proba = rf.predict_proba(X_test_scaled)[:, 1]

# Evaluation
print('\n=== Model Performance ===')
print(f'Accuracy: {accuracy_score(y_test, y_pred):.4f}')
print(f'ROC-AUC Score: {roc_auc_score(y_test, y_pred_proba):.4f}')
print('\nClassification Report:')
print(classification_report(y_test, y_pred))

# Feature Importance
feat_imp = pd.DataFrame({
    'feature': X.columns,
    'importance': rf.feature_importances_
}).sort_values('importance', ascending=False)

print('\nFeature Importance:')
print(feat_imp)

# Save model and preprocessing objects
print("\nSaving model and preprocessing objects...")
os.makedirs('models', exist_ok=True)

# Save model
with open('models/churn_model_5features.pkl', 'wb') as f:
    pickle.dump(rf, f)

# Save scaler
with open('models/scaler_5features.pkl', 'wb') as f:
    pickle.dump(scaler, f)

# Save label encoders
with open('models/label_encoders_5features.pkl', 'wb') as f:
    pickle.dump({
        'contract': le_contract,
        'internet': le_internet,
        'churn': le_churn
    }, f)

print('✓ Model saved to models/churn_model_5features.pkl')
print('✓ Scaler saved to models/scaler_5features.pkl')
print('✓ Label encoders saved to models/label_encoders_5features.pkl')

# Test prediction with sample data
print("\n=== Sample Prediction Test ===")
sample_data = pd.DataFrame({
    'tenure': [12],
    'MonthlyCharges': [70.0],
    'TotalCharges': [840.0],
    'Contract': [0],  # Month-to-month
    'InternetService': [1]  # Fiber optic
})

sample_scaled = scaler.transform(sample_data)
prediction = rf.predict(sample_scaled)[0]
probability = rf.predict_proba(sample_scaled)[0][1]

print(f'Input: {sample_data.to_dict("records")[0]}')
print(f'Prediction: {"Churn" if prediction == 1 else "No Churn"}')
print(f'Churn Probability: {probability:.2%}')

print("\n✓ Training complete!")

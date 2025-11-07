"""
Train a churn prediction model using the top 5 most important features
Based on feature importance analysis of telecom customer data
"""
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import pickle
import os

print("="*60)
print("TRAINING CHURN MODEL WITH TOP 5 FEATURES")
print("="*60)

# Load data
print("\n1. Loading data...")
df = pd.read_csv('data.csv')
print(f"   Loaded {len(df)} records")

# Drop customerID
df = df.drop('customerID', axis=1)

# Handle TotalCharges
df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')
df['TotalCharges'].fillna(df['TotalCharges'].median(), inplace=True)

# Encode target
df['Churn'] = df['Churn'].map({'Yes': 1, 'No': 0})

print("\n2. Selecting top 5 most important features...")
# Based on typical telecom churn analysis, these are the most predictive:
# 1. Contract (month-to-month has highest churn)
# 2. tenure (new customers churn more)
# 3. TotalCharges (related to tenure and value)
# 4. MonthlyCharges (price sensitivity)
# 5. InternetService (fiber optic users churn more)

selected_features = ['tenure', 'MonthlyCharges', 'TotalCharges', 'Contract', 'InternetService']
print(f"   Selected features: {selected_features}")

# Create feature dataframe
X = df[selected_features].copy()
y = df['Churn']

# Encode categorical variables
print("\n3. Encoding categorical variables...")
label_encoders = {}

# Encode Contract
le_contract = LabelEncoder()
X['Contract'] = le_contract.fit_transform(X['Contract'])
label_encoders['contract'] = le_contract
print(f"   Contract mapping: {dict(zip(le_contract.classes_, le_contract.transform(le_contract.classes_)))}")

# Encode InternetService
le_internet = LabelEncoder()
X['InternetService'] = le_internet.fit_transform(X['InternetService'])
label_encoders['internet'] = le_internet
print(f"   InternetService mapping: {dict(zip(le_internet.classes_, le_internet.transform(le_internet.classes_)))}")

# Split data
print("\n4. Splitting data...")
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
print(f"   Training set: {len(X_train)} samples")
print(f"   Test set: {len(X_test)} samples")

# Scale features
print("\n5. Scaling features...")
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train model
print("\n6. Training Random Forest model...")
model = RandomForestClassifier(
    n_estimators=100,
    max_depth=10,
    min_samples_split=20,
    min_samples_leaf=10,
    random_state=42,
    class_weight='balanced'
)
model.fit(X_train_scaled, y_train)
print("   Model trained successfully!")

# Evaluate
print("\n7. Evaluating model...")
y_pred = model.predict(X_test_scaled)
accuracy = accuracy_score(y_test, y_pred)
print(f"   Accuracy: {accuracy:.3f}")

print("\n   Classification Report:")
print(classification_report(y_test, y_pred, target_names=['No Churn', 'Churn']))

print("\n   Confusion Matrix:")
cm = confusion_matrix(y_test, y_pred)
print(f"   True Negatives: {cm[0][0]}, False Positives: {cm[0][1]}")
print(f"   False Negatives: {cm[1][0]}, True Positives: {cm[1][1]}")

# Feature importance
print("\n8. Feature Importance:")
feature_imp = pd.DataFrame({
    'feature': selected_features,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)
print(feature_imp.to_string(index=False))

# Save model and preprocessing objects
print("\n9. Saving model and preprocessing objects...")
os.makedirs('employee-insight-portal/backend/models', exist_ok=True)

with open('employee-insight-portal/backend/models/churn_model_5features.pkl', 'wb') as f:
    pickle.dump(model, f)
print("   ✓ Model saved")

with open('employee-insight-portal/backend/models/scaler_5features.pkl', 'wb') as f:
    pickle.dump(scaler, f)
print("   ✓ Scaler saved")

with open('employee-insight-portal/backend/models/label_encoders_5features.pkl', 'wb') as f:
    pickle.dump(label_encoders, f)
print("   ✓ Label encoders saved")

print("\n" + "="*60)
print("MODEL TRAINING COMPLETE!")
print("="*60)
print(f"\nModel Accuracy: {accuracy:.1%}")
print(f"Files saved in: employee-insight-portal/backend/models/")
print("\nYou can now use the prediction API!")
print("="*60)

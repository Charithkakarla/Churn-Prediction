import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import matplotlib.pyplot as plt

# Load data
df = pd.read_csv('data.csv')

# Drop customerID
df = df.drop('customerID', axis=1)

# Handle TotalCharges (convert to numeric)
df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')
df['TotalCharges'].fillna(df['TotalCharges'].median(), inplace=True)

# Encode target
df['Churn'] = df['Churn'].map({'Yes': 1, 'No': 0})

# Encode categorical variables
label_encoders = {}
categorical_cols = df.select_dtypes(include=['object']).columns

for col in categorical_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col].astype(str))
    label_encoders[col] = le

# Separate features and target
X = df.drop('Churn', axis=1)
y = df['Churn']

# Train Random Forest to get feature importance
rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X, y)

# Get feature importance
feature_importance = pd.DataFrame({
    'feature': X.columns,
    'importance': rf.feature_importances_
}).sort_values('importance', ascending=False)

print("\n" + "="*60)
print("TOP 10 MOST IMPORTANT FEATURES FOR CHURN PREDICTION")
print("="*60)
print(feature_importance.head(10).to_string(index=False))
print("="*60)

# Calculate correlation with Churn
correlations = df.corr()['Churn'].abs().sort_values(ascending=False)
print("\n" + "="*60)
print("TOP 10 FEATURES BY CORRELATION WITH CHURN")
print("="*60)
print(correlations.head(11).to_string())  # 11 because Churn itself is included
print("="*60)

# Recommend top 5 features
print("\n" + "="*60)
print("RECOMMENDED TOP 5 FEATURES FOR PREDICTION:")
print("="*60)
top_5 = feature_importance.head(5)['feature'].tolist()
for i, feature in enumerate(top_5, 1):
    importance = feature_importance[feature_importance['feature'] == feature]['importance'].values[0]
    print(f"{i}. {feature} (importance: {importance:.4f})")
print("="*60)

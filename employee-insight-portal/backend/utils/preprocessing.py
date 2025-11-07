import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler

# Global encoders and scaler (should match training)
label_encoders = {}
scaler = None

def preprocess_data(employee_data, fit=False):
    """
    Preprocess employee data for churn prediction.
    Uses only 5 key features for prediction.
    
    Args:
        employee_data: dict with 5 employee features
        fit: bool, whether to fit encoders/scaler (only during training)
    
    Returns:
        Preprocessed numpy array ready for model.predict()
    """
    # Convert to DataFrame if dict
    if isinstance(employee_data, dict):
        df = pd.DataFrame([employee_data])
    else:
        df = employee_data.copy()
    
    # Simple encoding for department
    dept_mapping = {
        'Sales': 0, 'Engineering': 1, 'HR': 2, 
        'Marketing': 3, 'Operations': 4
    }
    if 'department' in df.columns:
        df['department'] = df['department'].map(dept_mapping).fillna(0)
    
    # Only 5 features needed
    expected_features = [
        'tenure',
        'satisfaction_level', 
        'performance_score',
        'department',
        'monthly_salary'
    ]
    
    # Select only the 5 features
    X = df[expected_features]
    
    # Return as numpy array
    X_array = X.values.astype(float)
    
    return X_array


def get_feature_names():
    """Return the list of feature names used by the model"""
    return [
        'tenure',
        'satisfaction_level',
        'performance_score',
        'department',
        'monthly_salary'
    ]


def get_risk_level(probability):
    """Convert probability to risk level"""
    if probability >= 0.7:
        return "High Risk"
    elif probability >= 0.4:
        return "Medium Risk"
    else:
        return "Low Risk"


def get_retention_suggestions(employee_data, probability):
    """Generate retention suggestions based on employee data and churn probability"""
    suggestions = []
    
    if probability >= 0.7:
        suggestions.append("⚠️ Immediate intervention required")
        suggestions.append("Schedule 1-on-1 meeting with manager")
        suggestions.append("Review compensation and benefits")
    
    if employee_data.get('satisfaction_level', 1) < 0.5:
        suggestions.append("Address job satisfaction concerns")
        suggestions.append("Consider role adjustment or new projects")
    
    if employee_data.get('performance_score', 5) >= 4 and probability >= 0.5:
        suggestions.append("High performer at risk - prioritize retention")
        suggestions.append("Discuss career growth opportunities")
    
    if employee_data.get('tenure', 0) < 12:
        suggestions.append("New employee - improve onboarding experience")
    
    if employee_data.get('promotion_last_5years', 0) == 0 and employee_data.get('tenure', 0) > 24:
        suggestions.append("Consider promotion or career advancement")
    
    if not suggestions:
        suggestions.append("✓ Employee appears stable - maintain engagement")
    
    return suggestions

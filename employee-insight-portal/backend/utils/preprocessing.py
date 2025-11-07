import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler

# Global encoders and scaler (should match training)
label_encoders = {}
scaler = None

def preprocess_data(employee_data, fit=False):
    """
    Preprocess employee data for churn prediction.
    This must match the exact preprocessing used during model training.
    
    Args:
        employee_data: dict or DataFrame with employee features
        fit: bool, whether to fit encoders/scaler (only during training)
    
    Returns:
        Preprocessed numpy array ready for model.predict()
    """
    global label_encoders, scaler
    
    # Convert to DataFrame if dict
    if isinstance(employee_data, dict):
        df = pd.DataFrame([employee_data])
    else:
        df = employee_data.copy()
    
    # Expected features (adjust based on your training notebook)
    expected_features = [
        'tenure', 'monthly_salary', 'performance_score', 
        'satisfaction_level', 'last_evaluation', 'number_project',
        'average_monthly_hours', 'time_spend_company', 'work_accident',
        'promotion_last_5years', 'department', 'salary_level'
    ]
    
    # Categorical columns
    categorical_cols = ['department', 'salary_level']
    
    # Encode categorical variables
    for col in categorical_cols:
        if col in df.columns:
            if fit:
                label_encoders[col] = LabelEncoder()
                df[col] = label_encoders[col].fit_transform(df[col].astype(str))
            else:
                if col in label_encoders:
                    # Handle unseen categories
                    df[col] = df[col].astype(str)
                    df[col] = df[col].apply(
                        lambda x: label_encoders[col].transform([x])[0] 
                        if x in label_encoders[col].classes_ 
                        else 0
                    )
                else:
                    df[col] = 0
    
    # Select features in correct order
    available_features = [f for f in expected_features if f in df.columns]
    X = df[available_features]
    
    # Scale features
    if fit:
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
    else:
        if scaler is not None:
            X_scaled = scaler.transform(X)
        else:
            X_scaled = X.values
    
    return X_scaled


def get_feature_names():
    """Return the list of feature names used by the model"""
    return [
        'tenure', 'monthly_salary', 'performance_score', 
        'satisfaction_level', 'last_evaluation', 'number_project',
        'average_monthly_hours', 'time_spend_company', 'work_accident',
        'promotion_last_5years', 'department', 'salary_level'
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

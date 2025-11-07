from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pickle
import os
import pandas as pd

router = APIRouter()

# Load model and preprocessing objects
MODEL_PATH = "./models/churn_model_5features.pkl"
SCALER_PATH = "./models/scaler_5features.pkl"
ENCODERS_PATH = "./models/label_encoders_5features.pkl"

model = None
scaler = None
encoders = None

def load_model():
    """Load the pre-trained churn model and preprocessing objects"""
    global model, scaler, encoders
    
    if model is None:
        if not os.path.exists(MODEL_PATH):
            raise HTTPException(
                status_code=500, 
                detail=f"Model file not found at {MODEL_PATH}. Please train the model first using train_5_features_model.py"
            )
        with open(MODEL_PATH, 'rb') as f:
            model = pickle.load(f)
    
    if scaler is None:
        if not os.path.exists(SCALER_PATH):
            raise HTTPException(status_code=500, detail=f"Scaler file not found at {SCALER_PATH}")
        with open(SCALER_PATH, 'rb') as f:
            scaler = pickle.load(f)
    
    if encoders is None:
        if not os.path.exists(ENCODERS_PATH):
            raise HTTPException(status_code=500, detail=f"Encoders file not found at {ENCODERS_PATH}")
        with open(ENCODERS_PATH, 'rb') as f:
            encoders = pickle.load(f)
    
    return model, scaler, encoders

class CustomerData(BaseModel):
    """
    Customer data with 5 key features for churn prediction
    """
    customer_id: str
    tenure: int  # Number of months with the company (0-72)
    monthly_charges: float  # Monthly bill amount (18-120)
    total_charges: float  # Total amount charged (18-9000)
    contract: str  # Contract type: "Month-to-month", "One year", or "Two year"
    internet_service: str  # Internet service: "DSL", "Fiber optic", or "No"

def get_risk_level(probability: float) -> str:
    """Determine risk level based on churn probability"""
    if probability >= 0.7:
        return "High Risk"
    elif probability >= 0.4:
        return "Medium Risk"
    else:
        return "Low Risk"

def get_retention_suggestions(customer_data: dict, probability: float) -> list:
    """Generate retention suggestions based on customer data and churn probability"""
    suggestions = []
    
    if customer_data['contract'] == 0:  # Month-to-month
        suggestions.append("Offer long-term contract with discount")
    
    if customer_data['monthly_charges'] > 70:
        suggestions.append("Review pricing plan - consider offering discount")
    
    if customer_data['tenure'] < 12:
        suggestions.append("New customer - provide onboarding support and loyalty incentives")
    
    if customer_data['internet_service'] == 1:  # Fiber optic
        suggestions.append("Fiber optic users have higher churn - ensure service quality")
    
    if probability >= 0.7:
        suggestions.append("URGENT: Contact customer immediately with retention offer")
    elif probability >= 0.4:
        suggestions.append("Schedule proactive customer satisfaction call")
    
    return suggestions if suggestions else ["Customer appears stable - continue regular engagement"]

@router.post("/predict")
def predict_churn(customer: CustomerData):
    """
    Predict churn probability for a customer using 5 key features
    
    Returns:
    - customer_id: Customer identifier
    - prediction: 0 (No Churn) or 1 (Churn)
    - probability: Churn probability (0-1)
    - status: Risk level (Low/Medium/High Risk)
    - suggestions: Retention recommendations
    """
    try:
        # Load model and preprocessing objects
        clf, scaler_obj, encoders_obj = load_model()
        
        # Convert to dict
        customer_dict = customer.dict()
        customer_id = customer_dict.pop('customer_id')
        
        # Encode categorical variables
        contract_encoded = encoders_obj['contract'].transform([customer_dict['contract']])[0]
        internet_encoded = encoders_obj['internet'].transform([customer_dict['internet_service']])[0]
        
        # Create feature dataframe in correct order
        X = pd.DataFrame({
            'tenure': [customer_dict['tenure']],
            'MonthlyCharges': [customer_dict['monthly_charges']],
            'TotalCharges': [customer_dict['total_charges']],
            'Contract': [contract_encoded],
            'InternetService': [internet_encoded]
        })
        
        # Scale features
        X_scaled = scaler_obj.transform(X)
        
        # Predict
        prediction = clf.predict(X_scaled)[0]
        probability = clf.predict_proba(X_scaled)[0][1]  # Probability of churn (class 1)
        
        # Get risk level
        status = get_risk_level(probability)
        
        # Prepare data for suggestions
        suggestion_data = {
            'contract': contract_encoded,
            'monthly_charges': customer_dict['monthly_charges'],
            'tenure': customer_dict['tenure'],
            'internet_service': internet_encoded
        }
        
        # Get suggestions
        suggestions = get_retention_suggestions(suggestion_data, probability)
        
        return {
            "customer_id": customer_id,
            "prediction": int(prediction),
            "prediction_label": "Churn" if prediction == 1 else "No Churn",
            "probability": round(float(probability), 3),
            "status": status,
            "suggestions": suggestions,
            "input_features": {
                "tenure": customer_dict['tenure'],
                "monthly_charges": customer_dict['monthly_charges'],
                "total_charges": customer_dict['total_charges'],
                "contract": customer_dict['contract'],
                "internet_service": customer_dict['internet_service']
            }
        }
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid input: {str(e)}")
    except FileNotFoundError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

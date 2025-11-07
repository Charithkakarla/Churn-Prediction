from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pickle
import os
from utils.preprocessing import preprocess_data, get_risk_level, get_retention_suggestions

router = APIRouter()

# Load model
MODEL_PATH = "./models/churn_model.pkl"
model = None

def load_model():
    """Load the pre-trained churn model"""
    global model
    if model is None:
        if not os.path.exists(MODEL_PATH):
            raise HTTPException(
                status_code=500, 
                detail=f"Model file not found at {MODEL_PATH}. Please place churn_model.pkl in backend/models/"
            )
        with open(MODEL_PATH, 'rb') as f:
            model = pickle.load(f)
    return model

class EmployeeData(BaseModel):
    employee_id: str
    tenure: int
    monthly_salary: float
    performance_score: float
    satisfaction_level: float
    last_evaluation: float
    number_project: int
    average_monthly_hours: int
    time_spend_company: int
    work_accident: int
    promotion_last_5years: int
    department: str
    salary_level: str = "medium"

@router.post("/predict")
def predict_churn(employee: EmployeeData):
    """Predict churn probability for an employee"""
    try:
        # Load model
        clf = load_model()
        
        # Convert to dict
        employee_dict = employee.dict()
        employee_id = employee_dict.pop('employee_id')
        
        # Preprocess
        X = preprocess_data(employee_dict, fit=False)
        
        # Predict
        prediction = clf.predict(X)[0]
        probability = clf.predict_proba(X)[0][1]  # Probability of churn (class 1)
        
        # Get risk level
        status = get_risk_level(probability)
        
        # Get suggestions
        suggestions = get_retention_suggestions(employee_dict, probability)
        
        return {
            "employee_id": employee_id,
            "prediction": int(prediction),
            "probability": round(float(probability), 3),
            "status": status,
            "suggestions": suggestions
        }
    
    except FileNotFoundError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

from fastapi import APIRouter, HTTPException
import pandas as pd
import os

router = APIRouter()

def load_employees():
    """Load employees from CSV"""
    csv_path = "./data/employees.csv"
    if not os.path.exists(csv_path):
        raise HTTPException(status_code=404, detail="Employee data not found")
    
    df = pd.read_csv(csv_path)
    return df

@router.get("/employees")
def get_employees(
    department: str = None,
    risk_level: str = None,
    search: str = None,
    page: int = 1,
    limit: int = 50
):
    """Get all employees with optional filters"""
    try:
        df = load_employees()
        
        # Apply filters
        if department:
            df = df[df['department'].str.lower() == department.lower()]
        
        if risk_level:
            df = df[df['status'].str.lower() == risk_level.lower()]
        
        if search:
            search_lower = search.lower()
            df = df[
                df['name'].str.lower().str.contains(search_lower) |
                df['employee_id'].str.lower().str.contains(search_lower)
            ]
        
        # Pagination
        total = len(df)
        start = (page - 1) * limit
        end = start + limit
        df_page = df.iloc[start:end]
        
        # Convert to dict
        employees = df_page.to_dict('records')
        
        return {
            "employees": employees,
            "total": total,
            "page": page,
            "limit": limit,
            "total_pages": (total + limit - 1) // limit
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/employee/{employee_id}")
def get_employee(employee_id: str):
    """Get single employee by ID"""
    try:
        df = load_employees()
        employee = df[df['employee_id'] == employee_id]
        
        if employee.empty:
            raise HTTPException(status_code=404, detail="Employee not found")
        
        return employee.iloc[0].to_dict()
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

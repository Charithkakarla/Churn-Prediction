"""
Test script for the 5-feature churn prediction model
"""

import requests
import json

# API endpoint
API_URL = "http://localhost:8000/predict"

# Test cases
test_cases = [
    {
        "name": "High Risk Customer",
        "data": {
            "customer_id": "TEST-001",
            "tenure": 2,
            "monthly_charges": 85.0,
            "total_charges": 170.0,
            "contract": "Month-to-month",
            "internet_service": "Fiber optic"
        }
    },
    {
        "name": "Low Risk Customer",
        "data": {
            "customer_id": "TEST-002",
            "tenure": 48,
            "monthly_charges": 45.0,
            "total_charges": 2160.0,
            "contract": "Two year",
            "internet_service": "DSL"
        }
    },
    {
        "name": "Medium Risk Customer",
        "data": {
            "customer_id": "TEST-003",
            "tenure": 12,
            "monthly_charges": 70.0,
            "total_charges": 840.0,
            "contract": "One year",
            "internet_service": "Fiber optic"
        }
    }
]

def test_prediction(test_case):
    """Test a single prediction"""
    print(f"\n{'='*60}")
    print(f"Testing: {test_case['name']}")
    print(f"{'='*60}")
    
    try:
        response = requests.post(API_URL, json=test_case['data'])
        
        if response.status_code == 200:
            result = response.json()
            
            print(f"\n✓ Prediction successful!")
            print(f"\nCustomer ID: {result['customer_id']}")
            print(f"Prediction: {result['prediction_label']}")
            print(f"Probability: {result['probability']:.1%}")
            print(f"Risk Level: {result['status']}")
            
            print(f"\nRetention Suggestions:")
            for i, suggestion in enumerate(result['suggestions'], 1):
                print(f"  {i}. {suggestion}")
            
            return True
        else:
            print(f"\n✗ Error: {response.status_code}")
            print(response.text)
            return False
            
    except requests.exceptions.ConnectionError:
        print("\n✗ Error: Could not connect to API")
        print("Make sure the FastAPI server is running:")
        print("  cd employee-insight-portal/backend")
        print("  uvicorn app:app --reload --port 8000")
        return False
    except Exception as e:
        print(f"\n✗ Error: {str(e)}")
        return False

def main():
    print("="*60)
    print("Customer Churn Prediction - 5 Features Model Test")
    print("="*60)
    
    # Test all cases
    results = []
    for test_case in test_cases:
        success = test_prediction(test_case)
        results.append(success)
    
    # Summary
    print(f"\n{'='*60}")
    print("Test Summary")
    print(f"{'='*60}")
    print(f"Total tests: {len(results)}")
    print(f"Passed: {sum(results)}")
    print(f"Failed: {len(results) - sum(results)}")
    
    if all(results):
        print("\n✓ All tests passed!")
    else:
        print("\n✗ Some tests failed")

if __name__ == "__main__":
    main()

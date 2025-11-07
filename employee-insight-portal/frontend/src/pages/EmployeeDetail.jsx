import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

function EmployeeDetail() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployeeData();
  }, [id]);

  const fetchEmployeeData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch employee details
      const empResponse = await axios.get(`${API_URL}/employee/${id}`);
      setEmployee(empResponse.data);

      // Fetch prediction
      const predResponse = await axios.post(`${API_URL}/predict`, empResponse.data);
      setPrediction(predResponse.data);
    } catch (err) {
      setError('Failed to load employee data. Make sure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading employee details...</p>
        </div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error || 'Employee not found'}
        </div>
        <Link to="/employees" className="mt-4 inline-block text-primary-600 hover:text-primary-900">
          ← Back to Employees
        </Link>
      </div>
    );
  }

  const getRiskColor = (status) => {
    if (!status) return 'gray';
    const statusLower = status.toLowerCase();
    if (statusLower.includes('high')) return 'red';
    if (statusLower.includes('medium')) return 'yellow';
    return 'green';
  };

  const riskColor = getRiskColor(prediction?.status);

  return (
    <div className="max-w-6xl mx-auto">
      <Link to="/employees" className="inline-flex items-center text-primary-600 hover:text-primary-900 mb-6">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Employees
      </Link>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{employee.name}</h1>
            <p className="text-gray-600">{employee.employee_id} • {employee.department}</p>
          </div>
          {prediction && (
            <div className={`px-4 py-2 bg-${riskColor}-100 text-${riskColor}-800 rounded-lg font-semibold`}>
              {prediction.status}
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal Info */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Personal Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Employee ID:</span>
              <span className="font-medium text-gray-900">{employee.employee_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="font-medium text-gray-900">{employee.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Department:</span>
              <span className="font-medium text-gray-900">{employee.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tenure:</span>
              <span className="font-medium text-gray-900">{employee.tenure} months</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Salary Level:</span>
              <span className="font-medium text-gray-900 capitalize">{employee.salary_level}</span>
            </div>
          </div>
        </div>

        {/* Work Metrics */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Work Metrics</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Performance Score:</span>
              <span className="font-medium text-gray-900">{employee.performance_score}/5.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Satisfaction Level:</span>
              <span className="font-medium text-gray-900">{(employee.satisfaction_level * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Evaluation:</span>
              <span className="font-medium text-gray-900">{(employee.last_evaluation * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Number of Projects:</span>
              <span className="font-medium text-gray-900">{employee.number_project}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Avg Monthly Hours:</span>
              <span className="font-medium text-gray-900">{employee.average_monthly_hours}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Work Accident:</span>
              <span className="font-medium text-gray-900">{employee.work_accident ? 'Yes' : 'No'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Promotion (Last 5 Years):</span>
              <span className="font-medium text-gray-900">{employee.promotion_last_5years ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>

        {/* Churn Prediction */}
        {prediction && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Churn Prediction</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Churn Probability:</span>
                  <span className="font-bold text-gray-900">{(prediction.probability * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`bg-${riskColor}-500 h-3 rounded-full transition-all`}
                    style={{ width: `${prediction.probability * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <span className="text-gray-600">Risk Status:</span>
                <div className={`mt-2 px-4 py-2 bg-${riskColor}-100 text-${riskColor}-800 rounded-lg font-semibold text-center`}>
                  {prediction.status}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Retention Suggestions */}
        {prediction && prediction.suggestions && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Retention Suggestions</h2>
            <ul className="space-y-2">
              {prediction.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Performance Overview</h2>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p>Performance chart visualization</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDetail;

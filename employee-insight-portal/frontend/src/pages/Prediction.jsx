import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

function Prediction() {
  const [formData, setFormData] = useState({
    tenure: '',
    monthly_charges: '',
    total_charges: '',
    contract: 'Month-to-month',
    internet_service: 'Fiber optic'
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      // Only send the 5 input features
      const payload = {
        customer_id: 'TEMP_' + Date.now(),
        tenure: parseInt(formData.tenure),
        monthly_charges: parseFloat(formData.monthly_charges),
        total_charges: parseFloat(formData.total_charges),
        contract: formData.contract,
        internet_service: formData.internet_service
      };

      const response = await axios.post(`${API_URL}/predict`, payload);
      setPrediction(response.data);
    } catch (err) {
      setError('Failed to get prediction. Please check your inputs and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (status) => {
    if (!status) return 'gray';
    const statusLower = status.toLowerCase();
    if (statusLower.includes('high')) return 'red';
    if (statusLower.includes('medium')) return 'yellow';
    return 'green';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Churn Prediction</h1>
        <p className="text-gray-600">Enter employee details to predict the likelihood of leaving</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Employee Information</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tenure */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tenure (months) *
              </label>
              <input
                type="number"
                name="tenure"
                value={formData.tenure}
                onChange={handleChange}
                required
                min="0"
                max="72"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                placeholder="e.g., 24"
              />
              <p className="text-xs text-gray-500 mt-1">How many months has the customer been with us?</p>
            </div>

            {/* Monthly Charges */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Charges ($) *
              </label>
              <input
                type="number"
                name="monthly_charges"
                value={formData.monthly_charges}
                onChange={handleChange}
                required
                min="18"
                max="120"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                placeholder="e.g., 65.50"
              />
              <p className="text-xs text-gray-500 mt-1">Customer's monthly bill amount</p>
            </div>

            {/* Total Charges */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Charges ($) *
              </label>
              <input
                type="number"
                name="total_charges"
                value={formData.total_charges}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                placeholder="e.g., 1500.00"
              />
              <p className="text-xs text-gray-500 mt-1">Total amount charged to customer (typically monthly × tenure)</p>
            </div>

            {/* Contract */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contract Type *
              </label>
              <select
                name="contract"
                value={formData.contract}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
              >
                <option value="Month-to-month">Month-to-month</option>
                <option value="One year">One year</option>
                <option value="Two year">Two year</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Customer's contract type (month-to-month has highest churn)</p>
            </div>

            {/* Internet Service */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Internet Service *
              </label>
              <select
                name="internet_service"
                value={formData.internet_service}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
              >
                <option value="DSL">DSL</option>
                <option value="Fiber optic">Fiber optic</option>
                <option value="No">No internet service</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Type of internet service (fiber optic users churn more)</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Predicting...' : 'Predict Churn Risk'}
            </button>
          </form>
        </div>

        {/* Prediction Result */}
        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {prediction && (
            <>
              {/* Main Prediction Card */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Prediction Result</h2>
                
                {/* Churn Probability */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-700 font-medium">Churn Probability:</span>
                    <span className="text-3xl font-bold text-gray-900">
                      {(prediction.probability * 100).toFixed(1)}%
                    </span>
                  </div>
                  
                  {/* Animated Progress Bar */}
                  <div className="relative w-full bg-gray-200 rounded-full h-6 overflow-hidden shadow-inner">
                    <div
                      className={`h-6 rounded-full transition-all duration-1000 ease-out ${
                        prediction.probability >= 0.7 
                          ? 'bg-gradient-to-r from-red-500 to-red-600' 
                          : prediction.probability >= 0.4 
                          ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' 
                          : 'bg-gradient-to-r from-green-400 to-green-500'
                      }`}
                      style={{ 
                        width: `${prediction.probability * 100}%`,
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    >
                      {/* Animated shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
                    </div>
                  </div>
                  
                  {/* Risk indicator markers */}
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>Low Risk</span>
                    <span>Medium Risk</span>
                    <span>High Risk</span>
                  </div>
                </div>

                {/* Risk Status */}
                <div className="mb-4">
                  <span className="text-gray-700 font-medium">Risk Level:</span>
                  <div className={`mt-2 px-4 py-2 bg-${getRiskColor(prediction.status)}-100 text-${getRiskColor(prediction.status)}-800 rounded-lg font-semibold text-center text-lg`}>
                    {prediction.status}
                  </div>
                </div>

                {/* Interpretation */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    {prediction.probability >= 0.7 ? (
                      <span className="font-medium text-red-700">
                        ⚠️ High risk of leaving. Immediate intervention recommended.
                      </span>
                    ) : prediction.probability >= 0.4 ? (
                      <span className="font-medium text-yellow-700">
                        ⚡ Moderate risk. Monitor closely and consider retention strategies.
                      </span>
                    ) : (
                      <span className="font-medium text-green-700">
                        ✓ Low risk. Employee appears stable and engaged.
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Retention Suggestions */}
              {prediction.suggestions && prediction.suggestions.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Retention Recommendations</h2>
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
            </>
          )}

          {/* Help Card */}
          {!prediction && !error && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-2">How to use:</h3>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Fill in all employee details in the form</li>
                <li>Click "Predict Churn Risk" button</li>
                <li>View the churn probability and risk level</li>
                <li>Review personalized retention recommendations</li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Prediction;

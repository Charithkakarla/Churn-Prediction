import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const modules = [
    {
      title: 'Churn Prediction',
      description: 'Predict customer churn risk using AI-powered analytics',
      icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
      path: '/prediction',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Customer Database',
      description: 'View and manage all customer records and details',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      path: '/employees',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'Analytics Dashboard',
      description: 'Visualize trends and insights with interactive charts',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      path: '/dashboard',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      title: 'AI Assistant',
      description: 'Get instant answers with our intelligent chatbot',
      icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z',
      path: '/chatbot',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl shadow-2xl p-12 text-white mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
        
        <div className="relative z-10">
          <h1 className="text-5xl font-bold mb-4">Employee Churn Prediction</h1>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl">
            Leverage AI-powered analytics to predict customer churn, identify at-risk customers, and take proactive retention actions
          </p>
          <div className="flex space-x-4">
            <Link
              to="/prediction"
              className="px-8 py-4 bg-white text-primary-700 rounded-lg font-semibold hover:bg-primary-50 transition-all transform hover:scale-105 shadow-lg"
            >
              Start Prediction
            </Link>
            <Link
              to="/dashboard"
              className="px-8 py-4 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-400 transition-all transform hover:scale-105 border-2 border-white border-opacity-30"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Workflow Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="relative">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow h-full flex flex-col">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-800">Input Data</h3>
              <p className="text-gray-600 text-sm flex-grow">Enter customer information and key metrics</p>
            </div>
            {/* Arrow */}
            <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow h-full flex flex-col">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-800">AI Analysis</h3>
              <p className="text-gray-600 text-sm flex-grow">ML model analyzes patterns and risk factors</p>
            </div>
            <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow h-full flex flex-col">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-800">Get Results</h3>
              <p className="text-gray-600 text-sm flex-grow">View churn probability and risk level</p>
            </div>
            <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Step 4 */}
          <div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow h-full flex flex-col">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">4</span>
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-800">Take Action</h3>
              <p className="text-gray-600 text-sm flex-grow">Implement retention strategies</p>
            </div>
          </div>
        </div>
      </div>

      {/* Clickable Modules */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Explore Features</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {modules.map((module, index) => (
            <Link
              key={index}
              to={module.path}
              className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 overflow-hidden"
            >
              <div className={`h-2 bg-gradient-to-r ${module.color}`}></div>
              <div className="p-8">
                <div className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 w-16 h-16 ${module.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <svg className={`w-8 h-8 ${module.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={module.icon} />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2 text-gray-800 group-hover:text-primary-600 transition-colors">
                      {module.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{module.description}</p>
                    <div className="flex items-center text-primary-600 font-semibold group-hover:translate-x-2 transition-transform">
                      <span>Explore</span>
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">76.6%</div>
            <div className="text-gray-600">Model Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">5</div>
            <div className="text-gray-600">Key Features Used</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">Real-time</div>
            <div className="text-gray-600">Instant Predictions</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
